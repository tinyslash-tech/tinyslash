package com.urlshortener.controller;

import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.service.UrlShorteningService;
import com.urlshortener.service.AnalyticsService;
import com.urlshortener.service.GeoIPService;
import com.urlshortener.service.PixelFiringService;
import com.urlshortener.dto.PixelRequestContext;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
public class RedirectController {

    @Autowired
    private UrlShorteningService urlShorteningService;

    @Autowired(required = false)
    private AnalyticsService analyticsService;

    @Autowired(required = false)
    private GeoIPService geoIPService;

    @Autowired
    private com.urlshortener.service.TrustVerificationService trustService;

    @Autowired
    private PixelFiringService pixelFiringService;

    /**
     * Strict Domain Resolution (FIX 1)
     * No guessing. No rewriting. Host header is the source of truth.
     */
    private String resolveDomain(HttpServletRequest request) {
        String host = request.getHeader("Host");
        if (host == null || host.isBlank()) {
            throw new IllegalStateException("Missing Host header");
        }
        return host.toLowerCase();
    }

    @GetMapping("/debug/{shortCode}")
    public ResponseEntity<String> debugUrl(@PathVariable String shortCode, HttpServletRequest request) {
        try {
            String domain = resolveDomain(request);

            StringBuilder debug = new StringBuilder();
            debug.append("🔍 DEBUG INFO (Strict Mode):\n");
            debug.append("ShortCode: ").append(shortCode).append("\n");
            debug.append("Domain (Host Header): ").append(domain).append("\n");

            // FIX 4: Debug must mirror production strictness
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCodeAndDomain(shortCode, domain);

            if (urlOpt.isPresent()) {
                ShortenedUrl url = urlOpt.get();
                debug.append("✅ FOUND:\n");
                debug.append("  Original URL: ").append(url.getOriginalUrl()).append("\n");
                debug.append("  Owner Domain: ").append(url.getDomain()).append("\n");
                debug.append("  Short URL: ").append(url.getShortUrl()).append("\n");
            } else {
                debug.append("❌ NOT FOUND (Strict Lookup Failed)\n");
                debug.append("  Note: Using domain '").append(domain)
                        .append("'. If the link exists under 'tinyslash.com', you must access it via that domain.\n");
            }

            return ResponseEntity.ok(debug.toString());

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @Autowired
    private com.urlshortener.repository.QrCodeRepository qrCodeRepository;

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        try {
            // 1. Resolve Identity
            String domain = resolveDomain(request);

            // 2. Strict Lookup (FIX 2)
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCodeAndDomain(shortCode, domain);

            // Fallback: Try looser lookup if strict fails (for dev/testing/legacy)
            if (urlOpt.isEmpty()) {
                urlOpt = urlShorteningService.findByShortCodeIgnoreDomain(shortCode);
            }

            if (urlOpt.isEmpty()) {
                // Feature: Handle QR Codes via main Short Link path (Fixes VerifiedPage
                // redirect loop)
                // If not a ShortLink, check if it's a QR Code.
                if (qrCodeRepository.findByShortCode(shortCode).isPresent()) {
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(URI.create("/q/" + shortCode))
                            .build();
                }
                return ResponseEntity.notFound().build();
            }

            ShortenedUrl url = urlOpt.get();

            // 3. Validation Checks
            if (!url.isActive()) {
                return ResponseEntity.status(HttpStatus.GONE).build();
            }

            if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
                return ResponseEntity.status(HttpStatus.GONE).build();
            }

            if (url.getMaxClicks() != null && url.getTotalClicks() >= url.getMaxClicks()) {
                return ResponseEntity.status(HttpStatus.GONE).build();
            }

            String userAgent = request.getHeader("User-Agent");

            // --- FEATURE: SMART LINK PREVIEW (Universal Bot Detection) ---
            if (url.getSmartLinkPreview() != null && url.getSmartLinkPreview().isEnabled()) {
                if (isPreviewBot(userAgent)) {
                    return serveSmartPreview(url);
                }
            }

            // 4. Domain-Aware Analytics (FIX 3)
            if (analyticsService != null) {
                try {
                    String referer = request.getHeader("Referer");
                    String clientIp = getClientIpAddress(request);

                    // Resolve geo location from IP using MaxMind
                    String country = null;
                    String region = null;
                    String city = null;
                    if (geoIPService != null && geoIPService.isAvailable()) {
                        java.util.Map<String, String> geoData = geoIPService.resolveLocation(clientIp);
                        country = geoData.get("country");
                        region = geoData.get("region");
                        city = geoData.get("city");
                    }

                    analyticsService.recordClick(domain, shortCode, clientIp, userAgent, referer,
                            country, region, city, null, null, null);
                } catch (Exception e) {
                    System.err.println("Analytics error: " + e.getMessage());
                }
            }

            // Increment domain-scoped clicks
            try {
                urlShorteningService.incrementClicks(shortCode, domain);
            } catch (Exception e) {
                System.err.println("Warning: Failed to increment clicks for " + shortCode + ": " + e.getMessage());
                // Non-critical failure, proceed with redirect
            }

            // --- FEATURE: PIXEL FIRING (Async) ---
            if (url.getPixelIds() != null && !url.getPixelIds().isEmpty()) {
                try {
                    String referer = request.getHeader("Referer");
                    // userAgent is already defined at line 121

                    PixelRequestContext context = PixelRequestContext.builder()
                            .linkId(url.getId())
                            .shortCode(url.getShortCode())
                            .originalUrl(url.getOriginalUrl())
                            .userId(url.getUserId())
                            .ipAddress(getClientIpAddress(request))
                            .userAgent(userAgent != null ? userAgent : "unknown")
                            .referrer(referer)
                            .clickTime(java.time.Instant.now())
                            .eventId(UUID.randomUUID().toString())
                            .build();

                    pixelFiringService.fireAsync(url.getId(), url.getShortCode(), url.getPixelIds(), context);
                } catch (Exception e) {
                    System.err.println("Pixel firing error: " + e.getMessage());
                }
            }

            // 5. Password Protection Handling
            if (url.isPasswordProtected()) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create("https://" + domain + "/redirect/" + shortCode))
                        .build();
            }

            String targetUrl = url.getOriginalUrl();

            // --- FEATURE: SMART ACTION / MULTI-ACTION QR ---
            if (url.getSmartActionConfig() != null && url.getSmartActionConfig().isEnabled()) {
                return serveSmartActionPage(url);
            }

            // --- FEATURE: APP DEEP LINKING (Zero-Config) ---
            if (url.getDeepLinkConfig() != null && url.getDeepLinkConfig().isEnabled()) {
                String deepLink = generateAppDeepLink(targetUrl, userAgent);
                if (deepLink != null) {
                    // For Deep Links, we typically redirect to the intent URI
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(URI.create(deepLink))
                            .build();
                }
            }

            // --- FEATURE: GEO-LINGUISTIC ROUTING ---
            if (url.getGeoConfig() != null && url.getGeoConfig().isEnabled()) {
                String geoUrl = getMatchedGeoUrl(url.getGeoConfig(), request);
                if (geoUrl != null && !geoUrl.isEmpty()) {
                    targetUrl = geoUrl;
                }
            }

            // --- FEATURE: TRUST BADGE (High Trust Interstitial) ---
            // Check if Owner is Verified
            if (url.getUserId() != null) {
                Optional<com.urlshortener.model.TrustVerification> trustOpt = trustService
                        .getApprovedVerification(url.getUserId());
                if (trustOpt.isPresent()) {
                    com.urlshortener.model.TrustVerification trust = trustOpt.get();
                    // Check if not expired (or if expiration is not set/indefinite)
                    if (trust.getExpiresAt() == null || trust.getExpiresAt().isAfter(java.time.LocalDateTime.now())) {
                        boolean trustViewed = hasTrustCookie(request, shortCode);
                        if (!trustViewed) {
                            // Redirect to Trust Page
                            return ResponseEntity.status(HttpStatus.FOUND)
                                    .location(URI.create("/verified/" + shortCode))
                                    .build();
                        }
                    }
                }
            }

            // --- FEATURE: LEAD LOCK (Industry Grade) ---
            if (url.getLeadLockConfig() != null && url.getLeadLockConfig().isEnabled()) {
                // Check if user has already unlocked this link (via cookie or valid session)
                // If allow-list cookie is missing (simplified for demo):
                boolean unlocked = hasUnlockCookie(request, shortCode);
                if (!unlocked) {
                    // Redirect to Frontend Unlock Page
                    // Frontend Route: /unlock/:shortCode
                    return ResponseEntity.status(HttpStatus.FOUND)
                            .location(URI.create("/unlock/" + shortCode))
                            .build();
                }
            }

            // 6. Final Redirect (302 Found)
            if (targetUrl == null || targetUrl.isBlank()) {
                System.err.println("Error: Target URL is null or empty for shortCode: " + shortCode);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid Destination URL");
            }

            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(targetUrl))
                    .build();

        } catch (Exception e) {
            System.err.println("Redirect error for shortCode " + shortCode + ": " + e.getMessage());
            e.printStackTrace(); // Helpful for debugging in logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private boolean isPreviewBot(String userAgent) {
        if (userAgent == null)
            return false;
        String ua = userAgent.toLowerCase();
        return ua.contains("whatsapp") || ua.contains("facebookexternalhit") || ua.contains("twitterbot") ||
                ua.contains("telegrambot") || ua.contains("linkedinbot") || ua.contains("slackbot") ||
                ua.contains("discordbot") || ua.contains("bsky");
    }

    private ResponseEntity<String> serveSmartPreview(ShortenedUrl url) {
        ShortenedUrl.SmartLinkPreview preview = url.getSmartLinkPreview();
        String html = "<!DOCTYPE html>\n" +
                "<html lang=\"en\">\n" +
                "<head>\n" +
                "    <meta charset=\"UTF-8\">\n" +
                "    <meta property=\"og:title\" content=\"" + escapeHtml(preview.getTitle()) + "\" />\n" +
                "    <meta property=\"og:description\" content=\"" + escapeHtml(preview.getDescription()) + "\" />\n" +
                "    <meta property=\"og:image\" content=\"" + (preview.getImage() != null ? preview.getImage() : "")
                + "\" />\n" +
                "    <meta property=\"og:url\" content=\"" + url.getOriginalUrl() + "\" />\n" +
                "    <meta name=\"twitter:card\" content=\"summary_large_image\" />\n" +
                "    <title>" + escapeHtml(preview.getTitle()) + "</title>\n" +
                "</head>\n" +
                "<body>\n" +
                "</body>\n" +
                "</html>";

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "text/html; charset=utf-8");
        return new ResponseEntity<>(html, headers, HttpStatus.OK);
    }

    private String escapeHtml(String input) {
        if (input == null)
            return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }

    private String generateAppDeepLink(String targetUrl, String userAgent) {
        if (userAgent == null)
            return null;
        String ua = userAgent.toLowerCase();
        boolean isAndroid = ua.contains("android");

        if (!isAndroid)
            return null; // Initially supporting Android Zero-Config "Intent"

        // Amazon
        if (targetUrl.contains("amazon.in") || targetUrl.contains("amzn.to")) {
            String cleanUrl = targetUrl.replace("https://", "").replace("http://", "");
            return "intent://" + cleanUrl + "#Intent;scheme=https;package=com.amazon.mShop.android.shopping;end";
        }

        // Flipkart
        if (targetUrl.contains("flipkart.com")) {
            String cleanUrl = targetUrl.replace("https://", "").replace("http://", "");
            return "intent://" + cleanUrl + "#Intent;scheme=https;package=com.flipkart.android;end";
        }

        return null;
    }

    private boolean hasTrustCookie(HttpServletRequest request, String shortCode) {
        if (request.getCookies() == null)
            return false;
        for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
            if (("trusted_" + shortCode).equals(cookie.getName())) {
                return true;
            }
        }
        return false;
    }

    private boolean hasUnlockCookie(HttpServletRequest request, String shortCode) {
        if (request.getCookies() == null)
            return false;
        for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
            if (("unlocked_" + shortCode).equals(cookie.getName())) {
                return true;
            }
        }
        return false;
    }

    /**
     * FEATURE: Geo-Linguistic Redirects
     * Resolves best matching URL based on:
     * 1. Country + State + Language (Exact Match)
     * 2. State + Language
     * 3. State Only
     * 4. Country Only
     */
    private String getMatchedGeoUrl(ShortenedUrl.GeoConfig config, HttpServletRequest request) {
        if (config == null || !config.isEnabled() || config.getRules() == null || config.getRules().isEmpty()) {
            return null;
        }

        // 1. Detect Context
        String ip = getClientIpAddress(request);
        Map<String, String> location = resolveLocation(ip, request);
        String country = location.getOrDefault("country", "IN"); // Default to IN for demo
        String state = location.getOrDefault("state", "");
        String language = resolveLanguage(request);

        // 2. Iterate Rules (Priority Order matching)
        // Pass 1: Exact Match (Country + State + Language)
        for (ShortenedUrl.GeoConfig.GeoRule rule : config.getRules()) {
            if (matches(rule.getCountry(), country) &&
                    matches(rule.getState(), state) &&
                    matches(rule.getLanguage(), language)) {
                return rule.getUrl();
            }
        }

        // Pass 2: State + Language (Ignore Country if State matches)
        for (ShortenedUrl.GeoConfig.GeoRule rule : config.getRules()) {
            if (matches(rule.getState(), state) && matches(rule.getLanguage(), language)) {
                return rule.getUrl();
            }
        }

        // Pass 3: State Only
        for (ShortenedUrl.GeoConfig.GeoRule rule : config.getRules()) {
            if (matches(rule.getState(), state) && isEmpty(rule.getLanguage())) {
                return rule.getUrl();
            }
        }

        // Pass 4: Language Only (Global fallback for language)
        for (ShortenedUrl.GeoConfig.GeoRule rule : config.getRules()) {
            if (isEmpty(rule.getState()) && matches(rule.getLanguage(), language)) {
                return rule.getUrl();
            }
        }

        return config.getDefaultUrl();
    }

    private boolean matches(String ruleValue, String actualValue) {
        if (ruleValue == null || ruleValue.isEmpty())
            return true; // Wildcard
        return ruleValue.equalsIgnoreCase(actualValue);
    }

    private boolean isEmpty(String value) {
        return value == null || value.isEmpty();
    }

    private Map<String, String> resolveLocation(String ip, HttpServletRequest request) {
        Map<String, String> loc = new java.util.HashMap<>();

        // 1. Cloudflare / Edge Headers (Industry Standard)
        String cfCountry = request.getHeader("CF-IPCountry");
        if (cfCountry != null) {
            loc.put("country", cfCountry);
        }

        // 2. Mock State Detection for India (since we lack local DB)
        String debugState = request.getHeader("X-Debug-State");
        if (debugState != null) {
            loc.put("state", debugState);
        }

        return loc;
    }

    private String resolveLanguage(HttpServletRequest request) {
        String acceptLang = request.getHeader("Accept-Language");
        if (acceptLang != null && !acceptLang.isEmpty()) {
            String topLang = acceptLang.split(",")[0].trim();
            if (topLang.contains("-")) {
                return topLang.split("-")[0];
            }
            return topLang;
        }
        return "en";
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private ResponseEntity<String> serveSmartActionPage(ShortenedUrl url) {
        ShortenedUrl.SmartActionConfig config = url.getSmartActionConfig();

        StringBuilder html = new StringBuilder();
        html.append("<!DOCTYPE html><html lang=\"en\"><head>");
        html.append(
                "<meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
        html.append("<title>").append(escapeHtml(url.getTitle() != null ? url.getTitle() : "Select an Action"))
                .append("</title>");
        html.append("<style>");
        html.append(
                "body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }");
        html.append(
                ".card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center; }");
        html.append("h1 { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 0.5rem; }");
        html.append("p { color: #6b7280; margin-bottom: 2rem; }");
        html.append(
                ".btn { display: flex; align-items: center; justify-content: center; width: 100%; padding: 0.75rem 1rem; margin-bottom: 1rem; border-radius: 0.5rem; text-decoration: none; font-weight: 600; transition: all 0.2s; box-sizing: border-box; }");
        html.append(".btn:hover { opacity: 0.9; transform: translateY(-1px); }");
        html.append(".btn-wa { background-color: #25D366; color: white; }");
        html.append(
                ".btn-ig { background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: white; }");
        html.append(".btn-web { background-color: #111827; color: white; }");
        html.append("</style></head><body>");

        html.append("<div class=\"card\">");
        html.append("<h1>").append(escapeHtml(url.getTitle() != null ? url.getTitle() : "Link Actions"))
                .append("</h1>");
        html.append("<p>Select where you want to go</p>");

        // WhatsApp
        if (config.getWhatsapp() != null && config.getWhatsapp().isEnabled()) {
            String waUrl = "https://wa.me/" + config.getWhatsapp().getNumber();
            if (config.getWhatsapp().getMessage() != null && !config.getWhatsapp().getMessage().isEmpty()) {
                try {
                    waUrl += "?text=" + java.net.URLEncoder.encode(config.getWhatsapp().getMessage(), "UTF-8");
                } catch (Exception e) {
                }
            }
            html.append("<a href=\"").append(waUrl).append("\" class=\"btn btn-wa\">Chat on WhatsApp</a>");
        }

        // Instagram
        if (config.getInstagram() != null && config.getInstagram().isEnabled()) {
            html.append("<a href=\"").append(config.getInstagram().getUrl())
                    .append("\" class=\"btn btn-ig\">Visit Instagram</a>");
        }

        // Website
        if (config.getWebsite() != null && config.getWebsite().isEnabled()) {
            String label = config.getWebsite().getLabel() != null && !config.getWebsite().getLabel().isEmpty()
                    ? config.getWebsite().getLabel()
                    : "Visit Website";
            html.append("<a href=\"").append(config.getWebsite().getUrl()).append("\" class=\"btn btn-web\">")
                    .append(escapeHtml(label)).append("</a>");
        }

        html.append("</div></body></html>");

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "text/html; charset=utf-8");
        return new ResponseEntity<>(html.toString(), headers, HttpStatus.OK);
    }
}