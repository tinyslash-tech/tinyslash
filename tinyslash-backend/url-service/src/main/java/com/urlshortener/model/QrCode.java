package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "qr_codes")
public class QrCode {

    @Id
    private String id;

    @Indexed(unique = true)
    private String qrCode; // Unique identifier for the QR code

    // Associated content
    private String contentType; // URL, TEXT, VCARD, WIFI, etc.
    @Indexed
    private String destinationUrl; // Was content
    // private String shortCode; // Already exists, but I'll redefine to ensure
    // annotations
    @Indexed(unique = true)
    private String shortCode; // Unique ID for Dynamic QR

    private String fileCode; // Reference to uploaded file if applicable

    private boolean isDynamic = true;

    private Status status = Status.ACTIVE; // ACTIVE, PAUSED, EXPIRED

    private long scanCount = 0;

    public enum Status {
        ACTIVE, PAUSED, EXPIRED
    }

    // Owner information
    private String userId; // Reference to User
    private String createdBy; // Email or name

    // Scope information for team collaboration
    private String scopeType = "USER"; // USER or TEAM
    private String scopeId; // userId for USER scope, teamId for TEAM scope

    // QR Code customization
    private String style = "STANDARD"; // STANDARD, CUSTOM, LOGO, ARTISTIC
    private String foregroundColor = "#000000";
    private String backgroundColor = "#FFFFFF";
    private String logoUrl; // Custom logo in the center
    private int size = 300; // Size in pixels
    private String format = "PNG"; // PNG, JPG, SVG
    private int errorCorrectionLevel = 1; // 0-3 (L, M, Q, H)

    // Design options
    private String frameStyle = "NONE"; // NONE, SQUARE, CIRCLE, ROUNDED
    private String eyeStyle = "SQUARE"; // SQUARE, CIRCLE, ROUNDED
    private String dataPattern = "SQUARE"; // SQUARE, CIRCLE, ROUNDED, DOT

    // Advanced Customization
    private boolean trustBadge;
    private String frameColor;
    private String frameText;
    private String frameTextColor;
    private String gradientType;
    private String gradientDirection;
    private String secondaryColor;
    private String centerText;
    private String centerTextColor;
    private Integer logoSize;
    private Double logoOpacity;
    private Integer logoCornerRadius;
    private Integer centerTextFontSize;
    private String centerTextFontFamily;
    private String centerTextBackgroundColor;
    private boolean centerTextBold;
    private Double centerTextOpacity;
    private Double centerTextBackgroundOpacity;
    private Integer centerTextBackgroundRadius;
    private Integer margin;

    // QR Code file information
    private String qrImageUrl; // URL to access the QR code image
    private String qrImagePath; // File path where QR code is stored
    private long fileSize; // Size of the QR code image file

    // Analytics
    private int totalScans = 0;
    private int uniqueScans = 0;
    private int todayScans = 0;
    private int thisWeekScans = 0;
    private int thisMonthScans = 0;

    // Geographic data
    private Map<String, Integer> scansByCountry = new HashMap<>();
    private Map<String, Integer> scansByCity = new HashMap<>();

    // Device and browser data
    private Map<String, Integer> scansByDevice = new HashMap<>();
    private Map<String, Integer> scansByBrowser = new HashMap<>();
    private Map<String, Integer> scansByOS = new HashMap<>();

    // Time-based analytics
    private Map<String, Integer> scansByHour = new HashMap<>();
    private Map<String, Integer> scansByDay = new HashMap<>();

    // Status and settings
    private boolean isActive = true;
    private boolean isPublic = true;
    private boolean trackScans = true;

    // Expiration
    private LocalDateTime expiresAt;
    private boolean isExpired = false;

    // Metadata
    private String title;
    private String description;
    private String[] tags;
    private String category;

    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime lastScannedAt;

    // Constructors
    public QrCode() {
    }

    public QrCode(String destinationUrl, String contentType, String userId) {
        this.destinationUrl = destinationUrl;
        this.contentType = contentType;
        this.userId = userId;
        this.scopeType = "USER";
        this.scopeId = userId;
        this.qrCode = generateQrCode();
        this.isDynamic = true;
        // qrImageUrl will be set by the service with proper domain
    }

    public QrCode(String destinationUrl, String contentType, String userId, String scopeType, String scopeId) {
        this.destinationUrl = destinationUrl;
        this.contentType = contentType;
        this.userId = userId;
        this.scopeType = scopeType;
        this.scopeId = scopeId;
        this.qrCode = generateQrCode();
        this.isDynamic = true;
    }

    private String generateQrCode() {
        return "qr_" + System.currentTimeMillis() + "_" + (int) (Math.random() * 10000);
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQrCode() {
        return qrCode;
    }

    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getDestinationUrl() {
        return destinationUrl;
    }

    public void setDestinationUrl(String destinationUrl) {
        this.destinationUrl = destinationUrl;
    }

    // Deprecated Alias for Backward Compatibility
    public String getContent() {
        return destinationUrl;
    }

    public void setContent(String content) {
        this.destinationUrl = content;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getFileCode() {
        return fileCode;
    }

    public void setFileCode(String fileCode) {
        this.fileCode = fileCode;
    }

    public boolean isDynamic() {
        return isDynamic;
    }

    public void setDynamic(boolean dynamic) {
        isDynamic = dynamic;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public long getScanCount() {
        return scanCount;
    }

    public void setScanCount(long scanCount) {
        this.scanCount = scanCount;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getStyle() {
        return style;
    }

    public void setStyle(String style) {
        this.style = style;
    }

    public String getForegroundColor() {
        return foregroundColor;
    }

    public void setForegroundColor(String foregroundColor) {
        this.foregroundColor = foregroundColor;
    }

    public String getBackgroundColor() {
        return backgroundColor;
    }

    public void setBackgroundColor(String backgroundColor) {
        this.backgroundColor = backgroundColor;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public int getErrorCorrectionLevel() {
        return errorCorrectionLevel;
    }

    public void setErrorCorrectionLevel(int errorCorrectionLevel) {
        this.errorCorrectionLevel = errorCorrectionLevel;
    }

    public String getFrameStyle() {
        return frameStyle;
    }

    public void setFrameStyle(String frameStyle) {
        this.frameStyle = frameStyle;
    }

    public String getEyeStyle() {
        return eyeStyle;
    }

    public void setEyeStyle(String eyeStyle) {
        this.eyeStyle = eyeStyle;
    }

    public String getDataPattern() {
        return dataPattern;
    }

    public void setDataPattern(String dataPattern) {
        this.dataPattern = dataPattern;
    }

    public String getQrImageUrl() {
        return qrImageUrl;
    }

    public void setQrImageUrl(String qrImageUrl) {
        this.qrImageUrl = qrImageUrl;
    }

    public String getQrImagePath() {
        return qrImagePath;
    }

    public void setQrImagePath(String qrImagePath) {
        this.qrImagePath = qrImagePath;
    }

    public long getFileSize() {
        return fileSize;
    }

    public void setFileSize(long fileSize) {
        this.fileSize = fileSize;
    }

    public int getTotalScans() {
        return totalScans;
    }

    public void setTotalScans(int totalScans) {
        this.totalScans = totalScans;
    }

    public int getUniqueScans() {
        return uniqueScans;
    }

    public void setUniqueScans(int uniqueScans) {
        this.uniqueScans = uniqueScans;
    }

    public int getTodayScans() {
        return todayScans;
    }

    public void setTodayScans(int todayScans) {
        this.todayScans = todayScans;
    }

    public int getThisWeekScans() {
        return thisWeekScans;
    }

    public void setThisWeekScans(int thisWeekScans) {
        this.thisWeekScans = thisWeekScans;
    }

    public int getThisMonthScans() {
        return thisMonthScans;
    }

    public void setThisMonthScans(int thisMonthScans) {
        this.thisMonthScans = thisMonthScans;
    }

    public Map<String, Integer> getScansByCountry() {
        return scansByCountry;
    }

    public void setScansByCountry(Map<String, Integer> scansByCountry) {
        this.scansByCountry = scansByCountry;
    }

    public Map<String, Integer> getScansByCity() {
        return scansByCity;
    }

    public void setScansByCity(Map<String, Integer> scansByCity) {
        this.scansByCity = scansByCity;
    }

    public Map<String, Integer> getScansByDevice() {
        return scansByDevice;
    }

    public void setScansByDevice(Map<String, Integer> scansByDevice) {
        this.scansByDevice = scansByDevice;
    }

    public Map<String, Integer> getScansByBrowser() {
        return scansByBrowser;
    }

    public void setScansByBrowser(Map<String, Integer> scansByBrowser) {
        this.scansByBrowser = scansByBrowser;
    }

    public Map<String, Integer> getScansByOS() {
        return scansByOS;
    }

    public void setScansByOS(Map<String, Integer> scansByOS) {
        this.scansByOS = scansByOS;
    }

    public Map<String, Integer> getScansByHour() {
        return scansByHour;
    }

    public void setScansByHour(Map<String, Integer> scansByHour) {
        this.scansByHour = scansByHour;
    }

    public Map<String, Integer> getScansByDay() {
        return scansByDay;
    }

    public void setScansByDay(Map<String, Integer> scansByDay) {
        this.scansByDay = scansByDay;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public boolean isTrackScans() {
        return trackScans;
    }

    public void setTrackScans(boolean trackScans) {
        this.trackScans = trackScans;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isExpired() {
        return isExpired;
    }

    public void setExpired(boolean expired) {
        isExpired = expired;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public LocalDateTime getLastScannedAt() {
        return lastScannedAt;
    }

    public void setLastScannedAt(LocalDateTime lastScannedAt) {
        this.lastScannedAt = lastScannedAt;
    }

    public String getScopeType() {
        return scopeType;
    }

    public void setScopeType(String scopeType) {
        this.scopeType = scopeType;
    }

    public String getScopeId() {
        return scopeId;
    }

    public void setScopeId(String scopeId) {
        this.scopeId = scopeId;
    }

    public boolean isTrustBadge() {
        return trustBadge;
    }

    public void setTrustBadge(boolean trustBadge) {
        this.trustBadge = trustBadge;
    }

    public String getFrameColor() {
        return frameColor;
    }

    public void setFrameColor(String frameColor) {
        this.frameColor = frameColor;
    }

    public String getFrameText() {
        return frameText;
    }

    public void setFrameText(String frameText) {
        this.frameText = frameText;
    }

    public String getFrameTextColor() {
        return frameTextColor;
    }

    public void setFrameTextColor(String frameTextColor) {
        this.frameTextColor = frameTextColor;
    }

    public String getGradientType() {
        return gradientType;
    }

    public void setGradientType(String gradientType) {
        this.gradientType = gradientType;
    }

    public String getGradientDirection() {
        return gradientDirection;
    }

    public void setGradientDirection(String gradientDirection) {
        this.gradientDirection = gradientDirection;
    }

    public String getSecondaryColor() {
        return secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public String getCenterText() {
        return centerText;
    }

    public void setCenterText(String centerText) {
        this.centerText = centerText;
    }

    public String getCenterTextColor() {
        return centerTextColor;
    }

    public void setCenterTextColor(String centerTextColor) {
        this.centerTextColor = centerTextColor;
    }

    public Integer getLogoSize() {
        return logoSize;
    }

    public void setLogoSize(Integer logoSize) {
        this.logoSize = logoSize;
    }

    public Double getLogoOpacity() {
        return logoOpacity;
    }

    public void setLogoOpacity(Double logoOpacity) {
        this.logoOpacity = logoOpacity;
    }

    public Integer getLogoCornerRadius() {
        return logoCornerRadius;
    }

    public void setLogoCornerRadius(Integer logoCornerRadius) {
        this.logoCornerRadius = logoCornerRadius;
    }

    public Integer getCenterTextFontSize() {
        return centerTextFontSize;
    }

    public void setCenterTextFontSize(Integer centerTextFontSize) {
        this.centerTextFontSize = centerTextFontSize;
    }

    public String getCenterTextFontFamily() {
        return centerTextFontFamily;
    }

    public void setCenterTextFontFamily(String centerTextFontFamily) {
        this.centerTextFontFamily = centerTextFontFamily;
    }

    public String getCenterTextBackgroundColor() {
        return centerTextBackgroundColor;
    }

    public void setCenterTextBackgroundColor(String centerTextBackgroundColor) {
        this.centerTextBackgroundColor = centerTextBackgroundColor;
    }

    public boolean isCenterTextBold() {
        return centerTextBold;
    }

    public void setCenterTextBold(boolean centerTextBold) {
        this.centerTextBold = centerTextBold;
    }

    public Double getCenterTextOpacity() {
        return centerTextOpacity;
    }

    public void setCenterTextOpacity(Double centerTextOpacity) {
        this.centerTextOpacity = centerTextOpacity;
    }

    public Double getCenterTextBackgroundOpacity() {
        return centerTextBackgroundOpacity;
    }

    public void setCenterTextBackgroundOpacity(Double centerTextBackgroundOpacity) {
        this.centerTextBackgroundOpacity = centerTextBackgroundOpacity;
    }

    public Integer getCenterTextBackgroundRadius() {
        return centerTextBackgroundRadius;
    }

    public void setCenterTextBackgroundRadius(Integer centerTextBackgroundRadius) {
        this.centerTextBackgroundRadius = centerTextBackgroundRadius;
    }

    public Integer getMargin() {
        return margin;
    }

    public void setMargin(Integer margin) {
        this.margin = margin;
    }

    // Advanced Features for QR
    private ShortenedUrl.DeepLinkConfig deepLinkConfig;
    private ShortenedUrl.LeadLockConfig leadLockConfig;
    private ShortenedUrl.GeoConfig geoConfig;
    private SmartActionConfig smartActionConfig;

    public ShortenedUrl.DeepLinkConfig getDeepLinkConfig() {
        return deepLinkConfig;
    }

    public void setDeepLinkConfig(ShortenedUrl.DeepLinkConfig deepLinkConfig) {
        this.deepLinkConfig = deepLinkConfig;
    }

    public ShortenedUrl.LeadLockConfig getLeadLockConfig() {
        return leadLockConfig;
    }

    public void setLeadLockConfig(ShortenedUrl.LeadLockConfig leadLockConfig) {
        this.leadLockConfig = leadLockConfig;
    }

    public ShortenedUrl.GeoConfig getGeoConfig() {
        return geoConfig;
    }

    public void setGeoConfig(ShortenedUrl.GeoConfig geoConfig) {
        this.geoConfig = geoConfig;
    }

    public SmartActionConfig getSmartActionConfig() {
        return smartActionConfig;
    }

    public void setSmartActionConfig(SmartActionConfig smartActionConfig) {
        this.smartActionConfig = smartActionConfig;
    }

    // New Configuration for Smart Action QR
    public static class SmartActionConfig {
        private boolean enabled;
        private WhatsAppConfig whatsapp;
        private InstagramConfig instagram;
        private WebsiteConfig website;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public WhatsAppConfig getWhatsapp() {
            return whatsapp;
        }

        public void setWhatsapp(WhatsAppConfig whatsapp) {
            this.whatsapp = whatsapp;
        }

        public InstagramConfig getInstagram() {
            return instagram;
        }

        public void setInstagram(InstagramConfig instagram) {
            this.instagram = instagram;
        }

        public WebsiteConfig getWebsite() {
            return website;
        }

        public void setWebsite(WebsiteConfig website) {
            this.website = website;
        }

        public static class WhatsAppConfig {
            private boolean enabled;
            private String number;
            private String message;

            // getters/setters
            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }

            public String getNumber() {
                return number;
            }

            public void setNumber(String number) {
                this.number = number;
            }

            public String getMessage() {
                return message;
            }

            public void setMessage(String message) {
                this.message = message;
            }
        }

        public static class InstagramConfig {
            private boolean enabled;
            private String url;

            // getters/setters
            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }

            public String getUrl() {
                return url;
            }

            public void setUrl(String url) {
                this.url = url;
            }
        }

        public static class WebsiteConfig {
            private boolean enabled;
            private String url;
            private String label;

            // getters/setters
            public boolean isEnabled() {
                return enabled;
            }

            public void setEnabled(boolean enabled) {
                this.enabled = enabled;
            }

            public String getUrl() {
                return url;
            }

            public void setUrl(String url) {
                this.url = url;
            }

            public String getLabel() {
                return label;
            }

            public void setLabel(String label) {
                this.label = label;
            }
        }
    }
}