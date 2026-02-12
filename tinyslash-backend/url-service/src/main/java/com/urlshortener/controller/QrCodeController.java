package com.urlshortener.controller;

import com.urlshortener.annotation.RequiresPlan;
import com.urlshortener.model.QrCode;
import com.urlshortener.service.QrCodeService;
import com.urlshortener.service.DashboardService;
import com.urlshortener.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/qr")
@CrossOrigin(origins = "*")
public class QrCodeController {

    @Autowired
    private QrCodeService qrCodeService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private DashboardService dashboardService;

    @Value("${app.shorturl.domain:https://pebly.vercel.app}")
    private String shortUrlDomain;

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @PostMapping
    @RequiresPlan(feature = "qrCreation", checkLimit = true)
    public ResponseEntity<Map<String, Object>> createQrCode(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String content = (String) request.get("content");
            String contentType = (String) request.get("contentType");
            String userId = (String) request.get("userId");
            String title = (String) request.get("title");
            String description = (String) request.get("description");
            String style = (String) request.get("style");
            String foregroundColor = (String) request.get("foregroundColor");
            String backgroundColor = (String) request.get("backgroundColor");
            Integer size = (Integer) request.get("size");
            String format = (String) request.get("format");
            String scopeType = (String) request.getOrDefault("scopeType", "USER");
            String scopeId = (String) request.getOrDefault("scopeId", userId);

            // Parse Advanced Configs
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            QrCode configContainer = new QrCode();

            // Check for explicit dynamic flag (default is true in model)
            if (request.containsKey("isDynamic")) {
                Object dynamicVal = request.get("isDynamic");
                if (dynamicVal instanceof Boolean) {
                    configContainer.setDynamic((Boolean) dynamicVal);
                } else if (dynamicVal instanceof String) {
                    configContainer.setDynamic(Boolean.parseBoolean((String) dynamicVal));
                }
            } else {
                configContainer.setDynamic(true); // Default
            }

            if (request.containsKey("geoConfig")) {
                configContainer.setGeoConfig(mapper.convertValue(request.get("geoConfig"),
                        com.urlshortener.model.ShortenedUrl.GeoConfig.class));
            }
            if (request.containsKey("deepLinkConfig")) {
                configContainer.setDeepLinkConfig(mapper.convertValue(request.get("deepLinkConfig"),
                        com.urlshortener.model.ShortenedUrl.DeepLinkConfig.class));
            }
            if (request.containsKey("leadLockConfig")) {
                configContainer.setLeadLockConfig(mapper.convertValue(request.get("leadLockConfig"),
                        com.urlshortener.model.ShortenedUrl.LeadLockConfig.class));
            }
            if (request.containsKey("smartActionConfig")) {
                configContainer.setSmartActionConfig(
                        mapper.convertValue(request.get("smartActionConfig"), QrCode.SmartActionConfig.class));
            }

            // Advanced Configs Mapping
            if (request.containsKey("trustBadge"))
                configContainer.setTrustBadge((Boolean) request.get("trustBadge"));
            if (request.containsKey("frameColor"))
                configContainer.setFrameColor((String) request.get("frameColor"));
            if (request.containsKey("frameText"))
                configContainer.setFrameText((String) request.get("frameText"));
            if (request.containsKey("frameTextColor"))
                configContainer.setFrameTextColor((String) request.get("frameTextColor"));
            if (request.containsKey("gradientType"))
                configContainer.setGradientType((String) request.get("gradientType"));
            if (request.containsKey("gradientDirection"))
                configContainer.setGradientDirection((String) request.get("gradientDirection"));
            if (request.containsKey("secondaryColor"))
                configContainer.setSecondaryColor((String) request.get("secondaryColor"));
            if (request.containsKey("centerText"))
                configContainer.setCenterText((String) request.get("centerText"));
            if (request.containsKey("centerTextColor"))
                configContainer.setCenterTextColor((String) request.get("centerTextColor"));
            if (request.containsKey("logoSize") && request.get("logoSize") instanceof Integer)
                configContainer.setLogoSize((Integer) request.get("logoSize"));
            if (request.containsKey("logoOpacity") && request.get("logoOpacity") instanceof Number)
                configContainer.setLogoOpacity(((Number) request.get("logoOpacity")).doubleValue());
            if (request.containsKey("logoCornerRadius") && request.get("logoCornerRadius") instanceof Integer)
                configContainer.setLogoCornerRadius((Integer) request.get("logoCornerRadius"));
            if (request.containsKey("centerTextFontSize") && request.get("centerTextFontSize") instanceof Integer)
                configContainer.setCenterTextFontSize((Integer) request.get("centerTextFontSize"));
            if (request.containsKey("centerTextFontFamily"))
                configContainer.setCenterTextFontFamily((String) request.get("centerTextFontFamily"));
            if (request.containsKey("centerTextBackgroundColor"))
                configContainer.setCenterTextBackgroundColor((String) request.get("centerTextBackgroundColor"));
            if (request.containsKey("centerTextBold"))
                configContainer.setCenterTextBold((Boolean) request.get("centerTextBold"));
            if (request.containsKey("centerTextOpacity") && request.get("centerTextOpacity") instanceof Number)
                configContainer.setCenterTextOpacity(((Number) request.get("centerTextOpacity")).doubleValue());
            if (request.containsKey("centerTextBackgroundOpacity")
                    && request.get("centerTextBackgroundOpacity") instanceof Number)
                configContainer.setCenterTextBackgroundOpacity(
                        ((Number) request.get("centerTextBackgroundOpacity")).doubleValue());
            if (request.containsKey("centerTextBackgroundRadius")
                    && request.get("centerTextBackgroundRadius") instanceof Integer)
                configContainer.setCenterTextBackgroundRadius((Integer) request.get("centerTextBackgroundRadius"));
            if (request.containsKey("margin") && request.get("margin") instanceof Integer)
                configContainer.setMargin((Integer) request.get("margin"));
            if (request.containsKey("frameStyle"))
                configContainer.setFrameStyle((String) request.get("frameStyle"));

            if (content == null || content.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Content is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Check subscription limits
            if (userId != null && !subscriptionService.canCreateQrCode(userId)) {
                int remaining = subscriptionService.getRemainingDailyQrCodes(userId);
                response.put("success", false);
                response.put("message", "Daily QR code limit reached. You have " + remaining
                        + " QR codes remaining today. Upgrade to Premium for unlimited access.");
                response.put("upgradeRequired", true);
                return ResponseEntity.status(429).body(response);
            }

            // Check premium features
            boolean hasCustomization = (foregroundColor != null && !foregroundColor.equals("#000000")) ||
                    (backgroundColor != null && !backgroundColor.equals("#FFFFFF")) ||
                    (style != null && !style.equals("square"));

            if (userId != null && hasCustomization && !subscriptionService.canCustomizeQrCodes(userId)) {
                response.put("success", false);
                response.put("message", "QR code customization is available with Premium plans only.");
                response.put("upgradeRequired", true);
                return ResponseEntity.status(403).body(response);
            }

            // Extract custom shortCode if provided (to align with frontend)
            String shortCode = (String) request.get("shortCode");
            // If customAlias is present, it takes precedence or is same
            if (request.containsKey("customAlias") && request.get("customAlias") != null) {
                shortCode = (String) request.get("customAlias");
            }

            QrCode qrCode = qrCodeService.createQrCode(
                    content, contentType != null ? contentType : "TEXT", userId,
                    title, description, style, foregroundColor, backgroundColor,
                    size != null ? size : 300, format != null ? format : "PNG",
                    scopeType, scopeId, configContainer, shortCode);

            Map<String, Object> qrData = new HashMap<>();
            qrData.put("id", qrCode.getId());
            qrData.put("qrCode", qrCode.getQrCode());
            qrData.put("qrImageUrl", qrCode.getQrImageUrl());
            qrData.put("qrImagePath", qrCode.getQrImagePath());
            qrData.put("content", qrCode.getContent());
            qrData.put("contentType", qrCode.getContentType());
            qrData.put("title", qrCode.getTitle());
            qrData.put("description", qrCode.getDescription());
            qrData.put("style", qrCode.getStyle());
            qrData.put("size", qrCode.getSize());
            qrData.put("format", qrCode.getFormat());
            qrData.put("size", qrCode.getSize());
            qrData.put("format", qrCode.getFormat());
            qrData.put("createdAt", qrCode.getCreatedAt());
            qrData.put("shortCode", qrCode.getShortCode());
            qrData.put("isDynamic", qrCode.isDynamic());
            qrData.put("shortUrl", qrCode.isTrustBadge()
                    ? frontendUrl + "/verified/" + qrCode.getShortCode()
                    : (qrCode.isDynamic() && qrCode.getShortCode() != null
                            ? shortUrlDomain + "/q/" + qrCode.getShortCode()
                            : null));

            // Add Advanced Fields to Response
            qrData.put("trustBadge", qrCode.isTrustBadge());
            qrData.put("frameStyle", qrCode.getFrameStyle());
            qrData.put("frameColor", qrCode.getFrameColor());
            qrData.put("frameText", qrCode.getFrameText());
            qrData.put("frameTextColor", qrCode.getFrameTextColor());
            qrData.put("gradientType", qrCode.getGradientType());
            qrData.put("gradientDirection", qrCode.getGradientDirection());
            qrData.put("secondaryColor", qrCode.getSecondaryColor());
            qrData.put("centerText", qrCode.getCenterText());
            qrData.put("centerTextColor", qrCode.getCenterTextColor());
            qrData.put("logoSize", qrCode.getLogoSize());
            qrData.put("logoOpacity", qrCode.getLogoOpacity());
            qrData.put("logoCornerRadius", qrCode.getLogoCornerRadius());
            qrData.put("centerTextFontSize", qrCode.getCenterTextFontSize());
            qrData.put("centerTextFontFamily", qrCode.getCenterTextFontFamily());
            qrData.put("centerTextBackgroundColor", qrCode.getCenterTextBackgroundColor());
            qrData.put("centerTextBold", qrCode.isCenterTextBold());
            qrData.put("centerTextOpacity", qrCode.getCenterTextOpacity());
            qrData.put("centerTextBackgroundOpacity", qrCode.getCenterTextBackgroundOpacity());
            qrData.put("centerTextBackgroundRadius", qrCode.getCenterTextBackgroundRadius());
            qrData.put("margin", qrCode.getMargin());

            // Track usage for subscription management
            if (userId != null) {
                subscriptionService.incrementQrCodeUsage(userId);
            }

            response.put("success", true);
            response.put("message", "QR Code created successfully");
            response.put("data", qrData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{qrCodeId}")
    public ResponseEntity<Map<String, Object>> getQrCode(@PathVariable String qrCodeId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Try to find by QR code first, then by ID
            Optional<QrCode> qrCodeOpt = qrCodeService.getByQrCode(qrCodeId);
            if (qrCodeOpt.isEmpty()) {
                qrCodeOpt = qrCodeService.getById(qrCodeId);
            }

            if (qrCodeOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "QR Code not found");
                return ResponseEntity.notFound().build();
            }

            QrCode qrCode = qrCodeOpt.get();

            Map<String, Object> qrData = new HashMap<>();
            qrData.put("id", qrCode.getId());
            qrData.put("qrCode", qrCode.getQrCode());
            qrData.put("qrImageUrl", qrCode.getQrImageUrl());
            qrData.put("qrImagePath", qrCode.getQrImagePath());
            qrData.put("content", qrCode.getContent());
            qrData.put("contentType", qrCode.getContentType());
            qrData.put("title", qrCode.getTitle());
            qrData.put("description", qrCode.getDescription());
            qrData.put("style", qrCode.getStyle());
            qrData.put("foregroundColor", qrCode.getForegroundColor());
            qrData.put("backgroundColor", qrCode.getBackgroundColor());
            qrData.put("size", qrCode.getSize());
            qrData.put("format", qrCode.getFormat());

            // Add Advanced Fields
            qrData.put("trustBadge", qrCode.isTrustBadge());
            qrData.put("frameStyle", qrCode.getFrameStyle());
            qrData.put("frameColor", qrCode.getFrameColor());
            qrData.put("frameText", qrCode.getFrameText());
            qrData.put("frameTextColor", qrCode.getFrameTextColor());
            qrData.put("gradientType", qrCode.getGradientType());
            qrData.put("gradientDirection", qrCode.getGradientDirection());
            qrData.put("secondaryColor", qrCode.getSecondaryColor());
            qrData.put("centerText", qrCode.getCenterText());
            qrData.put("centerTextColor", qrCode.getCenterTextColor());
            qrData.put("logoSize", qrCode.getLogoSize());
            qrData.put("logoOpacity", qrCode.getLogoOpacity());
            qrData.put("logoCornerRadius", qrCode.getLogoCornerRadius());
            qrData.put("centerTextFontSize", qrCode.getCenterTextFontSize());
            qrData.put("centerTextFontFamily", qrCode.getCenterTextFontFamily());
            qrData.put("centerTextBackgroundColor", qrCode.getCenterTextBackgroundColor());
            qrData.put("centerTextBold", qrCode.isCenterTextBold());
            qrData.put("centerTextOpacity", qrCode.getCenterTextOpacity());
            qrData.put("centerTextBackgroundOpacity", qrCode.getCenterTextBackgroundOpacity());
            qrData.put("centerTextBackgroundRadius", qrCode.getCenterTextBackgroundRadius());
            qrData.put("margin", qrCode.getMargin());

            qrData.put("totalScans", qrCode.getTotalScans());
            qrData.put("uniqueScans", qrCode.getUniqueScans());
            qrData.put("todayScans", qrCode.getTodayScans());
            qrData.put("thisWeekScans", qrCode.getThisWeekScans());
            qrData.put("thisMonthScans", qrCode.getThisMonthScans());
            qrData.put("scansByCountry", qrCode.getScansByCountry());
            qrData.put("scansByCity", qrCode.getScansByCity());
            qrData.put("scansByDevice", qrCode.getScansByDevice());
            qrData.put("scansByBrowser", qrCode.getScansByBrowser());
            qrData.put("scansByOS", qrCode.getScansByOS());
            qrData.put("scansByHour", qrCode.getScansByHour());
            qrData.put("scansByDay", qrCode.getScansByDay());
            qrData.put("shortCode", qrCode.getShortCode());
            qrData.put("isDynamic", qrCode.isDynamic());
            qrData.put("shortUrl", qrCode.isTrustBadge()
                    ? frontendUrl + "/verified/" + qrCode.getShortCode()
                    : (qrCode.isDynamic() && qrCode.getShortCode() != null
                            ? shortUrlDomain + "/q/" + qrCode.getShortCode()
                            : null));
            qrData.put("createdAt", qrCode.getCreatedAt());
            qrData.put("updatedAt", qrCode.getUpdatedAt());
            qrData.put("lastScannedAt", qrCode.getLastScannedAt());

            response.put("success", true);
            response.put("data", qrData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserQrCodes(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Use cached dashboard service for better performance
            List<QrCode> qrCodes = dashboardService.getUserQRCodes(userId);

            List<Map<String, Object>> qrCodesData = qrCodes.stream().map(qr -> {
                Map<String, Object> qrData = new HashMap<>();
                qrData.put("id", qr.getId());
                qrData.put("qrCode", qr.getQrCode());
                qrData.put("qrImageUrl", qr.getQrImageUrl());
                qrData.put("qrImagePath", qr.getQrImagePath());
                qrData.put("content", qr.getContent());
                qrData.put("contentType", qr.getContentType());
                qrData.put("title", qr.getTitle());
                qrData.put("description", qr.getDescription());
                qrData.put("style", qr.getStyle());
                qrData.put("foregroundColor", qr.getForegroundColor());
                qrData.put("backgroundColor", qr.getBackgroundColor());
                qrData.put("size", qr.getSize());
                qrData.put("format", qr.getFormat());

                // Add Advanced Fields
                qrData.put("trustBadge", qr.isTrustBadge());
                qrData.put("frameStyle", qr.getFrameStyle());
                qrData.put("frameColor", qr.getFrameColor());
                qrData.put("frameText", qr.getFrameText());
                qrData.put("frameTextColor", qr.getFrameTextColor());
                qrData.put("gradientType", qr.getGradientType());
                qrData.put("gradientDirection", qr.getGradientDirection());
                qrData.put("secondaryColor", qr.getSecondaryColor());
                qrData.put("centerText", qr.getCenterText());
                qrData.put("centerTextColor", qr.getCenterTextColor());
                qrData.put("logoSize", qr.getLogoSize());
                qrData.put("logoOpacity", qr.getLogoOpacity());
                qrData.put("logoCornerRadius", qr.getLogoCornerRadius());
                qrData.put("centerTextFontSize", qr.getCenterTextFontSize());
                qrData.put("centerTextFontFamily", qr.getCenterTextFontFamily());
                qrData.put("centerTextBackgroundColor", qr.getCenterTextBackgroundColor());
                qrData.put("centerTextBold", qr.isCenterTextBold());
                qrData.put("centerTextOpacity", qr.getCenterTextOpacity());
                qrData.put("centerTextBackgroundOpacity", qr.getCenterTextBackgroundOpacity());
                qrData.put("centerTextBackgroundRadius", qr.getCenterTextBackgroundRadius());
                qrData.put("margin", qr.getMargin());

                qrData.put("totalScans", qr.getTotalScans());
                qrData.put("uniqueScans", qr.getUniqueScans());
                qrData.put("shortCode", qr.getShortCode());
                qrData.put("isDynamic", qr.isDynamic());
                qrData.put("shortUrl", qr.isTrustBadge()
                        ? frontendUrl + "/verified/" + qr.getShortCode()
                        : (qr.isDynamic() && qr.getShortCode() != null
                                ? shortUrlDomain + "/q/" + qr.getShortCode()
                                : null));
                qrData.put("createdAt", qr.getCreatedAt());
                qrData.put("updatedAt", qr.getUpdatedAt());
                qrData.put("lastScannedAt", qr.getLastScannedAt());
                return qrData;
            }).toList();

            response.put("success", true);
            response.put("count", qrCodes.size());
            response.put("data", qrCodesData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{qrCodeId}")
    public ResponseEntity<Map<String, Object>> updateQrCode(@PathVariable String qrCodeId,
            @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String userId = (String) request.get("userId");

            if (userId == null) {
                response.put("success", false);
                response.put("message", "User ID is required");
                return ResponseEntity.badRequest().body(response);
            }

            QrCode updates = new QrCode();
            if (request.containsKey("title"))
                updates.setTitle((String) request.get("title"));
            if (request.containsKey("description"))
                updates.setDescription((String) request.get("description"));
            if (request.containsKey("content"))
                updates.setContent((String) request.get("content"));
            if (request.containsKey("contentType"))
                updates.setContentType((String) request.get("contentType"));
            if (request.containsKey("style"))
                updates.setStyle((String) request.get("style"));
            if (request.containsKey("foregroundColor"))
                updates.setForegroundColor((String) request.get("foregroundColor"));
            if (request.containsKey("backgroundColor"))
                updates.setBackgroundColor((String) request.get("backgroundColor"));
            if (request.containsKey("size"))
                updates.setSize((Integer) request.get("size"));
            if (request.containsKey("format"))
                updates.setFormat((String) request.get("format"));

            // Parse Advanced Configs Updates
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            if (request.containsKey("geoConfig")) {
                updates.setGeoConfig(mapper.convertValue(request.get("geoConfig"),
                        com.urlshortener.model.ShortenedUrl.GeoConfig.class));
            }
            if (request.containsKey("deepLinkConfig")) {
                updates.setDeepLinkConfig(mapper.convertValue(request.get("deepLinkConfig"),
                        com.urlshortener.model.ShortenedUrl.DeepLinkConfig.class));
            }
            if (request.containsKey("leadLockConfig")) {
                updates.setLeadLockConfig(mapper.convertValue(request.get("leadLockConfig"),
                        com.urlshortener.model.ShortenedUrl.LeadLockConfig.class));
            }
            if (request.containsKey("smartActionConfig")) {
                updates.setSmartActionConfig(
                        mapper.convertValue(request.get("smartActionConfig"), QrCode.SmartActionConfig.class));
            }

            // Advanced Configs Updates
            if (request.containsKey("trustBadge"))
                updates.setTrustBadge((Boolean) request.get("trustBadge"));
            if (request.containsKey("frameColor"))
                updates.setFrameColor((String) request.get("frameColor"));
            if (request.containsKey("frameText"))
                updates.setFrameText((String) request.get("frameText"));
            if (request.containsKey("frameTextColor"))
                updates.setFrameTextColor((String) request.get("frameTextColor"));
            if (request.containsKey("gradientType"))
                updates.setGradientType((String) request.get("gradientType"));
            if (request.containsKey("gradientDirection"))
                updates.setGradientDirection((String) request.get("gradientDirection"));
            if (request.containsKey("secondaryColor"))
                updates.setSecondaryColor((String) request.get("secondaryColor"));
            if (request.containsKey("centerText"))
                updates.setCenterText((String) request.get("centerText"));
            if (request.containsKey("centerTextColor"))
                updates.setCenterTextColor((String) request.get("centerTextColor"));
            if (request.containsKey("logoSize") && request.get("logoSize") instanceof Integer)
                updates.setLogoSize((Integer) request.get("logoSize"));
            if (request.containsKey("logoOpacity") && request.get("logoOpacity") instanceof Number)
                updates.setLogoOpacity(((Number) request.get("logoOpacity")).doubleValue());
            if (request.containsKey("logoCornerRadius") && request.get("logoCornerRadius") instanceof Integer)
                updates.setLogoCornerRadius((Integer) request.get("logoCornerRadius"));
            if (request.containsKey("centerTextFontSize") && request.get("centerTextFontSize") instanceof Integer)
                updates.setCenterTextFontSize((Integer) request.get("centerTextFontSize"));
            if (request.containsKey("centerTextFontFamily"))
                updates.setCenterTextFontFamily((String) request.get("centerTextFontFamily"));
            if (request.containsKey("centerTextBackgroundColor"))
                updates.setCenterTextBackgroundColor((String) request.get("centerTextBackgroundColor"));
            if (request.containsKey("centerTextBold"))
                updates.setCenterTextBold((Boolean) request.get("centerTextBold"));
            if (request.containsKey("centerTextOpacity") && request.get("centerTextOpacity") instanceof Number)
                updates.setCenterTextOpacity(((Number) request.get("centerTextOpacity")).doubleValue());
            if (request.containsKey("centerTextBackgroundOpacity")
                    && request.get("centerTextBackgroundOpacity") instanceof Number)
                updates.setCenterTextBackgroundOpacity(
                        ((Number) request.get("centerTextBackgroundOpacity")).doubleValue());
            if (request.containsKey("centerTextBackgroundRadius")
                    && request.get("centerTextBackgroundRadius") instanceof Integer)
                updates.setCenterTextBackgroundRadius((Integer) request.get("centerTextBackgroundRadius"));
            if (request.containsKey("margin") && request.get("margin") instanceof Integer)
                updates.setMargin((Integer) request.get("margin"));
            if (request.containsKey("frameStyle"))
                updates.setFrameStyle((String) request.get("frameStyle"));

            QrCode updated = qrCodeService.updateQrCode(qrCodeId, userId, updates);

            Map<String, Object> qrData = new HashMap<>();
            qrData.put("id", updated.getId());
            qrData.put("qrCode", updated.getQrCode());
            qrData.put("title", updated.getTitle());
            qrData.put("description", updated.getDescription());
            qrData.put("content", updated.getContent());
            qrData.put("contentType", updated.getContentType());
            qrData.put("style", updated.getStyle());
            qrData.put("foregroundColor", updated.getForegroundColor());
            qrData.put("backgroundColor", updated.getBackgroundColor());
            qrData.put("size", updated.getSize());
            qrData.put("format", updated.getFormat());
            qrData.put("updatedAt", updated.getUpdatedAt());

            response.put("success", true);
            response.put("message", "QR Code updated successfully");
            response.put("data", qrData);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{qrCodeId}")
    public ResponseEntity<Map<String, Object>> deleteQrCode(@PathVariable String qrCodeId,
            @RequestParam String userId) {
        Map<String, Object> response = new HashMap<>();

        try {
            qrCodeService.deleteQrCode(qrCodeId, userId);

            response.put("success", true);
            response.put("message", "QR Code deleted successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/bulk-delete")
    public ResponseEntity<Map<String, Object>> bulkDeleteQrCodes(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            @SuppressWarnings("unchecked")
            List<String> qrCodeIds = (List<String>) request.get("qrCodeIds");
            String userId = (String) request.get("userId");

            if (qrCodeIds == null || qrCodeIds.isEmpty()) {
                response.put("success", false);
                response.put("message", "No QR codes selected for deletion");
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

            for (String qrCodeId : qrCodeIds) {
                try {
                    qrCodeService.deleteQrCode(qrCodeId, userId);
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    errors.add(qrCodeId + ": " + e.getMessage());
                }
            }

            response.put("success", true);
            response.put("message", String.format("Deleted %d QR codes successfully", successCount));
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

    @PostMapping("/{qrCodeId}/scan")
    public ResponseEntity<Map<String, Object>> recordScan(@PathVariable String qrCodeId,
            @RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String ipAddress = request.get("ipAddress");
            String userAgent = request.get("userAgent");
            String country = request.get("country");
            String city = request.get("city");
            String deviceType = request.get("deviceType");

            qrCodeService.recordScan(qrCodeId, ipAddress, userAgent, country, city, deviceType);

            response.put("success", true);
            response.put("message", "Scan recorded successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/{qrCodeId}/redirect")
    public ResponseEntity<Map<String, Object>> handleQrRedirect(
            @PathVariable String qrCodeId,
            @RequestBody(required = false) Map<String, Object> request) {

        Map<String, Object> response = new HashMap<>();

        try {
            Optional<QrCode> qrCodeOpt = qrCodeService.getByQrCode(qrCodeId);

            if (qrCodeOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "QR Code not found");
                return ResponseEntity.status(404).body(response);
            }

            QrCode qrCode = qrCodeOpt.get();

            // Check if QR code is active
            if (!qrCode.isActive()) {
                response.put("success", false);
                response.put("message", "QR Code is no longer active");
                return ResponseEntity.status(404).body(response);
            }

            // Check if QR code has expired
            if (qrCode.getExpiresAt() != null && qrCode.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
                response.put("success", false);
                response.put("message", "QR Code has expired");
                return ResponseEntity.status(410).body(response);
            }

            // Record scan analytics (if enabled)
            if (qrCode.isTrackScans() && request != null) {
                String ipAddress = (String) request.get("ipAddress");
                String userAgent = (String) request.get("userAgent");
                String country = (String) request.get("country");
                String city = (String) request.get("city");
                String deviceType = (String) request.get("deviceType");

                qrCodeService.recordScan(qrCodeId, ipAddress, userAgent, country, city, deviceType);
            }

            // Return the QR code content
            Map<String, Object> qrData = new HashMap<>();
            qrData.put("content", qrCode.getContent());
            qrData.put("contentType", qrCode.getContentType());
            qrData.put("qrCode", qrCode.getQrCode());
            qrData.put("title", qrCode.getTitle());

            response.put("success", true);
            response.put("data", qrData);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Team-scoped endpoints
    @GetMapping("/scope/{scopeType}/{scopeId}")
    public ResponseEntity<Map<String, Object>> getQrCodesByScope(
            @PathVariable String scopeType,
            @PathVariable String scopeId) {
        Map<String, Object> response = new HashMap<>();

        try {
            List<QrCode> qrCodes = qrCodeService.getQrCodesByScope(scopeType, scopeId);

            response.put("success", true);
            response.put("qrCodes", qrCodes);
            response.put("count", qrCodes.size());

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
    public ResponseEntity<Map<String, Object>> getAllQrCodesForAdmin() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<QrCode> qrCodes = qrCodeService.getAllQrCodes();

            // Map to response format
            List<Map<String, Object>> qrCodesData = qrCodes.stream().map(qr -> {
                Map<String, Object> qrData = new HashMap<>();
                qrData.put("id", qr.getId());
                qrData.put("qrCode", qr.getQrCode());
                qrData.put("qrImageUrl", qr.getQrImageUrl());
                qrData.put("qrImagePath", qr.getQrImagePath());
                qrData.put("content", qr.getContent());
                qrData.put("contentType", qr.getContentType());
                qrData.put("title", qr.getTitle());
                qrData.put("description", qr.getDescription());
                qrData.put("style", qr.getStyle());
                qrData.put("foregroundColor", qr.getForegroundColor());
                qrData.put("backgroundColor", qr.getBackgroundColor());
                qrData.put("size", qr.getSize());
                qrData.put("format", qr.getFormat());

                // Add Advanced Fields
                qrData.put("trustBadge", qr.isTrustBadge());
                qrData.put("frameStyle", qr.getFrameStyle());
                qrData.put("frameColor", qr.getFrameColor());
                qrData.put("frameText", qr.getFrameText());
                qrData.put("frameTextColor", qr.getFrameTextColor());
                qrData.put("gradientType", qr.getGradientType());
                qrData.put("gradientDirection", qr.getGradientDirection());
                qrData.put("secondaryColor", qr.getSecondaryColor());
                qrData.put("centerText", qr.getCenterText());
                qrData.put("centerTextColor", qr.getCenterTextColor());
                qrData.put("logoSize", qr.getLogoSize());
                qrData.put("logoOpacity", qr.getLogoOpacity());
                qrData.put("logoCornerRadius", qr.getLogoCornerRadius());
                qrData.put("centerTextFontSize", qr.getCenterTextFontSize());
                qrData.put("centerTextFontFamily", qr.getCenterTextFontFamily());
                qrData.put("centerTextBackgroundColor", qr.getCenterTextBackgroundColor());
                qrData.put("centerTextBold", qr.isCenterTextBold());
                qrData.put("centerTextOpacity", qr.getCenterTextOpacity());
                qrData.put("centerTextBackgroundOpacity", qr.getCenterTextBackgroundOpacity());
                qrData.put("centerTextBackgroundRadius", qr.getCenterTextBackgroundRadius());
                qrData.put("margin", qr.getMargin());

                qrData.put("totalScans", qr.getTotalScans());
                qrData.put("uniqueScans", qr.getUniqueScans());
                qrData.put("createdAt", qr.getCreatedAt());
                qrData.put("updatedAt", qr.getUpdatedAt());
                qrData.put("lastScannedAt", qr.getLastScannedAt());
                if (qr.getScansByDevice() != null) {
                    qrData.put("analytics", Map.of(
                            "devices", qr.getScansByDevice(),
                            "countries", qr.getScansByCountry(),
                            "referrers", new HashMap<>() // Referrer tracking not yet implemented on QrCode model
                    ));
                }
                qrData.put("userId", qr.getUserId());
                qrData.put("scopeType", qr.getScopeType());
                return qrData;
            }).toList();

            response.put("success", true);
            response.put("count", qrCodes.size());
            response.put("qrCodes", qrCodesData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching all QR codes: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}