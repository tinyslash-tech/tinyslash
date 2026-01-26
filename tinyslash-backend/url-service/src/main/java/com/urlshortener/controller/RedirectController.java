package com.urlshortener.controller;

import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.service.UrlShorteningService;
import com.urlshortener.service.AnalyticsService;
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

    @GetMapping("/{shortCode}")
    public ResponseEntity<?> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        try {
            // 1. Resolve Identity
            String domain = resolveDomain(request);

            // 2. Strict Lookup (FIX 2)
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCodeAndDomain(shortCode, domain);

            if (urlOpt.isEmpty()) {
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

                    analyticsService.recordClick(domain, shortCode, clientIp, userAgent, referer,
                            null, null, null, null, null);
                } catch (Exception e) {
                    System.err.println("Analytics error: " + e.getMessage());
                }
            }

            // Increment domain-scoped clicks
            urlShorteningService.incrementClicks(shortCode, domain);

            // 5. Password Protection Handling
            if (url.isPasswordProtected()) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create("https://" + domain + "/redirect/" + shortCode))
                        .build();
            }

            String targetUrl = url.getOriginalUrl();

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

            // 6. Final Redirect (302 Found)
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(targetUrl))
                    .build();

        } catch (Exception e) {
            System.err.println("Redirect error: " + e.getMessage());
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
}