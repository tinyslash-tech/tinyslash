package com.urlshortener.service;

import com.urlshortener.dto.PixelRequestContext;
import com.urlshortener.model.Pixel;
import com.urlshortener.model.PixelDailyStat;
import com.urlshortener.model.PixelFireEvent;
import com.urlshortener.model.PixelType;
import com.urlshortener.repository.PixelFireEventRepository;
import com.urlshortener.repository.PixelRepository;
import com.urlshortener.util.HashingUtils;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
public class PixelFiringService {

  private static final Logger log = LoggerFactory.getLogger(PixelFiringService.class);

  @Autowired
  private PixelRepository pixelRepository;

  @Autowired
  private PixelFireEventRepository pixelFireEventRepository;

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private EncryptionService encryptionService;

  @Autowired
  private StringRedisTemplate redisTemplate;

  @Autowired
  private MeterRegistry meterRegistry;

  private final WebClient webClient;

  public PixelFiringService(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder
        .clientConnector(new org.springframework.http.client.reactive.ReactorClientHttpConnector(
            reactor.netty.http.client.HttpClient.create()
                .option(io.netty.channel.ChannelOption.CONNECT_TIMEOUT_MILLIS, 300)
                .responseTimeout(Duration.ofMillis(500))))
        .build();
  }

  /**
   * Asynchronously fires pixels for a given link click.
   * Uses a dedicated thread pool and handles failures gracefully.
   */
  @Async("pixelExecutor")
  public void fireAsync(String linkId, String shortCode, List<String> pixelIds, PixelRequestContext context) {
    if (pixelIds == null || pixelIds.isEmpty())
      return;

    // P5: Sampling check is applied per-pixel inside the loop
    // Rate Limiting: 1 fire per IP per link per 5 seconds (skipped if Redis
    // unavailable)
    if (redisTemplate != null) {
      String rateLimitKey = "pixel_rate:" + linkId + ":" + context.getIpAddress();
      Boolean isAllowed = redisTemplate.opsForValue().setIfAbsent(rateLimitKey, "1", Duration.ofSeconds(5));
      if (Boolean.FALSE.equals(isAllowed)) {
        meterRegistry.counter("pixel.fire.ratelimited").increment();
        return; // Silently drop spam/bursts
      }
    }

    List<Pixel> pixels = pixelRepository.findAllById(pixelIds);

    for (Pixel pixel : pixels) {
      if (!pixel.isActive())
        continue;

      // P5: Sampling — skip based on configured sample rate
      int samplingPercent = pixel.getSamplingPercent() > 0 ? pixel.getSamplingPercent() : 100;
      if (samplingPercent < 100 && (Math.random() * 100) > samplingPercent) {
        log.debug("Pixel {} sampled out ({}% rate)", pixel.getId(), samplingPercent);
        meterRegistry.counter("pixel.fire.sampled_out", "type", pixel.getType().name()).increment();
        continue;
      }

      try {
        fireWithCircuitBreaker(pixel, context, linkId, shortCode);
      } catch (CallNotPermittedException e) {
        log.warn("Circuit open for pixel {}, skipping fire", pixel.getId());
        meterRegistry.gauge("pixel.circuit.open", 1);
        recordFailure(pixel, linkId, shortCode, "Circuit breaker open");
      } catch (Exception e) {
        log.error("Failed to fire pixel {} after retries: {}", pixel.getId(), e.getMessage());
        recordFailure(pixel, linkId, shortCode, e.getMessage());
      }
    }
  }

  @CircuitBreaker(name = "pixelService", fallbackMethod = "fallbackPixelFire")
  public void fireWithCircuitBreaker(Pixel pixel, PixelRequestContext context, String linkId, String shortCode) {
    Timer.Sample sample = Timer.start(meterRegistry);
    try {
      fireWithRetry(pixel, context);
      recordSuccess(pixel, linkId, shortCode);
      sample.stop(meterRegistry.timer("pixel.fire.duration", "status", "success"));
    } catch (Exception e) {
      sample.stop(meterRegistry.timer("pixel.fire.duration", "status", "failure"));
      throw e;
    }
  }

  private void fireWithRetry(Pixel pixel, PixelRequestContext context) {
    int maxAttempts = 3;
    long backoffMs = 100;
    Exception lastException = null;

    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        switch (pixel.getType()) {
          case FACEBOOK_CAPI -> fireFacebookCAPI(pixel, context);
          case GOOGLE_ADS -> fireGoogleAds(pixel, context);
          case WEBHOOK -> fireWebhook(pixel, context);
          default -> log.warn("Unsupported pixel type: {}", pixel.getType());
        }
        return; // Success
      } catch (Exception e) {
        lastException = e;
        if (attempt < maxAttempts) {
          try {
            TimeUnit.MILLISECONDS.sleep(backoffMs);
            backoffMs *= 2;
          } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Interrupted during retry backoff", ie);
          }
        }
      }
    }
    throw new RuntimeException("Max retries reached", lastException);
  }

  private void fireFacebookCAPI(Pixel pixel, PixelRequestContext ctx) {
    String accessToken = encryptionService.decrypt(pixel.getAccessToken());
    String url = "https://graph.facebook.com/v18.0/" + pixel.getPixelId() + "/events?access_token=" + accessToken;

    Map<String, Object> userData = new HashMap<>();
    userData.put("client_ip_address", ctx.getIpAddress());
    userData.put("client_user_agent", ctx.getUserAgent());
    if (ctx.getFbc() != null)
      userData.put("fbc", ctx.getFbc());
    if (ctx.getFbp() != null)
      userData.put("fbp", ctx.getFbp());
    if (ctx.getHashedEmail() != null)
      userData.put("em", ctx.getHashedEmail());
    if (ctx.getHashedPhone() != null)
      userData.put("ph", ctx.getHashedPhone());

    Map<String, Object> eventData = new HashMap<>();
    eventData.put("event_name", "PageView");
    eventData.put("event_time", Instant.now().getEpochSecond());
    eventData.put("event_id", ctx.getEventId());
    eventData.put("action_source", "website");
    eventData.put("user_data", userData);
    eventData.put("custom_data", Map.of("link_id", ctx.getLinkId(), "short_code", ctx.getShortCode()));

    webClient.post()
        .uri(url)
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(Map.of("data", List.of(eventData)))
        .retrieve()
        .toBodilessEntity()
        .block(Duration.ofMillis(700));
  }

  private void fireGoogleAds(Pixel pixel, PixelRequestContext ctx) {
    log.info("Firing Google Ads pixel: {}", pixel.getPixelId());
  }

  private void fireWebhook(Pixel pixel, PixelRequestContext ctx) {
    if (pixel.getConversionApiEndpoint() == null)
      return;

    Map<String, Object> payload = new HashMap<>();
    payload.put("event", "link_click");
    payload.put("timestamp", Instant.now().toString());
    payload.put("link_id", ctx.getLinkId());
    payload.put("short_code", ctx.getShortCode());
    payload.put("ip", ctx.getIpAddress());
    payload.put("user_agent", ctx.getUserAgent());

    webClient.post()
        .uri(pixel.getConversionApiEndpoint())
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(payload)
        .retrieve()
        .toBodilessEntity()
        .block(Duration.ofMillis(500));
  }

  // ─── P1: Pre-Aggregated Write Path ───────────────────────────────────────

  /**
   * Atomically upserts PixelDailyStat with $inc.
   *
   * Key insight: this is the WRITE that makes analytics fast at scale.
   * Instead of aggregating 10M raw events at query time, we pre-aggregate here
   * with a simple atomic increment. Analytics reads become O(1) indexed lookups.
   *
   * Upsert filter: { userId, pixelId, shortCode, date }
   * On insert (first fire today): also sets pixelName, pixelType, linkId
   * On update (subsequent fires): only increments the counter
   */
  private void upsertDailyStat(Pixel pixel, String linkId, String shortCode, boolean success) {
    LocalDate today = LocalDate.now(ZoneOffset.UTC);

    Query query = new Query(
        Criteria.where("userId").is(pixel.getUserId())
            .and("pixelId").is(pixel.getId())
            .and("shortCode").is(shortCode)
            .and("date").is(today));

    Update update = new Update()
        .inc(success ? "fired" : "failed", 1L)
        // setOnInsert: only set metadata on first event of the day (no repeated writes)
        .setOnInsert("userId", pixel.getUserId())
        .setOnInsert("pixelId", pixel.getId())
        .setOnInsert("shortCode", shortCode)
        .setOnInsert("linkId", linkId)
        .setOnInsert("date", today)
        .setOnInsert("pixelName", pixel.getName())
        .setOnInsert("pixelType", pixel.getType());

    mongoTemplate.upsert(query, update, PixelDailyStat.class);
  }

  private void recordSuccess(Pixel pixel, String linkId, String shortCode) {
    // Update Pixel entity totals
    pixel.setTotalFired(pixel.getTotalFired() + 1);
    pixel.setLastFiredAt(java.time.LocalDateTime.now());
    pixelRepository.save(pixel);

    // Micrometer metric
    meterRegistry.counter("pixel.fire.success", "type", pixel.getType().name()).increment();

    // P1: Pre-aggregate into daily stat (primary analytics source)
    upsertDailyStat(pixel, linkId, shortCode, true);

    // Raw audit event (90-day TTL, debug only)
    PixelFireEvent event = new PixelFireEvent(
        pixel.getId(), linkId, shortCode, pixel.getUserId(), PixelFireEvent.Status.SUCCESS);
    pixelFireEventRepository.save(event);
  }

  private void recordFailure(Pixel pixel, String linkId, String shortCode, String errorMessage) {
    pixel.setTotalFailed(pixel.getTotalFailed() + 1);
    pixelRepository.save(pixel);

    meterRegistry.counter("pixel.fire.failure", "type", pixel.getType().name()).increment();

    // P1: Pre-aggregate into daily stat
    upsertDailyStat(pixel, linkId, shortCode, false);

    // Raw audit event (90-day TTL)
    PixelFireEvent event = new PixelFireEvent(
        pixel.getId(), linkId, shortCode, pixel.getUserId(), PixelFireEvent.Status.FAILED);
    event.setErrorMessage(errorMessage);
    pixelFireEventRepository.save(event);
  }

  // Fallback — must match fireWithCircuitBreaker signature + Throwable
  public void fallbackPixelFire(Pixel pixel, PixelRequestContext context, String linkId, String shortCode,
      Throwable t) {
    log.warn("Pixel service fallback triggered for pixel {}: {}", pixel.getId(), t.getMessage());
    meterRegistry.counter("pixel.fire.fallback").increment();
    recordFailure(pixel, linkId, shortCode, "Circuit breaker fallback: " + t.getMessage());
  }
}
