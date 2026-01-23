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
    public ResponseEntity<Void> redirect(@PathVariable String shortCode, HttpServletRequest request) {
        try {
            // 1. Resolve Identity
            String domain = resolveDomain(request);

            // 2. Strict Lookup (FIX 2)
            Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCodeAndDomain(shortCode, domain);

            if (urlOpt.isEmpty()) {
                // Return 404 if not found (or strict mismatch)
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

            // 4. Domain-Aware Analytics (FIX 3)
            // prevents cross-tenant data leakage
            if (analyticsService != null) {
                try {
                    String userAgent = request.getHeader("User-Agent");
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
                // Redirect to password entry page (still 302)
                return ResponseEntity.status(HttpStatus.FOUND)
                        .location(URI.create("https://" + domain + "/redirect/" + shortCode))
                        .build();
            }

            // 6. Final Redirect (302 Found)
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(url.getOriginalUrl()))
                    .build();

        } catch (Exception e) {
            System.err.println("Redirect error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}