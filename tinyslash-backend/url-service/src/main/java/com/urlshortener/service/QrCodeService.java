package com.urlshortener.service;

import com.urlshortener.model.QrCode;
import com.urlshortener.model.User;
import com.urlshortener.repository.QrCodeRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.dto.SecurityDecision;
import com.urlshortener.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import javax.imageio.ImageIO;
import java.util.Base64;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.client.j2se.MatrixToImageConfig;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;

@Service
public class QrCodeService {

    private static final Logger logger = LoggerFactory.getLogger(QrCodeService.class);

    @Autowired
    private QrCodeRepository qrCodeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CacheService cacheService;

    @Autowired
    private SecurityService securityService;

    @Value("${app.shorturl.domain:https://pebly.vercel.app}")
    private String shortUrlDomain;

    public QrCode createQrCode(String content, String contentType, String userId,
            String title, String description, String style,
            String foregroundColor, String backgroundColor,
            int size, String format) {
        return createQrCode(content, contentType, userId, title, description, style,
                foregroundColor, backgroundColor, size, format, "USER", userId, null);
    }

    public QrCode createQrCode(String content, String contentType, String userId,
            String title, String description, String style,
            String foregroundColor, String backgroundColor,
            int size, String format, String scopeType, String scopeId,
            QrCode configContainer) { // Pass a container or DTO with new configs

        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Content cannot be empty");
        }

        // --- SECURITY CHECK (MANDATORY FOR URLs) ---
        // If content looks like a web link, verify it.
        String contentLower = content.toLowerCase();
        if (contentLower.startsWith("http://") || contentLower.startsWith("https://")
                || contentLower.startsWith("www.")) {
            String urlToCheck = contentLower.startsWith("www.") ? "https://" + content : content;
            User user = null;
            if (userId != null) {
                user = userRepository.findById(userId).orElse(null);
            }
            com.urlshortener.dto.SecurityDecision decision = securityService.preCheckUrl(urlToCheck, user);
            if (decision.getDecision() == com.urlshortener.dto.SecurityDecision.Decision.BLOCK) {
                throw new com.urlshortener.exception.SecurityViolationException(
                        decision.getReason(),
                        decision.getRiskScore(),
                        "TS-BLOCK-003");
            }
        }
        // ------------------------------------------

        // Generate Short Code for Dynamic QR
        String shortCode = generateUniqueShortCode();
        String dynamicUrl = shortUrlDomain + "/q/" + shortCode;

        // Create QR code object
        // The 'content' parameter is now treated as the destinationUrl
        QrCode qrCode = new QrCode(content, contentType, userId, scopeType, scopeId);
        qrCode.setShortCode(shortCode);
        qrCode.setDynamic(true); // Default to true for newly created QRs

        // Apply Advanced Configs if present
        if (configContainer != null) {
            qrCode.setGeoConfig(configContainer.getGeoConfig());
            qrCode.setDeepLinkConfig(configContainer.getDeepLinkConfig());
            qrCode.setLeadLockConfig(configContainer.getLeadLockConfig());
            qrCode.setSmartActionConfig(configContainer.getSmartActionConfig());
        }

        qrCode.setTitle(title);
        qrCode.setDescription(description);
        qrCode.setStyle(style != null ? style : "STANDARD");
        qrCode.setForegroundColor(foregroundColor != null ? foregroundColor : "#000000");
        qrCode.setBackgroundColor(backgroundColor != null ? backgroundColor : "#FFFFFF");
        qrCode.setSize(size > 0 ? size : 300);
        qrCode.setFormat(format != null ? format : "PNG");

        try {
            // Generate QR code image. For dynamic QRs, encode the dynamicUrl.
            byte[] qrImageBytes = generateQrCodeImage(dynamicUrl, qrCode.getSize(),
                    qrCode.getForegroundColor(), qrCode.getBackgroundColor(), qrCode.getFormat());
            qrCode.setFileSize(qrImageBytes.length);

            // For now, we'll store as base64 in the qrImagePath field
            // In production, you might want to store in GridFS or file system
            String base64Image = Base64.getEncoder().encodeToString(qrImageBytes);
            qrCode.setQrImagePath("data:image/" + format.toLowerCase() + ";base64," + base64Image);

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code: " + e.getMessage());
        }

        // Save to database
        QrCode saved = qrCodeRepository.save(qrCode);

        // Update user statistics
        if (userId != null) {
            updateUserStats(userId);
            // Invalidate user QR codes cache
            cacheService.clearCache("userQRCodes", userId);
        }

        logger.info("Created QR code: {} for user: {}", saved.getQrCode(), userId);

        return saved;
    }

    public Optional<QrCode> getByQrCode(String qrCodeId) {
        return qrCodeRepository.findByQrCode(qrCodeId);
    }

    public Optional<QrCode> getById(String id) {
        return qrCodeRepository.findById(id);
    }

    @Cacheable(value = "userQRCodes", key = "#userId")
    public List<QrCode> getUserQrCodes(String userId) {
        logger.debug("Fetching QR codes for user: {}", userId);
        return qrCodeRepository.findByUserIdAndIsActiveTrue(userId);
    }

    private String generateUniqueShortCode() {
        String shortCode;
        do {
            shortCode = java.util.UUID.randomUUID().toString().substring(0, 6); // Simple for now
            // Better: use Apache Commons RandomStringUtils.randomAlphanumeric(6) if
            // available
            // or a custom generator.
        } while (qrCodeRepository.findByShortCode(shortCode).isPresent());
        return shortCode;
    }

    private byte[] generateQrCodeImage(String content, int size, String foregroundColor, String backgroundColor,
            String format) throws Exception {
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.H);
        hints.put(EncodeHintType.MARGIN, 1);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        BitMatrix bitMatrix = new QRCodeWriter().encode(
                content, BarcodeFormat.QR_CODE, size, size, hints);

        // Helper to convert hex to int
        int onColor = 0xFF000000; // Default black
        int offColor = 0xFFFFFFFF; // Default white

        if (foregroundColor != null && !foregroundColor.isEmpty()) {
            try {
                String hex = foregroundColor.startsWith("#") ? foregroundColor.substring(1) : foregroundColor;
                onColor = (int) Long.parseLong("FF" + hex, 16);
            } catch (NumberFormatException e) {
                logger.warn("Invalid foreground color format: {}", foregroundColor);
            }
        }
        if (backgroundColor != null && !backgroundColor.isEmpty()) {
            try {
                String hex = backgroundColor.startsWith("#") ? backgroundColor.substring(1) : backgroundColor;
                offColor = (int) Long.parseLong("FF" + hex, 16);
            } catch (NumberFormatException e) {
                logger.warn("Invalid background color format: {}", backgroundColor);
            }
        }

        MatrixToImageConfig config = new MatrixToImageConfig(onColor, offColor);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, format != null ? format : "PNG", pngOutputStream, config);

        return pngOutputStream.toByteArray();
    }

    // Deprecated or redirecting helper
    private byte[] generateQrCodeImage(QrCode qrCode) throws Exception {
        // The content for dynamic QRs is the short URL, not the original content.
        // The original content is the destination URL.
        String contentToEncode = qrCode.isDynamic() ? shortUrlDomain + "/q/" + qrCode.getShortCode()
                : qrCode.getContent();
        return generateQrCodeImage(contentToEncode, qrCode.getSize(), qrCode.getForegroundColor(),
                qrCode.getBackgroundColor(), qrCode.getFormat());
    }

    // Get QR codes by scope (user or team)
    public List<QrCode> getQrCodesByScope(String scopeType, String scopeId) {
        logger.debug("Fetching QR codes for scope: {} - {}", scopeType, scopeId);
        return qrCodeRepository.findByScopeTypeAndScopeIdAndIsActiveTrue(scopeType, scopeId);
    }

    public QrCode updateQrCode(String qrCodeId, String userId, QrCode updates) {
        // Try to find by QR code first, then by ID
        Optional<QrCode> existingOpt = qrCodeRepository.findByQrCode(qrCodeId);
        if (existingOpt.isEmpty()) {
            existingOpt = qrCodeRepository.findById(qrCodeId);
        }

        if (existingOpt.isEmpty()) {
            throw new RuntimeException("QR Code not found");
        }

        QrCode existing = existingOpt.get();

        // Check ownership
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to update this QR Code");
        }

        // Update fields
        if (updates.getTitle() != null)
            existing.setTitle(updates.getTitle());
        if (updates.getDescription() != null)
            existing.setDescription(updates.getDescription());
        if (updates.getContent() != null) {
            // --- SECURITY CHECK (MANDATORY ON UPDATE) ---
            String newContent = updates.getContent();
            String contentLower = newContent.toLowerCase();
            if (contentLower.startsWith("http://") || contentLower.startsWith("https://")
                    || contentLower.startsWith("www.")) {
                String urlToCheck = contentLower.startsWith("www.") ? "https://" + newContent : newContent;
                User owner = userRepository.findById(userId).orElse(null);
                com.urlshortener.dto.SecurityDecision decision = securityService.preCheckUrl(urlToCheck, owner);

                if (decision.getDecision() == com.urlshortener.dto.SecurityDecision.Decision.BLOCK) {
                    throw new com.urlshortener.exception.SecurityViolationException(
                            decision.getReason(),
                            decision.getRiskScore(),
                            "TS-BLOCK-UPDATE-003");
                }
            }
            existing.setContent(newContent);
            // existing.setDestinationUrl(newContent); // Alias usage covers this
        }
        if (updates.getContentType() != null)
            existing.setContentType(updates.getContentType());
        if (updates.getStyle() != null)
            existing.setStyle(updates.getStyle());
        if (updates.getForegroundColor() != null)
            existing.setForegroundColor(updates.getForegroundColor());
        if (updates.getBackgroundColor() != null)
            existing.setBackgroundColor(updates.getBackgroundColor());
        if (updates.getSize() > 0)
            existing.setSize(updates.getSize());
        if (updates.getFormat() != null)
            existing.setFormat(updates.getFormat());
        if (updates.getTags() != null)
            existing.setTags(updates.getTags());
        if (updates.getCategory() != null)
            existing.setCategory(updates.getCategory());

        // Update Advanced Configs
        if (updates.getGeoConfig() != null)
            existing.setGeoConfig(updates.getGeoConfig());
        if (updates.getDeepLinkConfig() != null)
            existing.setDeepLinkConfig(updates.getDeepLinkConfig());
        if (updates.getLeadLockConfig() != null)
            existing.setLeadLockConfig(updates.getLeadLockConfig());
        if (updates.getSmartActionConfig() != null)
            existing.setSmartActionConfig(updates.getSmartActionConfig());

        existing.setUpdatedAt(LocalDateTime.now());

        QrCode updated = qrCodeRepository.save(existing);

        // Invalidate relevant caches
        cacheService.clearCache("userQRCodes", userId);

        logger.info("Updated QR code: {} for user: {}", qrCodeId, userId);

        return updated;
    }

    public void deleteQrCode(String qrCodeId, String userId) {
        // Try to find by QR code first, then by ID
        Optional<QrCode> existingOpt = qrCodeRepository.findByQrCode(qrCodeId);
        if (existingOpt.isEmpty()) {
            existingOpt = qrCodeRepository.findById(qrCodeId);
        }

        if (existingOpt.isEmpty()) {
            throw new RuntimeException("QR Code not found");
        }

        QrCode existing = existingOpt.get();

        // Check ownership
        if (!existing.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to delete this QR Code");
        }

        // Hard delete - actually remove from database
        qrCodeRepository.delete(existing);

        // Invalidate relevant caches
        cacheService.clearCache("userQRCodes", userId);

        logger.info("Permanently deleted QR code: {} for user: {}", qrCodeId, userId);
    }

    public void recordScan(String qrCodeId, String ipAddress, String userAgent,
            String country, String city, String deviceType) {
        Optional<QrCode> qrCodeOpt = qrCodeRepository.findByQrCode(qrCodeId);

        if (qrCodeOpt.isPresent()) {
            QrCode qrCode = qrCodeOpt.get();

            // Update scan statistics
            qrCode.setTotalScans(qrCode.getTotalScans() + 1);
            qrCode.setLastScannedAt(LocalDateTime.now());

            // Update geographic data
            if (country != null) {
                qrCode.getScansByCountry().merge(country, 1, Integer::sum);
            }
            if (city != null) {
                qrCode.getScansByCity().merge(city, 1, Integer::sum);
            }

            // Update device data
            if (deviceType != null) {
                qrCode.getScansByDevice().merge(deviceType, 1, Integer::sum);
            }

            // Update time-based data
            LocalDateTime now = LocalDateTime.now();
            String hourKey = String.valueOf(now.getHour());
            String dayKey = now.getDayOfWeek().toString();

            qrCode.getScansByHour().merge(hourKey, 1, Integer::sum);
            qrCode.getScansByDay().merge(dayKey, 1, Integer::sum);

            qrCodeRepository.save(qrCode);

            // Invalidate user analytics cache
            cacheService.invalidateUserAnalytics(qrCode.getUserId());

            logger.debug("Recorded scan for QR code: {}", qrCodeId);
        }
    }

    public List<QrCode> getAllQrCodes() {
        return qrCodeRepository.findAll();
    }

    private void updateUserStats(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setTotalQrCodes(user.getTotalQrCodes() + 1);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }
}