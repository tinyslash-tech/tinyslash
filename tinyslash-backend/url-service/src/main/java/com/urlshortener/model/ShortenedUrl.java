package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Document(collection = "shortened_urls")
@org.springframework.data.mongodb.core.index.CompoundIndexes({
        @org.springframework.data.mongodb.core.index.CompoundIndex(name = "domain_shortcode_idx", def = "{'domain': 1, 'shortCode': 1}", unique = true),
        @org.springframework.data.mongodb.core.index.CompoundIndex(name = "domain_created_idx", def = "{'domain': 1, 'createdAt': -1}"),
        @org.springframework.data.mongodb.core.index.CompoundIndex(name = "domain_clicks_idx", def = "{'domain': 1, 'totalClicks': -1}"),
        @org.springframework.data.mongodb.core.index.CompoundIndex(name = "user_campaign_idx", def = "{'userId': 1, 'utmCampaign': 1}")
})
public class ShortenedUrl {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long numericId; // For Feistel algorithm

    @Indexed // Global uniqueness removed, now scoped to domain
    private String shortCode;

    private String originalUrl;
    private String shortUrl;

    // Owner information
    private String userId; // Reference to User
    private String createdBy; // Email or name

    // Scope information for team collaboration
    private String scopeType = "USER"; // USER or TEAM
    private String scopeId; // userId for USER scope, teamId for TEAM scope

    // URL metadata
    private String title;
    private String description;
    private String favicon;
    private String domain;

    // Customization
    private String customAlias;
    private String password; // Password protection
    private boolean isPasswordProtected = false;

    // Expiration
    private LocalDateTime expiresAt;
    private boolean isExpired = false;

    // Click limits
    private Integer maxClicks; // Maximum allowed clicks (null = unlimited)

    // Status and settings
    private boolean isActive = true;
    private boolean isPublic = true;
    private boolean trackClicks = true;

    // Soft Delete for Default Domain Cooldown
    private boolean isDeleted = false;
    private LocalDateTime deletedAt;

    // Analytics counters
    private int totalClicks = 0;
    private int uniqueClicks = 0;
    private int todayClicks = 0;
    private int thisWeekClicks = 0;
    private int thisMonthClicks = 0;

    // Geographic data
    private Map<String, Integer> clicksByCountry = new HashMap<>();
    private Map<String, Integer> clicksByRegion = new HashMap<>();
    private Map<String, Integer> clicksByCity = new HashMap<>();

    // Device and browser data
    private Map<String, Integer> clicksByDevice = new HashMap<>();
    private Map<String, Integer> clicksByBrowser = new HashMap<>();
    private Map<String, Integer> clicksByOS = new HashMap<>();

    // Referrer data
    private Map<String, Integer> clicksByReferrer = new HashMap<>();

    // Time-based analytics
    private Map<String, Integer> clicksByHour = new HashMap<>();
    private Map<String, Integer> clicksByDay = new HashMap<>();

    // QR Code
    private boolean hasQrCode = false;
    private String qrCodeUrl;
    private String qrCodeStyle = "STANDARD"; // STANDARD, CUSTOM, LOGO

    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime lastClickedAt;

    // Tags and categories
    private String[] tags;
    private String category;
    private String notes;

    // UTM Analytics Counters
    private Map<String, Integer> clicksByUtmSource = new HashMap<>();
    private Map<String, Integer> clicksByUtmMedium = new HashMap<>();
    private Map<String, Integer> clicksByUtmCampaign = new HashMap<>();

    // UTM tracking (set at link creation, copied to ClickAnalytics on redirect)
    private String utmSource;
    private String utmMedium;
    private String utmCampaign;

    // Advanced Features
    private DeepLinkConfig deepLinkConfig;
    private LeadLockConfig leadLockConfig;
    private SmartLinkPreview smartLinkPreview;
    private GeoConfig geoConfig;
    private TrustBadgeConfig trustBadgeConfig;

    // Retargeting Pixels
    private java.util.List<String> pixelIds = new java.util.ArrayList<>();

    public java.util.List<String> getPixelIds() {
        return pixelIds;
    }

    public void setPixelIds(java.util.List<String> pixelIds) {
        this.pixelIds = pixelIds;
    }

    // Inner Classes for Configuration
    public static class DeepLinkConfig {
        private boolean enabled;
        // Logic handled automatically by backend "Zero-Config"

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
    }

    public static class LeadLockConfig {
        private boolean enabled;
        private String leadType = "WHATSAPP"; // WHATSAPP, EMAIL, BOTH
        private String message;
        private boolean otpEnabled;
        private boolean askOnce = true;
        private boolean autoRedirect = true;
        private String redirectUrl;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getLeadType() {
            return leadType;
        }

        public void setLeadType(String leadType) {
            this.leadType = leadType;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public boolean isOtpEnabled() {
            return otpEnabled;
        }

        public void setOtpEnabled(boolean otpEnabled) {
            this.otpEnabled = otpEnabled;
        }

        public boolean isAskOnce() {
            return askOnce;
        }

        public void setAskOnce(boolean askOnce) {
            this.askOnce = askOnce;
        }

        public boolean isAutoRedirect() {
            return autoRedirect;
        }

        public void setAutoRedirect(boolean autoRedirect) {
            this.autoRedirect = autoRedirect;
        }

        public String getRedirectUrl() {
            return redirectUrl;
        }

        public void setRedirectUrl(String redirectUrl) {
            this.redirectUrl = redirectUrl;
        }
    }

    public static class SmartLinkPreview {
        private boolean enabled;
        private String title;
        private String description;
        private String image;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
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

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }
    }

    public static class GeoConfig {
        private boolean enabled;
        private String defaultUrl;
        private java.util.List<GeoRule> rules = new java.util.ArrayList<>();

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getDefaultUrl() {
            return defaultUrl;
        }

        public void setDefaultUrl(String defaultUrl) {
            this.defaultUrl = defaultUrl;
        }

        public java.util.List<GeoRule> getRules() {
            return rules;
        }

        public void setRules(java.util.List<GeoRule> rules) {
            this.rules = rules;
        }

        public static class GeoRule {
            private String country;
            private String state;
            private String language;
            private String url;

            public String getCountry() {
                return country;
            }

            public void setCountry(String country) {
                this.country = country;
            }

            public String getState() {
                return state;
            }

            public void setState(String state) {
                this.state = state;
            }

            public String getLanguage() {
                return language;
            }

            public void setLanguage(String language) {
                this.language = language;
            }

            public String getUrl() {
                return url;
            }

            public void setUrl(String url) {
                this.url = url;
            }
        }
    }

    public static class TrustBadgeConfig {
        private boolean enabled; // user toggled the badge on
        private boolean requested; // user requested admin verification
        private String status; // pending, approved, rejected

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public boolean isRequested() {
            return requested;
        }

        public void setRequested(boolean requested) {
            this.requested = requested;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // Constructors
    public ShortenedUrl() {
    }

    public ShortenedUrl(String originalUrl, String shortCode, String userId) {
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.userId = userId;
        this.scopeType = "USER";
        this.scopeId = userId;
        // Short URL will be set by the service with proper domain
        this.shortUrl = shortCode; // Temporary, will be updated by service
    }

    public ShortenedUrl(String originalUrl, String shortCode, String userId, String scopeType, String scopeId) {
        this.originalUrl = originalUrl;
        this.shortCode = shortCode;
        this.userId = userId;
        this.scopeType = scopeType;
        this.scopeId = scopeId;
        this.shortUrl = shortCode; // Temporary, will be updated by service
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getNumericId() {
        return numericId;
    }

    public void setNumericId(Long numericId) {
        this.numericId = numericId;
    }

    public String getShortCode() {
        return shortCode;
    }

    public void setShortCode(String shortCode) {
        this.shortCode = shortCode;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getShortUrl() {
        return shortUrl;
    }

    public void setShortUrl(String shortUrl) {
        this.shortUrl = shortUrl;
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

    public String getFavicon() {
        return favicon;
    }

    public void setFavicon(String favicon) {
        this.favicon = favicon;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getCustomAlias() {
        return customAlias;
    }

    public void setCustomAlias(String customAlias) {
        this.customAlias = customAlias;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isPasswordProtected() {
        return isPasswordProtected;
    }

    public void setPasswordProtected(boolean passwordProtected) {
        isPasswordProtected = passwordProtected;
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

    public Integer getMaxClicks() {
        return maxClicks;
    }

    public void setMaxClicks(Integer maxClicks) {
        this.maxClicks = maxClicks;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
    }

    public boolean isTrackClicks() {
        return trackClicks;
    }

    public void setTrackClicks(boolean trackClicks) {
        this.trackClicks = trackClicks;
    }

    public int getTotalClicks() {
        return totalClicks;
    }

    public void setTotalClicks(int totalClicks) {
        this.totalClicks = totalClicks;
    }

    public int getUniqueClicks() {
        return uniqueClicks;
    }

    public void setUniqueClicks(int uniqueClicks) {
        this.uniqueClicks = uniqueClicks;
    }

    public int getTodayClicks() {
        return todayClicks;
    }

    public void setTodayClicks(int todayClicks) {
        this.todayClicks = todayClicks;
    }

    public int getThisWeekClicks() {
        return thisWeekClicks;
    }

    public void setThisWeekClicks(int thisWeekClicks) {
        this.thisWeekClicks = thisWeekClicks;
    }

    public int getThisMonthClicks() {
        return thisMonthClicks;
    }

    public void setThisMonthClicks(int thisMonthClicks) {
        this.thisMonthClicks = thisMonthClicks;
    }

    public Map<String, Integer> getClicksByCountry() {
        return clicksByCountry;
    }

    public void setClicksByCountry(Map<String, Integer> clicksByCountry) {
        this.clicksByCountry = clicksByCountry;
    }

    public Map<String, Integer> getClicksByRegion() {
        return clicksByRegion;
    }

    public void setClicksByRegion(Map<String, Integer> clicksByRegion) {
        this.clicksByRegion = clicksByRegion;
    }

    public Map<String, Integer> getClicksByCity() {
        return clicksByCity;
    }

    public void setClicksByCity(Map<String, Integer> clicksByCity) {
        this.clicksByCity = clicksByCity;
    }

    public Map<String, Integer> getClicksByDevice() {
        return clicksByDevice;
    }

    public void setClicksByDevice(Map<String, Integer> clicksByDevice) {
        this.clicksByDevice = clicksByDevice;
    }

    public Map<String, Integer> getClicksByBrowser() {
        return clicksByBrowser;
    }

    public void setClicksByBrowser(Map<String, Integer> clicksByBrowser) {
        this.clicksByBrowser = clicksByBrowser;
    }

    public Map<String, Integer> getClicksByOS() {
        return clicksByOS;
    }

    public void setClicksByOS(Map<String, Integer> clicksByOS) {
        this.clicksByOS = clicksByOS;
    }

    public Map<String, Integer> getClicksByReferrer() {
        return clicksByReferrer;
    }

    public void setClicksByReferrer(Map<String, Integer> clicksByReferrer) {
        this.clicksByReferrer = clicksByReferrer;
    }

    public Map<String, Integer> getClicksByHour() {
        return clicksByHour;
    }

    public void setClicksByHour(Map<String, Integer> clicksByHour) {
        this.clicksByHour = clicksByHour;
    }

    public Map<String, Integer> getClicksByDay() {
        return clicksByDay;
    }

    public void setClicksByDay(Map<String, Integer> clicksByDay) {
        this.clicksByDay = clicksByDay;
    }

    public boolean isHasQrCode() {
        return hasQrCode;
    }

    public void setHasQrCode(boolean hasQrCode) {
        this.hasQrCode = hasQrCode;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    public String getQrCodeStyle() {
        return qrCodeStyle;
    }

    public void setQrCodeStyle(String qrCodeStyle) {
        this.qrCodeStyle = qrCodeStyle;
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

    public LocalDateTime getLastClickedAt() {
        return lastClickedAt;
    }

    public void setLastClickedAt(LocalDateTime lastClickedAt) {
        this.lastClickedAt = lastClickedAt;
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

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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

    public DeepLinkConfig getDeepLinkConfig() {
        return deepLinkConfig;
    }

    public void setDeepLinkConfig(DeepLinkConfig deepLinkConfig) {
        this.deepLinkConfig = deepLinkConfig;
    }

    public LeadLockConfig getLeadLockConfig() {
        return leadLockConfig;
    }

    public void setLeadLockConfig(LeadLockConfig leadLockConfig) {
        this.leadLockConfig = leadLockConfig;
    }

    public SmartLinkPreview getSmartLinkPreview() {
        return smartLinkPreview;
    }

    public void setSmartLinkPreview(SmartLinkPreview smartLinkPreview) {
        this.smartLinkPreview = smartLinkPreview;
    }

    public GeoConfig getGeoConfig() {
        return geoConfig;
    }

    public void setGeoConfig(GeoConfig geoConfig) {
        this.geoConfig = geoConfig;
    }

    public TrustBadgeConfig getTrustBadgeConfig() {
        return trustBadgeConfig;
    }

    public void setTrustBadgeConfig(TrustBadgeConfig trustBadgeConfig) {
        this.trustBadgeConfig = trustBadgeConfig;
    }

    // Smart Action Config (Multi-Action QR)
    private SmartActionConfig smartActionConfig;

    public SmartActionConfig getSmartActionConfig() {
        return smartActionConfig;
    }

    public void setSmartActionConfig(SmartActionConfig smartActionConfig) {
        this.smartActionConfig = smartActionConfig;
    }

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

    // UTM getters and setters
    public String getUtmSource() {
        return utmSource;
    }

    public void setUtmSource(String utmSource) {
        this.utmSource = utmSource;
    }

    public String getUtmMedium() {
        return utmMedium;
    }

    public void setUtmMedium(String utmMedium) {
        this.utmMedium = utmMedium;
    }

    public String getUtmCampaign() {
        return utmCampaign;
    }

    public void setUtmCampaign(String utmCampaign) {
        this.utmCampaign = utmCampaign;
    }

    public Map<String, Integer> getClicksByUtmSource() {
        return clicksByUtmSource;
    }

    public void setClicksByUtmSource(Map<String, Integer> clicksByUtmSource) {
        this.clicksByUtmSource = clicksByUtmSource;
    }

    public Map<String, Integer> getClicksByUtmMedium() {
        return clicksByUtmMedium;
    }

    public void setClicksByUtmMedium(Map<String, Integer> clicksByUtmMedium) {
        this.clicksByUtmMedium = clicksByUtmMedium;
    }

    public Map<String, Integer> getClicksByUtmCampaign() {
        return clicksByUtmCampaign;
    }

    public void setClicksByUtmCampaign(Map<String, Integer> clicksByUtmCampaign) {
        this.clicksByUtmCampaign = clicksByUtmCampaign;
    }
}