package com.urlshortener.model;

/**
 * Centralized Plan Policy for TinySlash SaaS Platform.
 *
 * planType strings stored in User.subscriptionPlan:
 * FREE | STARTER_MONTHLY | STARTER_YEARLY | PRO_MONTHLY | PRO_YEARLY |
 * BUSINESS_MONTHLY | BUSINESS_YEARLY
 *
 * -1 = unlimited for numeric limits.
 * fromString() maps any planType → the correct tier enum.
 */
public enum PlanPolicy {

    // ─────────────────── FREE ───────────────────
    FREE("Free",
            /* urls, staticQr, dynamicQr, files */15, 15, 0, 3,
            /* maxFileSizeMb, domains, teamMembers, analyticsRetentionDays */10, 0, 1, 7,
            /* pages, linksPerPage, maxPixelsPerAccount, maxPixelsPerLink */1, 5, 0, 0,

            // ── Short Link Features ──
            /* customAlias */false,
            /* passwordProtection */false,
            /* linkExpiration */false,
            /* clickLimits */false,
            /* richLinkPreview */false,
            /* openInApp */false,
            /* languageRouting */false,
            /* locationRouting */false,
            /* unlockAfterSignup */false,
            /* pixelRetargeting */false,
            /* abTesting */false,
            /* bulkImport */false,
            /* smartRedirectRules */false,
            /* webhooks */false,

            // ── QR Code Features ──
            /* dynamicQR */false,
            /* customQRColors */false,
            /* qrLogo */false,
            /* qrBranding */false,
            /* advancedQRSettings */false,
            /* multiActionQR */false,
            /* openInAppQR */false,
            /* locationRoutingQR */false,
            /* languageRoutingQR */false,
            /* leadCaptureQR */false,
            /* pixelRetargetingQR */false,
            /* bulkQRGeneration */false,
            /* whiteLabelQR */false,

            // ── Pixel ──
            /* metaCapi */false,
            /* googleAds */false,
            /* googleAnalytics4 */false,
            /* webhookPixel */false,
            /* advancedPixelAnalytics */false,

            // ── Verified Badge ──
            /* verifiedBadge */false,
            /* whiteLabelBadge */false,
            /* badgeAnalytics */false,
            /* agencyMode */false,

            // ── File Sharing ──
            /* advancedFileSettings */false,
            /* leadCaptureBeforeDownload */false,
            /* fileExpiration */false,
            /* removeBranding */false,

            // ── Pages ──
            /* removePageBranding */false,
            /* pageCustomDomain */false,
            /* pageAdvancedAnalytics */false,
            /* smartLinks */false,
            /* leadForms */false,
            /* whiteLabelPages */false,
            /* customCSSInjection */false,

            // ── Core ──
            /* customDomain */false,
            /* analytics */true,
            /* teamCollaboration */false,
            /* whiteLabel */false,
            /* apiAccess */false,
            /* prioritySupport */false),

    // ─────────────────── STARTER ───────────────────
    STARTER("Starter",
            1000, -1, 25, 50,
            100, 0, 1, 30,
            2, -1, 0, 0,

            true, // customAlias
            true, // passwordProtection
            true, // linkExpiration
            true, // clickLimits
            true, // richLinkPreview
            false, // openInApp
            false, // languageRouting
            false, // locationRouting
            false, // unlockAfterSignup
            false, // pixelRetargeting
            false, // abTesting
            false, // bulkImport
            false, // smartRedirectRules
            false, // webhooks

            true, // dynamicQR
            true, // customQRColors
            false, // qrLogo
            false, // qrBranding
            false, // advancedQRSettings
            false, // multiActionQR
            false, // openInAppQR
            false, // locationRoutingQR
            false, // languageRoutingQR
            false, // leadCaptureQR
            false, // pixelRetargetingQR
            false, // bulkQRGeneration
            false, // whiteLabelQR

            false, // metaCapi
            false, // googleAds
            false, // googleAnalytics4
            false, // webhookPixel
            false, // advancedPixelAnalytics

            false, // verifiedBadge
            false, // whiteLabelBadge
            false, // badgeAnalytics
            false, // agencyMode

            true, // advancedFileSettings
            false, // leadCaptureBeforeDownload
            false, // fileExpiration
            true, // removeBranding

            true, // removePageBranding
            false, // pageCustomDomain
            false, // pageAdvancedAnalytics
            false, // smartLinks
            false, // leadForms
            false, // whiteLabelPages
            false, // customCSSInjection

            false, // customDomain
            true, // analytics
            false, // teamCollaboration
            false, // whiteLabel
            false, // apiAccess
            false), // prioritySupport

    // ─────────────────── PRO ───────────────────
    PRO("Pro",
            -1, -1, 500, 200,
            500, 2, 3, 90,
            5, -1, 5, 2,

            true, // customAlias
            true, // passwordProtection
            true, // linkExpiration
            true, // clickLimits
            true, // richLinkPreview
            true, // openInApp
            true, // languageRouting
            true, // locationRouting
            true, // unlockAfterSignup
            true, // pixelRetargeting
            false, // abTesting
            false, // bulkImport
            false, // smartRedirectRules
            false, // webhooks

            true, // dynamicQR
            true, // customQRColors
            true, // qrLogo
            true, // qrBranding
            true, // advancedQRSettings
            true, // multiActionQR
            true, // openInAppQR
            true, // locationRoutingQR
            true, // languageRoutingQR
            true, // leadCaptureQR
            true, // pixelRetargetingQR
            false, // bulkQRGeneration
            false, // whiteLabelQR

            true, // metaCapi
            true, // googleAds
            false, // googleAnalytics4
            false, // webhookPixel
            false, // advancedPixelAnalytics

            true, // verifiedBadge
            false, // whiteLabelBadge
            false, // badgeAnalytics
            false, // agencyMode

            true, // advancedFileSettings
            false, // leadCaptureBeforeDownload
            false, // fileExpiration
            true, // removeBranding

            true, // removePageBranding
            true, // pageCustomDomain
            true, // pageAdvancedAnalytics
            true, // smartLinks
            false, // leadForms
            false, // whiteLabelPages
            false, // customCSSInjection

            true, // customDomain
            true, // analytics
            true, // teamCollaboration
            false, // whiteLabel
            true, // apiAccess
            true), // prioritySupport

    // ─────────────────── BUSINESS ───────────────────
    BUSINESS("Business",
            -1, -1, -1, -1,
            2048, 10, 10, 365,
            -1, -1, -1, 5,

            true, // customAlias
            true, // passwordProtection
            true, // linkExpiration
            true, // clickLimits
            true, // richLinkPreview
            true, // openInApp
            true, // languageRouting
            true, // locationRouting
            true, // unlockAfterSignup
            true, // pixelRetargeting
            true, // abTesting
            true, // bulkImport
            true, // smartRedirectRules
            true, // webhooks

            true, // dynamicQR
            true, // customQRColors
            true, // qrLogo
            true, // qrBranding
            true, // advancedQRSettings
            true, // multiActionQR
            true, // openInAppQR
            true, // locationRoutingQR
            true, // languageRoutingQR
            true, // leadCaptureQR
            true, // pixelRetargetingQR
            true, // bulkQRGeneration
            true, // whiteLabelQR

            true, // metaCapi
            true, // googleAds
            true, // googleAnalytics4
            true, // webhookPixel
            true, // advancedPixelAnalytics

            true, // verifiedBadge
            true, // whiteLabelBadge
            true, // badgeAnalytics
            true, // agencyMode

            true, // advancedFileSettings
            true, // leadCaptureBeforeDownload
            true, // fileExpiration
            true, // removeBranding

            true, // removePageBranding
            true, // pageCustomDomain
            true, // pageAdvancedAnalytics
            true, // smartLinks
            true, // leadForms
            true, // whiteLabelPages
            true, // customCSSInjection

            true, // customDomain
            true, // analytics
            true, // teamCollaboration
            true, // whiteLabel
            true, // apiAccess
            true), // prioritySupport

    // ─────────────────── BUSINESS_TRIAL (same as BUSINESS) ───────────────────
    BUSINESS_TRIAL("Business Trial",
            -1, -1, -1, -1,
            2048, 10, 10, 365,
            -1, -1, -1, 5,
            true, true, true, true, true, true, true, true, true, true, true, true, true, true,
            true, true, true, true, true, true, true, true, true, true, true, true, true,
            true, true, true, true, true,
            true, true, true, true,
            true, true, true, true,
            true, true, true, true, true, true, true,
            true, true, true, true, true, true);

    // ─────────────── Fields ───────────────

    private final String displayName;

    // Usage Limits (-1 = unlimited)
    private final int urlsPerMonth;
    private final int staticQrPerMonth; // -1 = unlimited
    private final int dynamicQrPerMonth; // 0 = not available, -1 = unlimited
    private final int filesPerMonth; // -1 = unlimited
    private final int maxFileSizeMb;
    private final int domains;
    private final int teamMembers;
    private final int analyticsRetentionDays;
    private final int pagesPerUser; // -1 = unlimited
    private final int linksPerPage; // -1 = unlimited
    private final int maxPixelsPerAccount; // -1 = unlimited
    private final int maxPixelsPerLink;

    // Short Link Features
    private final boolean customAlias;
    private final boolean passwordProtection;
    private final boolean linkExpiration;
    private final boolean clickLimits;
    private final boolean richLinkPreview;
    private final boolean openInApp;
    private final boolean languageRouting;
    private final boolean locationRouting;
    private final boolean unlockAfterSignup;
    private final boolean pixelRetargeting;
    private final boolean abTesting;
    private final boolean bulkImport;
    private final boolean smartRedirectRules;
    private final boolean webhooks;

    // QR Code Features
    private final boolean dynamicQR;
    private final boolean customQRColors;
    private final boolean qrLogo;
    private final boolean qrBranding;
    private final boolean advancedQRSettings;
    private final boolean multiActionQR;
    private final boolean openInAppQR;
    private final boolean locationRoutingQR;
    private final boolean languageRoutingQR;
    private final boolean leadCaptureQR;
    private final boolean pixelRetargetingQR;
    private final boolean bulkQRGeneration;
    private final boolean whiteLabelQR;

    // Pixel Platform Features
    private final boolean metaCapi;
    private final boolean googleAds;
    private final boolean googleAnalytics4;
    private final boolean webhookPixel;
    private final boolean advancedPixelAnalytics;

    // Verified Badge
    private final boolean verifiedBadge;
    private final boolean whiteLabelBadge;
    private final boolean badgeAnalytics;
    private final boolean agencyMode;

    // File Sharing Features
    private final boolean advancedFileSettings;
    private final boolean leadCaptureBeforeDownload;
    private final boolean fileExpiration;
    private final boolean removeBranding;

    // Pages Features
    private final boolean removePageBranding;
    private final boolean pageCustomDomain;
    private final boolean pageAdvancedAnalytics;
    private final boolean smartLinks;
    private final boolean leadForms;
    private final boolean whiteLabelPages;
    private final boolean customCSSInjection;

    // Core
    private final boolean customDomain;
    private final boolean analytics;
    private final boolean teamCollaboration;
    private final boolean whiteLabel;
    private final boolean apiAccess;
    private final boolean prioritySupport;

    // ─────────────── Constructor ───────────────

    PlanPolicy(String displayName,
            int urlsPerMonth, int staticQrPerMonth, int dynamicQrPerMonth, int filesPerMonth,
            int maxFileSizeMb, int domains, int teamMembers, int analyticsRetentionDays,
            int pagesPerUser, int linksPerPage, int maxPixelsPerAccount, int maxPixelsPerLink,
            boolean customAlias, boolean passwordProtection, boolean linkExpiration, boolean clickLimits,
            boolean richLinkPreview, boolean openInApp, boolean languageRouting, boolean locationRouting,
            boolean unlockAfterSignup, boolean pixelRetargeting, boolean abTesting, boolean bulkImport,
            boolean smartRedirectRules, boolean webhooks,
            boolean dynamicQR, boolean customQRColors, boolean qrLogo, boolean qrBranding,
            boolean advancedQRSettings, boolean multiActionQR, boolean openInAppQR,
            boolean locationRoutingQR, boolean languageRoutingQR, boolean leadCaptureQR,
            boolean pixelRetargetingQR, boolean bulkQRGeneration, boolean whiteLabelQR,
            boolean metaCapi, boolean googleAds, boolean googleAnalytics4, boolean webhookPixel,
            boolean advancedPixelAnalytics,
            boolean verifiedBadge, boolean whiteLabelBadge, boolean badgeAnalytics, boolean agencyMode,
            boolean advancedFileSettings, boolean leadCaptureBeforeDownload, boolean fileExpiration,
            boolean removeBranding,
            boolean removePageBranding, boolean pageCustomDomain, boolean pageAdvancedAnalytics,
            boolean smartLinks, boolean leadForms, boolean whiteLabelPages, boolean customCSSInjection,
            boolean customDomain, boolean analytics, boolean teamCollaboration,
            boolean whiteLabel, boolean apiAccess, boolean prioritySupport) {

        this.displayName = displayName;
        this.urlsPerMonth = urlsPerMonth;
        this.staticQrPerMonth = staticQrPerMonth;
        this.dynamicQrPerMonth = dynamicQrPerMonth;
        this.filesPerMonth = filesPerMonth;
        this.maxFileSizeMb = maxFileSizeMb;
        this.domains = domains;
        this.teamMembers = teamMembers;
        this.analyticsRetentionDays = analyticsRetentionDays;
        this.pagesPerUser = pagesPerUser;
        this.linksPerPage = linksPerPage;
        this.maxPixelsPerAccount = maxPixelsPerAccount;
        this.maxPixelsPerLink = maxPixelsPerLink;
        this.customAlias = customAlias;
        this.passwordProtection = passwordProtection;
        this.linkExpiration = linkExpiration;
        this.clickLimits = clickLimits;
        this.richLinkPreview = richLinkPreview;
        this.openInApp = openInApp;
        this.languageRouting = languageRouting;
        this.locationRouting = locationRouting;
        this.unlockAfterSignup = unlockAfterSignup;
        this.pixelRetargeting = pixelRetargeting;
        this.abTesting = abTesting;
        this.bulkImport = bulkImport;
        this.smartRedirectRules = smartRedirectRules;
        this.webhooks = webhooks;
        this.dynamicQR = dynamicQR;
        this.customQRColors = customQRColors;
        this.qrLogo = qrLogo;
        this.qrBranding = qrBranding;
        this.advancedQRSettings = advancedQRSettings;
        this.multiActionQR = multiActionQR;
        this.openInAppQR = openInAppQR;
        this.locationRoutingQR = locationRoutingQR;
        this.languageRoutingQR = languageRoutingQR;
        this.leadCaptureQR = leadCaptureQR;
        this.pixelRetargetingQR = pixelRetargetingQR;
        this.bulkQRGeneration = bulkQRGeneration;
        this.whiteLabelQR = whiteLabelQR;
        this.metaCapi = metaCapi;
        this.googleAds = googleAds;
        this.googleAnalytics4 = googleAnalytics4;
        this.webhookPixel = webhookPixel;
        this.advancedPixelAnalytics = advancedPixelAnalytics;
        this.verifiedBadge = verifiedBadge;
        this.whiteLabelBadge = whiteLabelBadge;
        this.badgeAnalytics = badgeAnalytics;
        this.agencyMode = agencyMode;
        this.advancedFileSettings = advancedFileSettings;
        this.leadCaptureBeforeDownload = leadCaptureBeforeDownload;
        this.fileExpiration = fileExpiration;
        this.removeBranding = removeBranding;
        this.removePageBranding = removePageBranding;
        this.pageCustomDomain = pageCustomDomain;
        this.pageAdvancedAnalytics = pageAdvancedAnalytics;
        this.smartLinks = smartLinks;
        this.leadForms = leadForms;
        this.whiteLabelPages = whiteLabelPages;
        this.customCSSInjection = customCSSInjection;
        this.customDomain = customDomain;
        this.analytics = analytics;
        this.teamCollaboration = teamCollaboration;
        this.whiteLabel = whiteLabel;
        this.apiAccess = apiAccess;
        this.prioritySupport = prioritySupport;
    }

    // ─────────────── Getters ───────────────

    public String getDisplayName() {
        return displayName;
    }

    public int getUrlsPerMonth() {
        return urlsPerMonth;
    }

    public int getStaticQrPerMonth() {
        return staticQrPerMonth;
    }

    public int getDynamicQrPerMonth() {
        return dynamicQrPerMonth;
    }

    /** @deprecated use getStaticQrPerMonth() or getDynamicQrPerMonth() */
    public int getQrCodesPerMonth() {
        return staticQrPerMonth;
    }

    public int getFilesPerMonth() {
        return filesPerMonth;
    }

    public int getMaxFileSizeMb() {
        return maxFileSizeMb;
    }

    public int getDomains() {
        return domains;
    }

    public int getTeamMembers() {
        return teamMembers;
    }

    public int getAnalyticsRetentionDays() {
        return analyticsRetentionDays;
    }

    public int getPagesPerUser() {
        return pagesPerUser;
    }

    public int getLinksPerPage() {
        return linksPerPage;
    }

    public int getMaxPixelsPerAccount() {
        return maxPixelsPerAccount;
    }

    public int getMaxPixelsPerLink() {
        return maxPixelsPerLink;
    }

    // AI Generation Limits
    public int getAiPagesPerMonth() {
        switch (this) {
            case STARTER:
                return 10;
            case PRO:
                return -1;
            case BUSINESS:
                return -1;
            case BUSINESS_TRIAL:
                return -1;
            case FREE:
            default:
                return 0;
        }
    }

    public int getAiFieldsPerMonth() {
        switch (this) {
            case STARTER:
                return 50;
            case PRO:
                return -1;
            case BUSINESS:
                return -1;
            case BUSINESS_TRIAL:
                return -1;
            case FREE:
            default:
                return 0;
        }
    }

    // Short Link
    public boolean hasCustomAlias() {
        return customAlias;
    }

    public boolean hasPasswordProtection() {
        return passwordProtection;
    }

    public boolean hasLinkExpiration() {
        return linkExpiration;
    }

    public boolean hasClickLimits() {
        return clickLimits;
    }

    public boolean hasRichLinkPreview() {
        return richLinkPreview;
    }

    public boolean hasOpenInApp() {
        return openInApp;
    }

    public boolean hasLanguageRouting() {
        return languageRouting;
    }

    public boolean hasLocationRouting() {
        return locationRouting;
    }

    public boolean hasUnlockAfterSignup() {
        return unlockAfterSignup;
    }

    public boolean hasPixelRetargeting() {
        return pixelRetargeting;
    }

    public boolean hasAbTesting() {
        return abTesting;
    }

    public boolean hasBulkImport() {
        return bulkImport;
    }

    public boolean hasSmartRedirectRules() {
        return smartRedirectRules;
    }

    public boolean hasWebhooks() {
        return webhooks;
    }

    // QR
    public boolean hasDynamicQR() {
        return dynamicQR;
    }

    public boolean hasCustomQRColors() {
        return customQRColors;
    }

    public boolean hasQrLogo() {
        return qrLogo;
    }

    public boolean hasQrBranding() {
        return qrBranding;
    }

    public boolean hasAdvancedQRSettings() {
        return advancedQRSettings;
    }

    public boolean hasMultiActionQR() {
        return multiActionQR;
    }

    public boolean hasOpenInAppQR() {
        return openInAppQR;
    }

    public boolean hasLocationRoutingQR() {
        return locationRoutingQR;
    }

    public boolean hasLanguageRoutingQR() {
        return languageRoutingQR;
    }

    public boolean hasLeadCaptureQR() {
        return leadCaptureQR;
    }

    public boolean hasPixelRetargetingQR() {
        return pixelRetargetingQR;
    }

    public boolean hasBulkQRGeneration() {
        return bulkQRGeneration;
    }

    public boolean hasWhiteLabelQR() {
        return whiteLabelQR;
    }

    // Pixel
    public boolean hasMetaCapi() {
        return metaCapi;
    }

    public boolean hasGoogleAds() {
        return googleAds;
    }

    public boolean hasGoogleAnalytics4() {
        return googleAnalytics4;
    }

    public boolean hasWebhookPixel() {
        return webhookPixel;
    }

    public boolean hasAdvancedPixelAnalytics() {
        return advancedPixelAnalytics;
    }

    // Verified Badge
    public boolean hasVerifiedBadge() {
        return verifiedBadge;
    }

    public boolean hasWhiteLabelBadge() {
        return whiteLabelBadge;
    }

    public boolean hasBadgeAnalytics() {
        return badgeAnalytics;
    }

    public boolean hasAgencyMode() {
        return agencyMode;
    }

    // File Sharing
    public boolean hasAdvancedFileSettings() {
        return advancedFileSettings;
    }

    public boolean hasLeadCaptureBeforeDownload() {
        return leadCaptureBeforeDownload;
    }

    public boolean hasFileExpiration() {
        return fileExpiration;
    }

    public boolean hasRemoveBranding() {
        return removeBranding;
    }

    // Pages
    public boolean hasRemovePageBranding() {
        return removePageBranding;
    }

    public boolean hasPageCustomDomain() {
        return pageCustomDomain;
    }

    public boolean hasPageAdvancedAnalytics() {
        return pageAdvancedAnalytics;
    }

    public boolean hasSmartLinks() {
        return smartLinks;
    }

    public boolean hasLeadForms() {
        return leadForms;
    }

    public boolean hasWhiteLabelPages() {
        return whiteLabelPages;
    }

    public boolean hasCustomCSSInjection() {
        return customCSSInjection;
    }

    // Core
    public boolean hasCustomDomain() {
        return customDomain;
    }

    public boolean hasAnalytics() {
        return analytics;
    }

    public boolean hasTeamCollaboration() {
        return teamCollaboration;
    }

    public boolean hasWhiteLabel() {
        return whiteLabel;
    }

    public boolean hasApiAccess() {
        return apiAccess;
    }

    public boolean hasPrioritySupport() {
        return prioritySupport;
    }

    // ─────────────── Capacity checks (-1 = unlimited always passes)
    // ───────────────

    public boolean canCreateUrl(int current) {
        return urlsPerMonth == -1 || current < urlsPerMonth;
    }

    public boolean canCreateStaticQR(int current) {
        return staticQrPerMonth == -1 || current < staticQrPerMonth;
    }

    public boolean canCreateDynamicQR(int current) {
        return dynamicQrPerMonth == -1 || (dynamicQrPerMonth > 0 && current < dynamicQrPerMonth);
    }

    /** Legacy compat */
    public boolean canCreateQR(int current) {
        return canCreateStaticQR(current);
    }

    public boolean canUploadFile(int current) {
        return filesPerMonth == -1 || current < filesPerMonth;
    }

    public boolean canCreatePage(int current) {
        return pagesPerUser == -1 || current < pagesPerUser;
    }

    public boolean canAddLinkToPage(int current) {
        return linksPerPage == -1 || current < linksPerPage;
    }

    public boolean canCreatePixel(int current) {
        return maxPixelsPerAccount == -1 || current < maxPixelsPerAccount;
    }

    public boolean canAddPixelToLink(int current) {
        return maxPixelsPerLink == -1 || current < maxPixelsPerLink;
    }

    public boolean canAddDomain(int current) {
        return current < domains;
    }

    public boolean canAddTeamMember(int current) {
        return current < teamMembers;
    }

    public boolean canGenerateAiPage(int current) {
        int limit = getAiPagesPerMonth();
        return limit == -1 || (limit > 0 && current < limit);
    }

    public boolean canGenerateAiField(int current) {
        int limit = getAiFieldsPerMonth();
        return limit == -1 || (limit > 0 && current < limit);
    }

    // ─────────────── hasFeature dispatcher ───────────────

    public boolean hasFeature(String featureName) {
        switch (featureName.toLowerCase().replace("-", "").replace("_", "")) {
            // Short Link
            case "customalias":
                return customAlias;
            case "passwordprotection":
                return passwordProtection;
            case "linkexpiration":
                return linkExpiration;
            case "clicklimits":
                return clickLimits;
            case "richlinkpreview":
                return richLinkPreview;
            case "openinapp":
                return openInApp;
            case "languagerouting":
                return languageRouting;
            case "locationrouting":
                return locationRouting;
            case "unlockaftersignup":
                return unlockAfterSignup;
            case "pixelretargeting":
                return pixelRetargeting;
            case "abtesting":
                return abTesting;
            case "bulkimport":
                return bulkImport;
            case "smartredirectrules":
                return smartRedirectRules;
            case "webhooks":
                return webhooks;
            // QR
            case "dynamicqr":
                return dynamicQR;
            case "customqrcolors":
                return customQRColors;
            case "qrlogo":
                return qrLogo;
            case "qrbranding":
                return qrBranding;
            case "advancedqrsettings":
                return advancedQRSettings;
            case "multiactionqr":
                return multiActionQR;
            case "openinappqr":
                return openInAppQR;
            case "locationroutingqr":
                return locationRoutingQR;
            case "languageroutingqr":
                return languageRoutingQR;
            case "leadcaptureqr":
                return leadCaptureQR;
            case "pixelretargetingqr":
                return pixelRetargetingQR;
            case "bulkqrgeneration":
                return bulkQRGeneration;
            case "whitelabelqr":
                return whiteLabelQR;
            // Pixel platforms
            case "metacapi":
                return metaCapi;
            case "googleads":
                return googleAds;
            case "googleanalytics4":
                return googleAnalytics4;
            case "webhookpixel":
                return webhookPixel;
            case "advancedpixelanalytics":
                return advancedPixelAnalytics;
            case "pixels":
                return maxPixelsPerAccount == -1 || maxPixelsPerAccount > 0;
            // Verified Badge
            case "verifiedbadge":
                return verifiedBadge;
            case "whitelabelbadge":
                return whiteLabelBadge;
            case "badgeanalytics":
                return badgeAnalytics;
            case "agencymode":
                return agencyMode;
            // File
            case "advancedfilesettings":
                return advancedFileSettings;
            case "leadcapturebeforedownload":
                return leadCaptureBeforeDownload;
            case "fileexpiration":
                return fileExpiration;
            case "removebranding":
                return removeBranding;
            // Pages
            case "removepagebranding":
                return removePageBranding;
            case "pagecustomdomain":
                return pageCustomDomain;
            case "pageadvancedanalytics":
                return pageAdvancedAnalytics;
            case "smartlinks":
                return smartLinks;
            case "leadforms":
                return leadForms;
            case "whitelabelpages":
                return whiteLabelPages;
            case "customcssinjection":
                return customCSSInjection;
            // Core
            case "customdomain":
                return customDomain;
            case "analytics":
                return analytics;
            case "teamcollaboration":
                return teamCollaboration;
            case "whitelabel":
                return whiteLabel;
            case "apiaccess":
                return apiAccess;
            case "prioritysupport":
                return prioritySupport;
            default:
                return false;
        }
    }

    // ─────────────── Plan resolution ───────────────

    /**
     * Maps any planType string → PlanPolicy tier.
     * Accepts: FREE, STARTER_MONTHLY, STARTER_YEARLY,
     * PRO_MONTHLY, PRO_YEARLY,
     * BUSINESS_MONTHLY, BUSINESS_YEARLY, BUSINESS_TRIAL
     */
    public static PlanPolicy fromString(String planName) {
        if (planName == null || planName.trim().isEmpty())
            return FREE;
        String p = planName.toUpperCase().trim();
        if (p.startsWith("BUSINESS_TRIAL") || p.equals("BUSINESS_TRIAL"))
            return BUSINESS_TRIAL;
        if (p.startsWith("BUSINESS"))
            return BUSINESS;
        if (p.startsWith("PRO"))
            return PRO;
        if (p.startsWith("STARTER"))
            return STARTER;
        if (p.equals("FREE"))
            return FREE;
        return FREE; // safe fallback
    }

    /** Extract billing cycle from planType string */
    public static String getBillingCycle(String planType) {
        if (planType == null)
            return "FREE";
        String p = planType.toUpperCase();
        if (p.contains("YEARLY"))
            return "YEARLY";
        if (p.contains("MONTHLY"))
            return "MONTHLY";
        return "FREE";
    }

    /**
     * Backward compat — PlanValidationService calls this to compute trial end date
     */
    public int getTrialDays() {
        return this == BUSINESS_TRIAL ? 1 : 0;
    }

    public boolean isFree() {
        return this == FREE;
    }

    public boolean isPaid() {
        return this != FREE;
    }

    public boolean isTrial() {
        return this == BUSINESS_TRIAL;
    }

    public PlanPolicy getUpgradePath() {
        switch (this) {
            case FREE:
                return STARTER;
            case STARTER:
                return PRO;
            case PRO:
                return BUSINESS;
            default:
                return BUSINESS;
        }
    }

    public String getUpgradeReason(String feature, Integer currentCount) {
        if (isFree()) {
            return "Upgrade to " + getUpgradePath().getDisplayName() + " to unlock " + feature;
        }
        if (currentCount != null) {
            return "You've reached your " + feature.toLowerCase() + " limit for the " + displayName + " plan";
        }
        return feature + " is not available in your current plan";
    }
}
