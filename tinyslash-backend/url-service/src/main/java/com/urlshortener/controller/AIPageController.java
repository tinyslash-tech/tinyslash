package com.urlshortener.controller;

import com.urlshortener.dto.AIFieldGenerateRequest;
import com.urlshortener.dto.AIGenerateRequest;
import com.urlshortener.dto.AIGenerateResponse;
import com.urlshortener.model.PlanPolicy;
import com.urlshortener.model.Subscription;
import com.urlshortener.repository.SubscriptionRepository;
import com.urlshortener.service.AIPageService;
import com.urlshortener.service.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.cache.CacheManager;
import org.springframework.cache.Cache;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/ai")
public class AIPageController {

  @Autowired
  private AIPageService aiPageService;

  @Autowired
  private SubscriptionRepository subscriptionRepository;

  @Autowired
  private UserService userService;

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired(required = false)
  private StringRedisTemplate redisTemplate;

  @Autowired
  private CacheManager cacheManager;

  private final ConcurrentHashMap<String, Long> localIdempotencyMap = new ConcurrentHashMap<>();

  @PostMapping("/pages/generate")
  public ResponseEntity<?> generateFullPage(@RequestBody AIGenerateRequest request,
      @RequestHeader(value = "X-Request-Id", required = true) String requestId,
      Authentication authentication) {
    String userId = getAuthenticatedUser(authentication);
    if (userId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }

    // 1. Idempotency Guard
    String idempotencyKey = "ai_idempotency:" + userId + ":" + requestId;
    long now = System.currentTimeMillis();
    boolean handledByIdempotency = false;
    if (redisTemplate != null) {
      try {
        Boolean isNewRequest = redisTemplate.opsForValue().setIfAbsent(idempotencyKey, "PROCESSING", 10,
            TimeUnit.SECONDS);
        if (Boolean.FALSE.equals(isNewRequest)) {
          return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Duplicate request processing");
        }
        handledByIdempotency = true;
      } catch (Exception e) {
        // Redis connection failed, swallow and fallback to local map
      }
    }

    if (!handledByIdempotency) {
      Long expiry = localIdempotencyMap.putIfAbsent(idempotencyKey, now + 10000);
      if (expiry != null && now < expiry) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Duplicate request processing");
      }
    }

    try {
      // 2. Resolve Plan Policy
      Subscription sub = getActiveSubscription(userId);
      if (sub == null) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Active subscription required for AI generation");
      }

      PlanPolicy policy = PlanPolicy.fromString(sub.getPlanType());
      if (policy.isFree()) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("AI feature is not available for Free users");
      }

      // 3. Manual Cache Check to prevent charging
      String cacheKeyHash = DigestUtils.sha256Hex(request.getPrompt());
      String cacheKeyPartial = policy.name() + ":" + request.getCategory() + ":" + cacheKeyHash;

      boolean isCached = false;
      if (redisTemplate != null) {
        try {
          String fullKey = "aiPages::" + cacheKeyPartial;
          isCached = Boolean.TRUE.equals(redisTemplate.hasKey(fullKey));
        } catch (Exception e) {
          // Redis down, fallback to local cache check
        }
      }

      if (!isCached) {
        Cache cache = cacheManager.getCache("aiPages");
        if (cache != null && cache.get(cacheKeyPartial) != null) {
          isCached = true;
        }
      }

      if (isCached) {
        // If it's cached, just call the service. It will return from cache without API
        // call.
        AIGenerateResponse response = aiPageService.generateFullPage(request, policy.name());
        return ResponseEntity.ok(response);
      }

      // 4. Check Limits & Reset cycle if needed
      resetAiUsageIfNeeded(sub);
      int aiPagesLimit = policy.getAiPagesPerMonth();
      if (aiPagesLimit != -1 && sub.getAiPagesGenerated() != null && sub.getAiPagesGenerated() >= aiPagesLimit) {
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
            .body("AI page generation limit reached for this billing cycle");
      }

      // 5. Atomic Increment
      boolean charged = false;
      // $inc where aiPagesGenerated < aiPagesLimit (or limit == -1)
      Query query = new Query(Criteria.where("_id").is(sub.getId()));
      if (aiPagesLimit != -1) {
        query.addCriteria(Criteria.where("aiPagesGenerated").lt(aiPagesLimit));
      }
      Update update = new Update().inc("aiPagesGenerated", 1);
      var updateResult = mongoTemplate.updateFirst(query, update, Subscription.class);

      if (updateResult.getModifiedCount() == 1) {
        charged = true;
      } else {
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
            .body("Failed to acquire usage credit. Limit may be reached or concurrent request interfered.");
      }

      // 6. Call AI
      try {
        AIGenerateResponse response = aiPageService.generateFullPage(request, policy.name());
        return ResponseEntity.ok(response);
      } catch (Exception e) {
        // 7. Safe Decrement on Failure
        if (charged) {
          mongoTemplate.updateFirst(
              new Query(Criteria.where("_id").is(sub.getId())),
              new Update().inc("aiPagesGenerated", -1),
              Subscription.class);
        }
        throw e; // Let global handler catch or wrap
      }

    } finally {
      // Option to clear idempotency key here if you want failures to be instantly
      // retriable
      // Or leave it to expire naturally to debounce clicks completely for 10s.
    }
  }

  @PostMapping("/pages/generate-field")
  public ResponseEntity<?> generateField(@RequestBody AIFieldGenerateRequest request,
      @RequestHeader(value = "X-Request-Id", required = true) String requestId,
      Authentication authentication) {
    String userId = getAuthenticatedUser(authentication);
    if (userId == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
    }

    String idempotencyKey = "ai_idempotency_field:" + userId + ":" + requestId;
    long now = System.currentTimeMillis();
    boolean handledByIdempotency = false;
    if (redisTemplate != null) {
      try {
        Boolean isNewRequest = redisTemplate.opsForValue().setIfAbsent(idempotencyKey, "PROCESSING", 10,
            TimeUnit.SECONDS);
        if (Boolean.FALSE.equals(isNewRequest)) {
          return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Duplicate request processing");
        }
        handledByIdempotency = true;
      } catch (Exception e) {
        // Redis down
      }
    }
    if (!handledByIdempotency) {
      Long expiry = localIdempotencyMap.putIfAbsent(idempotencyKey, now + 10000);
      if (expiry != null && now < expiry) {
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body("Duplicate request processing");
      }
    }

    try {
      Subscription sub = getActiveSubscription(userId);
      if (sub == null) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Active subscription required");
      }

      PlanPolicy policy = PlanPolicy.fromString(sub.getPlanType());
      if (policy.isFree()) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body("AI feature is not available for Free users");
      }

      // Manual Cache Check
      String cacheKeyHash = DigestUtils.sha256Hex(request.getPrompt());
      String cacheKeyPartial = policy.name() + ":" + request.getCategory() + ":" + request.getFieldName() + ":"
          + cacheKeyHash;
      boolean isCached = false;

      if (redisTemplate != null) {
        try {
          String fullKey = "aiFields::" + cacheKeyPartial;
          isCached = Boolean.TRUE.equals(redisTemplate.hasKey(fullKey));
        } catch (Exception e) {
          // Redis down, fallback to local cache check
        }
      }

      if (!isCached) {
        org.springframework.cache.Cache cache = cacheManager.getCache("aiFields");
        if (cache != null && cache.get(cacheKeyPartial) != null) {
          isCached = true;
        }
      }

      if (isCached) {
        String response = aiPageService.generateField(request, policy.name());
        return ResponseEntity.ok(response);
      }

      // Check Limits
      resetAiUsageIfNeeded(sub);
      int aiFieldsLimit = policy.getAiFieldsPerMonth();
      if (aiFieldsLimit != -1 && sub.getAiFieldsGenerated() != null && sub.getAiFieldsGenerated() >= aiFieldsLimit) {
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED)
            .body("AI field generation limit reached for this billing cycle");
      }

      // Atomic Increment
      boolean charged = false;
      Query query = new Query(Criteria.where("_id").is(sub.getId()));
      if (aiFieldsLimit != -1) {
        query.addCriteria(Criteria.where("aiFieldsGenerated").lt(aiFieldsLimit));
      }
      Update update = new Update().inc("aiFieldsGenerated", 1);
      var updateResult = mongoTemplate.updateFirst(query, update, Subscription.class);

      if (updateResult.getModifiedCount() == 1) {
        charged = true;
      } else {
        return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body("Failed to acquire field usage credit.");
      }

      // Call AI
      try {
        String response = aiPageService.generateField(request, policy.name());
        return ResponseEntity.ok(response); // Responds with plain string
      } catch (Exception e) {
        if (charged) {
          mongoTemplate.updateFirst(
              new Query(Criteria.where("_id").is(sub.getId())),
              new Update().inc("aiFieldsGenerated", -1),
              Subscription.class);
        }
        throw e;
      }
    } finally {
      // Idempotency expires
    }
  }

  @GetMapping("/dev/fix-sub")
  public ResponseEntity<?> fixSubscription() {
    String userId = "69989e0b7edbb8598f05e7f8";
    Query query = new Query(Criteria.where("userId").is(userId));
    Update update = new Update()
        .set("planType", "PRO")
        .set("isActive", true)
        .set("status", "ACTIVE")
        .set("aiPagesGenerated", 0)
        .set("aiFieldsGenerated", 0)
        .unset("expiresAt")
        .unset("renewalDate");

    var result = mongoTemplate.upsert(query, update, Subscription.class);
    Subscription activeSub = getActiveSubscription(userId);
    return ResponseEntity.ok("Updated: " + result.getModifiedCount() +
        ", Upserted: " + result.getUpsertedId() +
        ", Active Sub Found: " + (activeSub != null));
  }

  private Subscription getActiveSubscription(String userId) {
    // Find best active subscription
    return subscriptionRepository.findByUserIdAndIsActiveTrue(userId).stream()
        .filter(sub -> sub.getExpiresAt() == null || sub.getExpiresAt().isAfter(LocalDateTime.now()))
        .findFirst()
        .orElse(null);
  }

  private void resetAiUsageIfNeeded(Subscription sub) {
    LocalDateTime now = LocalDateTime.now();
    if (sub.getAiUsageResetAt() == null || now.isAfter(sub.getAiUsageResetAt())) {
      sub.setAiPagesGenerated(0);
      sub.setAiFieldsGenerated(0);

      // Align reset with the next billing cycle. For simplicity, add 1 month.
      LocalDateTime nextReset = sub.getRenewalDate() != null ? sub.getRenewalDate() : now.plusMonths(1);
      if (nextReset.isBefore(now)) {
        nextReset = now.plusMonths(1);
      }
      sub.setAiUsageResetAt(nextReset);
      subscriptionRepository.save(sub);
    }
  }

  private String getAuthenticatedUser(Authentication authentication) {
    if (authentication == null) {
      return null;
    }
    Object principal = authentication.getPrincipal();
    if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
      return ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
    } else {
      return principal.toString();
    }
  }
}
