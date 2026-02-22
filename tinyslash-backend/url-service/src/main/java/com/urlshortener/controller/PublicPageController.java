package com.urlshortener.controller;

import com.urlshortener.model.Page;
import com.urlshortener.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.urlshortener.dto.PageInteractionBatchRequest;

import jakarta.servlet.http.HttpServletRequest;

import com.urlshortener.dto.WAInteractionRequest;
import com.urlshortener.dto.WAInteractionResponse;
import com.urlshortener.model.WAInteraction;
import com.urlshortener.model.PageBlock;
import com.urlshortener.model.User;
import com.urlshortener.model.PlanPolicy;
import com.urlshortener.service.WhatsAppTemplateService;
import com.urlshortener.service.SubscriptionService;
import com.urlshortener.service.GeoIPService;
import com.urlshortener.repository.PageRepository;
import com.urlshortener.repository.WAInteractionRepository;
import eu.bitwalker.useragentutils.UserAgent;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/public/pages")
public class PublicPageController {

  @Autowired
  private PageService pageService;

  @Autowired
  private PageRepository pageRepository;

  @Autowired
  private SubscriptionService subscriptionService;

  @Autowired
  private WhatsAppTemplateService waTemplateService;

  @Autowired
  private WAInteractionRepository waInteractionRepository;

  @Autowired
  private GeoIPService geoIPService;

  private static class TapWindow {
    Instant firstTap = Instant.now();
    int count = 1;
    Instant lastTap = Instant.now();
    String lastLinkId = null;
  }

  private final Map<String, TapWindow> rateLimiter = new ConcurrentHashMap<>();

  @GetMapping("/{slug}")
  public ResponseEntity<Page> getPageBySlug(@PathVariable String slug) {
    return ResponseEntity.ok(pageService.getPageBySlug(slug));
  }

  @PostMapping("/{pageId}/view")
  public ResponseEntity<Void> recordView(
      @PathVariable String pageId,
      @RequestBody(required = false) PageInteractionBatchRequest req,
      HttpServletRequest request) {

    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.isEmpty()) {
      ip = request.getRemoteAddr();
    }
    String userAgent = request.getHeader("User-Agent");
    String referer = request.getHeader("Referer");
    String cfCountry = request.getHeader("CF-IPCountry");

    // Initialize an empty request if none was provided by the client (legacy
    // compatibility)
    if (req == null) {
      req = new PageInteractionBatchRequest();
    }

    pageService.recordView(pageId, ip, userAgent, referer, req, cfCountry);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{pageId}/interactions-batch")
  public ResponseEntity<Void> recordInteractionsBatch(
      @PathVariable String pageId,
      @RequestBody PageInteractionBatchRequest batch) {

    pageService.recordInteractionsBatch(pageId, batch);
    return ResponseEntity.ok().build();
  }

  @PostMapping("/{pageId}/wa-init")
  public ResponseEntity<WAInteractionResponse> initiateWhatsApp(
      @PathVariable String pageId,
      @RequestBody WAInteractionRequest req,
      HttpServletRequest request) {

    // 1. Fetch Page
    Page page = pageRepository.findById(pageId).orElse(null);
    if (page == null) {
      return ResponseEntity.notFound().build();
    }

    // 2. Validate visitorId
    String visitorId = req.getVisitorId();
    if (visitorId == null || visitorId.isEmpty()) {
      visitorId = UUID.randomUUID().toString();
    }

    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.isEmpty())
      ip = request.getRemoteAddr();
    if (ip == null)
      ip = "unknown";

    // 3. Plan Enforcement
    User owner = subscriptionService.getUser(page.getUserId());
    PlanPolicy plan = PlanPolicy.fromString(String.valueOf(owner.getSubscriptionPlan()));
    String planStr = String.valueOf(owner.getSubscriptionPlan()).toUpperCase();
    boolean isProOrBiz = planStr.contains("PRO") || planStr.contains("BUSINESS");

    // 4. Link Validation & Extraction
    String linkId = req.getLinkId();
    String linkLabelSnapshot = null;
    boolean hadLinkContext = false;

    if (isProOrBiz && linkId != null && !linkId.isEmpty() && page.getBlocks() != null) {
      for (PageBlock block : page.getBlocks()) {
        if (linkId.equals(block.getId())) {
          hadLinkContext = true;
          if (block.getContent() != null) {
            Object titleObj = block.getContent().get("title");
            if (titleObj != null)
              linkLabelSnapshot = titleObj.toString();
          }
          break;
        }
      }
    }

    if (!hadLinkContext) {
      linkId = null;
    }

    // 5. Template Engine Execution & Build Deep Link
    String waNumber = page.getWaNumber();
    if (waNumber == null || waNumber.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    String template = hadLinkContext && isProOrBiz ? page.getWaSmartTemplate() : page.getWaDefaultMessage();
    String city = "";

    if (geoIPService != null && geoIPService.isAvailable()) {
      Map<String, String> loc = geoIPService.resolveLocation(ip);
      if (loc != null && loc.get("city") != null)
        city = loc.get("city");
    }

    String message = waTemplateService.render(
        template,
        owner.getName(),
        linkLabelSnapshot,
        page.getTitle(),
        "https://tinyslash.com/" + page.getSlug(),
        city);

    String encodedMessage = URLEncoder.encode(message, StandardCharsets.UTF_8);
    String redirectUrl = waTemplateService.buildDeepLink(waNumber, encodedMessage);

    // 6. Rate Limiting & Abuse Protection
    String limiterKey = visitorId + "_" + ip;
    TapWindow window = rateLimiter.computeIfAbsent(limiterKey, k -> new TapWindow());
    boolean skipAnalytics = false;

    synchronized (window) {
      Instant now = Instant.now();
      if (Duration.between(window.firstTap, now).getSeconds() > 60) {
        window.firstTap = now;
        window.count = 0;
      }

      window.count++;

      boolean isDuplicate = linkId != null && linkId.equals(window.lastLinkId)
          && Duration.between(window.lastTap, now).getSeconds() < 5;

      if (window.count > 5 || isDuplicate)
        skipAnalytics = true;

      window.lastTap = now;
      window.lastLinkId = linkId;
    }

    if (rateLimiter.size() > 10000)
      rateLimiter.clear();

    // 7 & 8. Extract Request Context and Save WAInteraction (if allowed)
    if (!skipAnalytics && isProOrBiz) {
      WAInteraction interaction = new WAInteraction();
      interaction.setPageId(pageId);
      interaction.setLinkId(linkId);
      interaction.setLinkLabelSnapshot(linkLabelSnapshot);
      interaction.setVisitorId(visitorId);
      interaction.setHadLinkContext(hadLinkContext);

      String userAgentRaw = request.getHeader("User-Agent");
      if (userAgentRaw != null) {
        UserAgent ua = UserAgent.parseUserAgentString(userAgentRaw);
        String deviceTypeRaw = ua.getOperatingSystem().getDeviceType().getName().toUpperCase();
        if (deviceTypeRaw.contains("MOBILE"))
          interaction.setDeviceType("MOBILE");
        else if (deviceTypeRaw.contains("TABLET"))
          interaction.setDeviceType("TABLET");
        else
          interaction.setDeviceType("DESKTOP");
      }

      String refererRaw = request.getHeader("Referer");
      interaction.setRefererType(determineReferrerType(refererRaw));

      if (geoIPService != null && geoIPService.isAvailable()) {
        Map<String, String> loc = geoIPService.resolveLocation(ip);
        if (loc != null) {
          interaction.setCountry(loc.get("countryCode") != null ? loc.get("countryCode") : loc.get("country"));
          if (loc.get("city") != null)
            interaction.setCity(loc.get("city"));
        }
      }

      waInteractionRepository.save(interaction);
    }

    return ResponseEntity.ok(new WAInteractionResponse(redirectUrl));
  }

  private String determineReferrerType(String urlString) {
    if (urlString == null || urlString.isBlank())
      return "DIRECT";
    String lower = urlString.toLowerCase();
    if (lower.contains("instagram.com") || lower.contains("l.instagram.com"))
      return "INSTAGRAM";
    if (lower.contains("wa.me") || lower.contains("whatsapp.com"))
      return "WHATSAPP";
    if (lower.contains("linkedin.com"))
      return "LINKEDIN";
    return "OTHER";
  }
}
