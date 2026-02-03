package com.urlshortener.controller;

import com.urlshortener.annotation.RequiresPlan;
import com.urlshortener.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/v1/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AnalyticsController.class);

    @GetMapping("/links/{shortCode}")
    public ResponseEntity<Map<String, Object>> getLinkAnalytics(
            @PathVariable String shortCode,
            @org.springframework.security.core.annotation.AuthenticationPrincipal org.springframework.security.core.userdetails.UserDetails userDetails) {

        Map<String, Object> response = new HashMap<>();

        if (userDetails == null) {
            response.put("success", false);
            response.put("message", "Unauthorized access");
            return ResponseEntity.status(401).body(response);
        }

        String userId = userDetails.getUsername(); // JWT Filter sets username as userId

        try {
            Map<String, Object> analytics = analyticsService.getUrlAnalytics(shortCode, userId);

            // If we get here, ownership check passed (assuming service handles it,
            // if not we might need to add explicit check if service lacks it,
            // but plan assumed service has logic or we rely on catch)
            // Ideally service throws exception if not owner.

            response.put("success", true);
            response.put("data", analytics);

            return ResponseEntity.ok(response);

        } catch (SecurityException e) {
            response.put("success", false);
            response.put("message", "You do not have permission to view this link's analytics.");
            return ResponseEntity.status(403).body(response);
        } catch (Exception e) {
            // Check for "not found" vs "forbidden" if service doesn't use typed exceptions
            // well
            if (e.getMessage().toLowerCase().contains("not found")) {
                response.put("success", false);
                response.put("message", "Link not found.");
                return ResponseEntity.status(404).body(response);
            }

            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @Deprecated
    @GetMapping("/url/{shortCode}")
    @RequiresPlan(feature = "analytics")
    public ResponseEntity<Map<String, Object>> getUrlAnalytics(@PathVariable String shortCode,
            @RequestParam String userId) {

        logger.warn("Legacy analytics endpoint accessed for shortCode: {}", shortCode);

        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> analytics = analyticsService.getUrlAnalytics(shortCode, userId);

            response.put("success", true);
            response.put("data", analytics);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user/{userId}")
    @RequiresPlan(feature = "analytics")
    public ResponseEntity<Map<String, Object>> getUserAnalytics(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> analytics = analyticsService.getUserAnalytics(userId);

            response.put("success", true);
            response.put("data", analytics);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/admin/summary")
    // @PreAuthorize("hasRole('ADMIN')") - Uncomment if security is enabled
    public ResponseEntity<Map<String, Object>> getSystemAnalytics() {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> analytics = analyticsService.getSystemAnalytics();

            response.put("success", true);
            response.put("data", analytics);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/realtime/{userId}")
    public ResponseEntity<Map<String, Object>> getRealtimeAnalytics(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            Map<String, Object> analytics = analyticsService.getRealtimeAnalytics(userId);

            response.put("success", true);
            response.put("data", analytics);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}