package com.urlshortener.controller;

import com.urlshortener.annotation.RequiresPlan;
import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.service.UrlShorteningService;
import com.urlshortener.service.AnalyticsService;
import com.urlshortener.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;
import java.time.LocalDateTime;
import com.urlshortener.exception.SecurityViolationException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/v1/urls")
@CrossOrigin(origins = "*")
public class UrlController {

    @Autowired
    private UrlShorteningService urlShorteningService;

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    @Autowired
    private com.urlshortener.service.SecurityService securityService;

    @Autowired
    private com.urlshortener.service.PixelFiringService pixelFiringService;

    @PostMapping("/precheck")
    public ResponseEntity<Map<String, Object>> preCheckUrl(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String url = request.get("url");
            if (url == null || url.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "URL is required");
                return ResponseEntity.badRequest().body(response);
            }

            com.urlshortener.dto.SecurityDecision decision = securityService.preCheckUrl(url, null);

            response.put("success", true);
            response.put("decision", decision);

            // Simplified status for frontend
            String simpleStatus = "SAFE";
            if (decision.getDecision() == com.urlshortener.dto.SecurityDecision.Decision.BLOCK ||
                    decision.getDecision() == com.urlshortener.dto.SecurityDecision.Decision.BLOCK_TEMP) {
                simpleStatus = "UNSAFE";
            } else if (decision.getDecision() == com.urlshortener.dto.SecurityDecision.Decision.WARN) {
                simpleStatus = "CAUTION";
            }
            response.put("simpleStatus", simpleStatus);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error checking URL: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/fix-urls")
    public ResponseEntity<Map<String, Object>> fixExistingUrls() {
        Map<String, Object> response = new HashMap<>();

        try {
            // This is a one-time migration endpoint to fix existing URLs
            // You can call this once after deployment to update existing records

            response.put("success", true);
            response.put("message",
                    "URL migration completed - this feature needs to be implemented in the service layer");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Migration failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/check-alias")
    public ResponseEntity<Map<String, Object>> checkAliasAvailability(
            @RequestParam String alias,
            @RequestParam(required = false) String domain) {

        Map<String, Object> response = new HashMap<>();
        try {
            boolean available = urlShorteningService.isAliasAvailable(domain, alias);

            response.put("success", true);
            response.put("available", available);
            response.put("alias", alias);
            response.put("domain", domain);

            if (!available) {
                response.put("message", "Alias is not available.");
            } else {
                response.put("message", "Alias is available!");
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{shortCode}/redirect")
    public ResponseEntity<Map<String, Object>> handleRedirect(
            @PathVariable String shortCode,
            @RequestBody(required = false) Map<String, Object> request) {

        Map<String, Object> response = new HashMap<>();

        try {
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCode(shortCode);

            if (urlOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "URL not found");
                return ResponseEntity.status(404).body(response);
            }

            ShortenedUrl url = urlOpt.get();

            // Check if URL is active
            if (!url.isActive()) {
                response.put("success", false);
                response.put("message", "URL is no longer active");
                return ResponseEntity.status(404).body(response);
            }

            // Check if URL has expired
            if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
                response.put("success", false);
                response.put("message", "URL has expired");
                return ResponseEntity.status(410).body(response);
            }

            // Check if max clicks limit has been reached
            if (url.getMaxClicks() != null && url.getTotalClicks() >= url.getMaxClicks()) {
                response.put("success", false);
                response.put("message", "URL has reached its maximum click limit");
                return ResponseEntity.status(410).body(response);
            }

            // Check password protection
            if (url.isPasswordProtected()) {
                String providedPassword = request != null ? (String) request.get("password") : null;

                if (providedPassword == null || !providedPassword.equals(url.getPassword())) {
                    response.put("success", false);
                    response.put("message", "Password required");
                    response.put("passwordRequired", true);
                    return ResponseEntity.status(401).body(response);
                }
            }

            // Record analytics (if enabled)
            if (url.isTrackClicks() && request != null) {
                // You can add analytics recording here
                urlShorteningService.incrementClicks(shortCode, url.getDomain());

                // --- ASYNC PIXEL FIRING ---
                try {
                    // Extract context from request
                    String ipAddress = (String) request.get("ipAddress");
                    String userAgent = (String) request.get("userAgent");
                    String referrer = (String) request.get("referrer");

                    com.urlshortener.dto.PixelRequestContext.PixelRequestContextBuilder contextBuilder = com.urlshortener.dto.PixelRequestContext
                            .builder()
                            .linkId(url.getId())
                            .shortCode(url.getShortCode())
                            .originalUrl(url.getOriginalUrl())
                            .userId(url.getUserId())
                            .ipAddress(ipAddress != null ? ipAddress : "unknown")
                            .userAgent(userAgent != null ? userAgent : "unknown")
                            .referrer(referrer)
                            .clickTime(java.time.Instant.now())
                            .eventId(java.util.UUID.randomUUID().toString());

                    // Retrieve Cookie Data (fbc, fbp) if sent in request body for better matching
                    // Note: Frontend should send these if available in document.cookie
                    if (request.containsKey("fbp"))
                        contextBuilder.fbp((String) request.get("fbp"));
                    if (request.containsKey("fbc"))
                        contextBuilder.fbc((String) request.get("fbc"));

                    com.urlshortener.dto.PixelRequestContext context = contextBuilder.build();

                    // Fire Async - Non-blocking
                    if (url.getPixelIds() != null && !url.getPixelIds().isEmpty()) {
                        pixelFiringService.fireAsync(url.getId(), url.getShortCode(), url.getPixelIds(), context);
                    }
                } catch (Exception e) {
                    // Log but do not block redirect
                    System.err.println("Pixel firing init failed: " + e.getMessage());
                }
                // ---------------------------
            }

            // Return the original URL
            Map<String, Object> urlData = new HashMap<>();
            urlData.put("originalUrl", url.getOriginalUrl());
            urlData.put("shortCode", url.getShortCode());
            urlData.put("title", url.getTitle());

            // Check for Trust Badge / Verified Page
            if (url.getTrustBadgeConfig() != null && url.getTrustBadgeConfig().isRequested()) {
                // Return verified status if the user is verified
                // ideally check against TrustVerificationService, but for now we trust the
                // config status if it was set
                // or we just pass the config to frontend and let frontend decide (frontend
                // checks /trust/public anyway)
                Map<String, Object> trustData = new HashMap<>();
                trustData.put("enabled", true);

                // If status is not in config, we might want to default to pending/unchecked
                // But typically this means we should show the Verified Page which will verify
                // the trust
                urlData.put("trustBadge", trustData);
            }

            response.put("success", true);
            response.put("data", urlData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping
    @RequiresPlan(feature = "urlCreation", checkLimit = true)
    public ResponseEntity<Map<String, Object>> createShortUrl(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String originalUrl = (String) request.get("originalUrl");
            String userId = (String) request.get("userId");
            String customAlias = (String) request.get("customAlias");
            String password = (String) request.get("password");

            // Safe integer conversion with better error handling
            Integer expirationDays = null;
            Integer maxClicks = null;

            try {
                Object expDaysObj = request.get("expirationDays");
                if (expDaysObj != null) {
                    if (expDaysObj instanceof Integer) {
                        expirationDays = (Integer) expDaysObj;
                    } else if (expDaysObj instanceof String && !((String) expDaysObj).isEmpty()) {
                        expirationDays = Integer.parseInt((String) expDaysObj);
                    } else if (expDaysObj instanceof Number) {
                        expirationDays = ((Number) expDaysObj).intValue();
                    }
                }
            } catch (Exception e) {
                System.err.println("⚠️ Failed to parse expirationDays: " + e.getMessage());
            }

            try {
                Object maxClicksObj = request.get("maxClicks");
                if (maxClicksObj != null) {
                    if (maxClicksObj instanceof Integer) {
                        maxClicks = (Integer) maxClicksObj;
                    } else if (maxClicksObj instanceof String && !((String) maxClicksObj).isEmpty()) {
                        maxClicks = Integer.parseInt((String) maxClicksObj);
                    } else if (maxClicksObj instanceof Number) {
                        maxClicks = ((Number) maxClicksObj).intValue();
                    }
                }
            } catch (Exception e) {
                System.err.println("⚠️ Failed to parse maxClicks: " + e.getMessage());
            }

            String title = (String) request.get("title");
            String description = (String) request.get("description");
            String scopeType = (String) request.getOrDefault("scopeType", "USER");
            String scopeId = (String) request.getOrDefault("scopeId", userId);
            String customDomain = (String) request.get("customDomain"); // New: custom domain support

            // UTM tracking fields
            String utmSource = (String) request.get("utmSource");
            String utmMedium = (String) request.get("utmMedium");
            String utmCampaign = (String) request.get("utmCampaign");

            System.out.println("🔍 Creating URL with params:");
            System.out.println("  - originalUrl: " + originalUrl);
            System.out.println("  - userId: " + userId);
            System.out.println("  - customAlias: " + customAlias);
            System.out.println("  - password: " + (password != null && !password.isEmpty() ? "***" : "null"));
            System.out.println("  - expirationDays: " + expirationDays);
            System.out.println("  - maxClicks: " + maxClicks);
            System.out.println("  - customDomain: " + customDomain);

            if (originalUrl == null || originalUrl.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Original URL is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Note: Premium feature validation is handled by @RequiresPlan aspect
            // Additional premium features like customAlias, password, expiration, maxClicks
            // are validated in the service layer based on user's plan

            // ----------------------------------------------------
            // NEW: Parse Advanced Features from Request
            // ----------------------------------------------------
            ShortenedUrl template = new ShortenedUrl();
            template.setOriginalUrl(originalUrl);
            template.setUserId(userId);
            template.setCustomAlias(customAlias);
            template.setPassword(password);
            if (expirationDays != null)
                template.setExpiresAt(LocalDateTime.now().plusDays(expirationDays));
            template.setMaxClicks(maxClicks);
            template.setTitle(title);
            template.setDescription(description);
            template.setScopeType(scopeType);
            template.setScopeId(scopeId);
            template.setDomain(customDomain);
            template.setUtmSource(utmSource);
            template.setUtmMedium(utmMedium);
            template.setUtmCampaign(utmCampaign);

            // Parse Objects from Map
            try {
                if (request.containsKey("smartActionConfig")) {
                    template.setSmartActionConfig(objectMapper.convertValue(request.get("smartActionConfig"),
                            ShortenedUrl.SmartActionConfig.class));
                }
                if (request.containsKey("smartLinkPreview")) {
                    template.setSmartLinkPreview(objectMapper.convertValue(request.get("smartLinkPreview"),
                            ShortenedUrl.SmartLinkPreview.class));
                }
                if (request.containsKey("geoConfig")) {
                    template.setGeoConfig(
                            objectMapper.convertValue(request.get("geoConfig"), ShortenedUrl.GeoConfig.class));
                }
                if (request.containsKey("deepLinkConfig")) {
                    template.setDeepLinkConfig(objectMapper.convertValue(request.get("deepLinkConfig"),
                            ShortenedUrl.DeepLinkConfig.class));
                }
                if (request.containsKey("pixelIds")) {
                    List<String> pixelIds = (List<String>) request.get("pixelIds");
                    template.setPixelIds(pixelIds);
                }
                if (request.containsKey("leadLockConfig")) {
                    template.setLeadLockConfig(objectMapper.convertValue(request.get("leadLockConfig"),
                            ShortenedUrl.LeadLockConfig.class));
                }
                if (request.containsKey("trustBadgeConfig")) {
                    template.setTrustBadgeConfig(objectMapper.convertValue(request.get("trustBadgeConfig"),
                            ShortenedUrl.TrustBadgeConfig.class));
                }
            } catch (Exception e) {
                System.err.println("⚠️ Failed to parse advanced config: " + e.getMessage());
            }

            ShortenedUrl shortenedUrl = urlShorteningService.createShortUrl(template);

            Map<String, Object> urlData = new HashMap<>();
            urlData.put("id", shortenedUrl.getId());
            urlData.put("shortCode", shortenedUrl.getShortCode());
            urlData.put("shortUrl", shortenedUrl.getShortUrl());
            urlData.put("originalUrl", shortenedUrl.getOriginalUrl());
            urlData.put("title", shortenedUrl.getTitle());
            urlData.put("description", shortenedUrl.getDescription());
            urlData.put("createdAt", shortenedUrl.getCreatedAt());
            urlData.put("expiresAt", shortenedUrl.getExpiresAt());
            urlData.put("maxClicks", shortenedUrl.getMaxClicks());
            urlData.put("isPasswordProtected", shortenedUrl.isPasswordProtected());
            urlData.put("utmSource", shortenedUrl.getUtmSource());
            urlData.put("utmMedium", shortenedUrl.getUtmMedium());
            urlData.put("utmCampaign", shortenedUrl.getUtmCampaign());
            urlData.put("pixelIds", shortenedUrl.getPixelIds());

            response.put("success", true);
            response.put("message", "URL shortened successfully");
            response.put("data", urlData);

            return ResponseEntity.ok(response);

        } catch (SecurityViolationException e) {
            // Explicitly handle security violations to ensure 422 status is returned
            // instead of falling through to the generic catch block
            response.put("success", false);
            response.put("error", "SECURITY_BLOCKED");
            // We intentionally do not include reason/score to prevent leaking internal
            // rules
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/info/{shortCode}")
    public ResponseEntity<Map<String, Object>> getUrl(@PathVariable String shortCode) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCode(shortCode);

            if (urlOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "URL not found");
                return ResponseEntity.notFound().build();
            }

            ShortenedUrl url = urlOpt.get();

            Map<String, Object> urlData = new HashMap<>();
            urlData.put("id", url.getId());
            urlData.put("shortCode", url.getShortCode());
            urlData.put("shortUrl", url.getShortUrl());
            urlData.put("originalUrl", url.getOriginalUrl());
            urlData.put("title", url.getTitle());
            urlData.put("description", url.getDescription());
            urlData.put("totalClicks", url.getTotalClicks());
            urlData.put("createdAt", url.getCreatedAt());
            urlData.put("isPasswordProtected", url.isPasswordProtected());
            urlData.put("pixelIds", url.getPixelIds());

            response.put("success", true);
            response.put("data", urlData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserUrls(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Use cached dashboard service for better performance
            List<ShortenedUrl> urls = dashboardService.getUserUrls(userId);

            List<Map<String, Object>> urlsData = urls.stream().map(url -> {
                Map<String, Object> urlData = new HashMap<>();
                urlData.put("id", url.getId());
                urlData.put("shortCode", url.getShortCode());
                urlData.put("shortUrl", url.getShortUrl());
                urlData.put("originalUrl", url.getOriginalUrl());
                urlData.put("title", url.getTitle());
                urlData.put("description", url.getDescription());
                urlData.put("totalClicks", url.getTotalClicks());
                urlData.put("uniqueClicks", url.getUniqueClicks());
                urlData.put("createdAt", url.getCreatedAt());
                urlData.put("lastClickedAt", url.getLastClickedAt());
                urlData.put("isPasswordProtected", url.isPasswordProtected());
                urlData.put("hasQrCode", url.isHasQrCode());
                urlData.put("pixelIds", url.getPixelIds());
                return urlData;
            }).toList();

            response.put("success", true);
            response.put("count", urls.size());
            response.put("data", urlsData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{shortCode}")
    public ResponseEntity<Map<String, Object>> updateUrl(@PathVariable String shortCode,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String userId = (String) request.get("userId");

            if (userId == null) {
                response.put("success", false);
                response.put("message", "User ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            ShortenedUrl updates = new ShortenedUrl();

            // Basic fields
            if (request.containsKey("title"))
                updates.setTitle((String) request.get("title"));
            if (request.containsKey("description"))
                updates.setDescription((String) request.get("description"));
            if (request.containsKey("password"))
                updates.setPassword((String) request.get("password"));

            // New Editable Fields
            if (request.containsKey("originalUrl"))
                updates.setOriginalUrl((String) request.get("originalUrl"));

            // UTM Fields
            if (request.containsKey("utmSource"))
                updates.setUtmSource((String) request.get("utmSource"));
            if (request.containsKey("utmMedium"))
                updates.setUtmMedium((String) request.get("utmMedium"));
            if (request.containsKey("utmCampaign"))
                updates.setUtmCampaign((String) request.get("utmCampaign"));

            // Expiration (Handle days or direct ISO string if we wanted, but UI likely
            // sends days)
            // If user sends 'expirationDays', calculate date
            if (request.containsKey("expirationDays")) {
                try {
                    Object expObj = request.get("expirationDays");
                    if (expObj != null) {
                        int days = 0;
                        if (expObj instanceof Integer)
                            days = (Integer) expObj;
                        else if (expObj instanceof String && !((String) expObj).isEmpty())
                            days = Integer.parseInt((String) expObj);
                        else if (expObj instanceof Number)
                            days = ((Number) expObj).intValue();

                        if (days > 0) {
                            updates.setExpiresAt(LocalDateTime.now().plusDays(days));
                        }
                        // If 0 or negative, we might arguably want to clear it, but let's stick to
                        // setting if > 0
                    }
                } catch (Exception e) {
                    // Ignore parse error
                }
            }

            // Max Clicks
            if (request.containsKey("maxClicks")) {
                try {
                    Object maxObj = request.get("maxClicks");
                    if (maxObj != null) {
                        if (maxObj instanceof Integer)
                            updates.setMaxClicks((Integer) maxObj);
                        else if (maxObj instanceof String && !((String) maxObj).isEmpty())
                            updates.setMaxClicks(Integer.parseInt((String) maxObj));
                        else if (maxObj instanceof Number)
                            updates.setMaxClicks(((Number) maxObj).intValue());
                    }
                } catch (Exception e) {
                    // Ignore
                }
            }

            // Tags
            if (request.containsKey("tags")) {
                Object tagsObj = request.get("tags");
                if (tagsObj instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> tagsList = (List<String>) tagsObj;
                    updates.setTags(tagsList.toArray(new String[0]));
                }
            }

            // Pixel IDs
            if (request.containsKey("pixelIds")) {
                @SuppressWarnings("unchecked")
                List<String> pixelIds = (List<String>) request.get("pixelIds");
                updates.setPixelIds(pixelIds);
            }

            // Active Status
            if (request.containsKey("isActive")) {
                updates.setActive(Boolean.parseBoolean(request.get("isActive").toString()));
            }

            ShortenedUrl updated = urlShorteningService.updateUrl(shortCode, userId, updates);

            response.put("success", true);
            response.put("message", "URL updated successfully");
            response.put("data", Map.of(
                    "shortCode", updated.getShortCode(),
                    "title", updated.getTitle(),
                    "originalUrl", updated.getOriginalUrl(),
                    "description", updated.getDescription() != null ? updated.getDescription() : "",
                    "updatedAt", updated.getUpdatedAt(),
                    "pixelIds", updated.getPixelIds()));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{shortCode}")
    public ResponseEntity<Map<String, Object>> deleteUrl(@PathVariable String shortCode,
            @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            urlShorteningService.deleteUrl(shortCode, userId);

            response.put("success", true);
            response.put("message", "URL deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<Map<String, Object>> bulkDeleteUrls(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            @SuppressWarnings("unchecked")
            List<String> shortCodes = (List<String>) request.get("shortCodes");
            String userId = (String) request.get("userId");

            if (shortCodes == null || shortCodes.isEmpty()) {
                response.put("success", false);
                response.put("message", "No URLs selected for deletion");
                return ResponseEntity.badRequest().body(response);
            }

            if (userId == null || userId.isEmpty()) {
                response.put("success", false);
                response.put("message", "User ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            int successCount = 0;
            int failCount = 0;
            List<String> errors = new ArrayList<>();

            for (String shortCode : shortCodes) {
                try {
                    urlShorteningService.deleteUrl(shortCode, userId);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    errors.add(shortCode + ": " + e.getMessage());
                }
            }

            response.put("success", true);
            response.put("message", String.format("Deleted %d URLs successfully", successCount));
            response.put("successCount", successCount);
            response.put("failCount", failCount);
            if (!errors.isEmpty()) {
                response.put("errors", errors);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Bulk delete failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/{shortCode}/click")
    public ResponseEntity<Map<String, Object>> recordClick(@PathVariable String shortCode,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String ipAddress = request.get("ipAddress");
            String userAgent = request.get("userAgent");
            String referrer = request.get("referrer");
            String country = request.get("country");
            String region = request.get("region");
            String city = request.get("city");
            String deviceType = request.get("deviceType");
            String browser = request.get("browser");
            String os = request.get("os");

            // Resolve domain first
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCode(shortCode);
            if (urlOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "URL not found");
                return ResponseEntity.status(404).body(response);
            }
            ShortenedUrl url = urlOpt.get();

            analyticsService.recordClick(url.getDomain(), shortCode, ipAddress, userAgent, referrer,
                    country, region, city, deviceType, browser, os);

            response.put("success", true);
            response.put("message", "Click recorded successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Team-scoped endpoints
    @GetMapping("/scope/{scopeType}/{scopeId}")
    public ResponseEntity<Map<String, Object>> getUrlsByScope(
            @PathVariable String scopeType,
            @PathVariable String scopeId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<ShortenedUrl> urls = urlShorteningService.getUrlsByScope(scopeType, scopeId);

            response.put("success", true);
            response.put("urls", urls);
            response.put("count", urls.size());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Admin Endpoints
    @GetMapping("/admin/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllUrlsForAdmin() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ShortenedUrl> urls = urlShorteningService.getAllUrls();

            // Map to response format
            List<Map<String, Object>> urlsData = urls.stream().map(url -> {
                Map<String, Object> urlData = new HashMap<>();
                urlData.put("id", url.getId());
                urlData.put("shortCode", url.getShortCode());
                urlData.put("shortUrl", url.getShortUrl());
                urlData.put("originalUrl", url.getOriginalUrl());
                urlData.put("title", url.getTitle());
                urlData.put("description", url.getDescription());
                urlData.put("totalClicks", url.getTotalClicks());
                urlData.put("uniqueClicks", url.getUniqueClicks()); // Assuming this field exists or defaults to 0
                urlData.put("createdAt", url.getCreatedAt());
                urlData.put("expiresAt", url.getExpiresAt());
                urlData.put("lastClickedAt", url.getLastClickedAt());
                urlData.put("isPasswordProtected", url.isPasswordProtected());
                urlData.put("hasQrCode", url.isHasQrCode());
                urlData.put("userId", url.getUserId());
                urlData.put("domain", url.getDomain());
                urlData.put("tags", url.getTags());
                urlData.put("pixelIds", url.getPixelIds());
                return urlData;
            }).toList();

            response.put("success", true);
            response.put("count", urls.size());
            response.put("urls", urlsData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching all URLs: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}