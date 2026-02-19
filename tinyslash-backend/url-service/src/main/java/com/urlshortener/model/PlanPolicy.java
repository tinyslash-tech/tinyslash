package com.urlshortener.model;

/**
 * Centralized Plan Policy System for Pebly SaaS Platform
 * This enum defines all plan limits and features in one place
 * Must be kept in sync with frontend planPolicy.ts
 * 
 * CORRECTED PLAN STRUCTURE:
 * - FREE: 0 domains, 0 team members, 75 URLs/month, 30 QR/month, 5 files/month,
 * 7-day team trial (1 member)
 * - PRO: 1 domain, 3 team members, 1000 URLs/month, 100 QR/month, 50
 * files/month, 7-day trial
 * - BUSINESS: 3 domains, 10 team members, 10000 URLs/month, 1000 QR/month, 500
 * files/month, 14-day trial
 * - BUSINESS_TRIAL: Same as BUSINESS but with trial period active
 */
public enum PlanPolicy {
    // FREE: 1 Page, 5 Links/Page, Basic Theme, View Count
    FREE("Free", 0, 0, 50, 50, 5, 0,
            false, false, false, false, false, false,
            false, false, false, false,
            false, false, false, false, false,
            1, 5, false, false, false, false, false),

    // STARTER: 2 Pages, Unlimited Links, Basic Customization + Premium Templates
    STARTER("Starter", 0, 0, 1000, Integer.MAX_VALUE, 100, 0,
            false, false, false, false, false, false,
            true, true, true, true,
            true, true, false, false, false,
            2, Integer.MAX_VALUE, false, false, false, false, false),

    // PRO: 5 Pages, Custom Domain, Advanced Analytics, Smart Links, Lead Forms
    PRO("Pro", 1, 3, Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE, 0,
            true, true, true, false, true, true,
            true, true, true, true,
            true, true, true, true, true,
            5, Integer.MAX_VALUE, false, true, true, true, true),

    // BUSINESS: Unlimited Pages, White-label, Lead Forms, Team
    BUSINESS("Business", 3, 10, Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MAX_VALUE, 0,
            true, true, true, true, true, true,
            true, true, true, true,
            true, true, true, true, true,
            Integer.MAX_VALUE, Integer.MAX_VALUE, true, true, true, true, true),

    // BUSINESS TRIAL
    BUSINESS_TRIAL("Business Trial", 3, 10, Integer.MAX_VALUE, Integer.MAX_VALUE,
            Integer.MAX_VALUE, 14,
            true, true, true, true, true, true,
            true, true, true, true,
            true, true, true, true, true,
            Integer.MAX_VALUE, Integer.MAX_VALUE, true, true, true, true, true);

    private final String displayName;
    private final int domains;
    private final int teamMembers;
    private final int urlsPerMonth;
    private final int qrCodesPerMonth;
    private final int filesPerMonth;
    private final int trialDays;

    // Core features
    private final boolean customDomain;
    private final boolean analytics;
    private final boolean teamCollaboration;
    private final boolean whiteLabel;
    private final boolean apiAccess;
    private final boolean prioritySupport;

    // URL Shortener Premium Features
    private final boolean customAlias;
    private final boolean passwordProtection;
    private final boolean linkExpiration;
    private final boolean clickLimits;

    // QR Code Premium Features
    private final boolean customQRColors;
    private final boolean qrLogo;
    private final boolean qrBranding;
    private final boolean advancedQRSettings;

    // File Upload Premium Features
    private final boolean advancedFileSettings;

    // Pages Features (NEW)
    private final int pagesPerUser;
    private final int linksPerPage;
    private final boolean removePageBranding;
    private final boolean pageCustomDomain; // Use existing customDomain? Or specific? Using specific for clarity
    private final boolean pageAdvancedAnalytics;
    private final boolean smartLinks;
    private final boolean leadForms;
    private final boolean premiumTemplates; // New Feature

    PlanPolicy(String displayName, int domains, int teamMembers, int urlsPerMonth,
            int qrCodesPerMonth, int filesPerMonth, int trialDays,
            boolean customDomain, boolean analytics, boolean teamCollaboration,
            boolean whiteLabel, boolean apiAccess, boolean prioritySupport,
            boolean customAlias, boolean passwordProtection, boolean linkExpiration,
            boolean clickLimits, boolean customQRColors, boolean qrLogo,
            boolean qrBranding, boolean advancedQRSettings, boolean advancedFileSettings,
            int pagesPerUser, int linksPerPage, boolean removePageBranding,
            boolean pageCustomDomain, boolean pageAdvancedAnalytics, boolean smartLinks, boolean leadForms) {
        this.displayName = displayName;
        this.domains = domains;
        this.teamMembers = teamMembers;
        this.urlsPerMonth = urlsPerMonth;
        this.qrCodesPerMonth = qrCodesPerMonth;
        this.filesPerMonth = filesPerMonth;
        this.trialDays = trialDays;
        this.customDomain = customDomain;
        this.analytics = analytics;
        this.teamCollaboration = teamCollaboration;
        this.whiteLabel = whiteLabel;
        this.apiAccess = apiAccess;
        this.prioritySupport = prioritySupport;
        this.customAlias = customAlias;
        this.passwordProtection = passwordProtection;
        this.linkExpiration = linkExpiration;
        this.clickLimits = clickLimits;
        this.customQRColors = customQRColors;
        this.qrLogo = qrLogo;
        this.qrBranding = qrBranding;
        this.advancedQRSettings = advancedQRSettings;
        this.advancedFileSettings = advancedFileSettings;
        this.pagesPerUser = pagesPerUser;
        this.linksPerPage = linksPerPage;
        this.removePageBranding = removePageBranding;
        this.pageCustomDomain = pageCustomDomain;
        this.pageAdvancedAnalytics = pageAdvancedAnalytics;
        this.smartLinks = smartLinks;
        this.leadForms = leadForms;
        // Logic: Premium templates available for Paid plans (Starter+)
        this.premiumTemplates = this.urlsPerMonth > 75; // Hacky but works based on existing consts, or just pass it?
        // Let's rely on isPaid() derivation for now to avoid changing constructor
        // signature too much unless needed.
    }

    // Existing getters...
    public String getDisplayName() {
        return displayName;
    }

    public int getDomains() {
        return domains;
    }

    public int getTeamMembers() {
        return teamMembers;
    }

    public int getUrlsPerMonth() {
        return urlsPerMonth;
    }

    public int getQrCodesPerMonth() {
        return qrCodesPerMonth;
    }

    public int getFilesPerMonth() {
        return filesPerMonth;
    }

    public int getTrialDays() {
        return trialDays;
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

    // URL
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

    // QR
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

    // File
    public boolean hasAdvancedFileSettings() {
        return advancedFileSettings;
    }

    // Pages (NEW)
    public int getPagesPerUser() {
        return pagesPerUser;
    }

    public int getLinksPerPage() {
        return linksPerPage;
    }

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

    public boolean hasPremiumTemplates() {
        return isPaid(); // Available on Starter, Pro, Business
    }

    public static PlanPolicy fromString(String planName) {
        if (planName == null || planName.trim().isEmpty()) {
            return FREE;
        }
        try {
            String normalizedPlan = planName.toUpperCase().replaceAll("[^A-Z_]", "");
            if (normalizedPlan.startsWith("STARTER"))
                return STARTER;
            if (normalizedPlan.startsWith("PRO_"))
                return PRO;
            if (normalizedPlan.startsWith("BUSINESS_") && !normalizedPlan.contains("TRIAL"))
                return BUSINESS;
            if (normalizedPlan.equals("BUSINESS_TRIAL"))
                return BUSINESS_TRIAL;
            return PlanPolicy.valueOf(normalizedPlan);
        } catch (IllegalArgumentException e) {
            return FREE;
        }
    }

    public boolean canAddDomain(int currentDomainCount) {
        return currentDomainCount < this.domains;
    }

    public boolean canAddTeamMember(int currentMemberCount) {
        return currentMemberCount < this.teamMembers;
    }

    public boolean canCreateUrl(int currentUrlCount) {
        return currentUrlCount < this.urlsPerMonth;
    }

    public boolean canCreateQR(int currentQRCount) {
        return currentQRCount < this.qrCodesPerMonth;
    }

    public boolean canUploadFile(int currentFileCount) {
        return currentFileCount < this.filesPerMonth;
    }

    // NEW Page Checks
    public boolean canCreatePage(int currentPageCount) {
        return currentPageCount < this.pagesPerUser;
    }

    public boolean canAddLinkToPage(int currentLinkCount) {
        return currentLinkCount < this.linksPerPage;
    }

    /**
     * Get upgrade path for current plan
     */
    public PlanPolicy getUpgradePath() {
        switch (this) {
            case FREE:
                return PRO;
            case PRO:
                return BUSINESS;
            default:
                return BUSINESS;
        }
    }

    /**
     * Check if plan is a trial plan
     */
    public boolean isTrial() {
        return this.name().contains("TRIAL");
    }

    /**
     * Check if plan is free
     */
    public boolean isFree() {
        return this == FREE;
    }

    /**
     * Check if plan is paid
     */
    public boolean isPaid() {
        return this != FREE;
    }

    /**
     * Check if user has access to a specific feature
     * This mirrors the frontend hasFeature function
     */
    public boolean hasFeature(String featureName) {
        switch (featureName.toLowerCase()) {
            case "customdomain":
                return hasCustomDomain();
            case "analytics":
                return hasAnalytics();
            case "teamcollaboration":
                return hasTeamCollaboration();
            case "whitelabel":
                return hasWhiteLabel();
            case "apiaccess":
                return hasApiAccess();
            case "prioritysupport":
                return hasPrioritySupport();
            case "customalias":
                return hasCustomAlias();
            case "passwordprotection":
                return hasPasswordProtection();
            case "linkexpiration":
                return hasLinkExpiration();
            case "clicklimits":
                return hasClickLimits();
            case "customqrcolors":
                return hasCustomQRColors();
            case "qrlogo":
                return hasQrLogo();
            case "qrbranding":
                return hasQrBranding();
            case "advancedqrsettings":
                return hasAdvancedQRSettings();
            case "advancedfilesettings":
                return hasAdvancedFileSettings();
            // Pages Features
            case "removepagebranding":
                return hasRemovePageBranding();
            case "pagecustomdomain":
                return hasPageCustomDomain();
            case "pageadvancedanalytics":
                return hasPageAdvancedAnalytics();
            case "smartlinks":
                return hasSmartLinks();
            case "leadforms":
                return hasLeadForms();
            case "premiumtemplates":
                return hasPremiumTemplates();
            default:
                return false;
        }
    }

    /**
     * Get upgrade reason message (mirrors frontend logic)
     */
    public String getUpgradeReason(String feature, Integer currentCount) {
        if (this.isFree()) {
            return String.format("Upgrade to %s to unlock %s", this.getUpgradePath().getDisplayName(), feature);
        }

        if ("Custom Domains".equals(feature) && this == PRO) {
            return "Upgrade to Business for more domains";
        }

        if ("Team Members".equals(feature) && this == PRO) {
            return "Upgrade to Business for larger teams";
        }

        if (currentCount != null) {
            return String.format("You've reached your %s limit for the %s plan", feature.toLowerCase(),
                    this.displayName);
        }

        return String.format("%s is not available in your current plan", feature);
    }

    /**
     * Check if user should see upgrade modal (mirrors frontend logic)
     */
    public boolean shouldShowUpgradeModal(String feature, Integer currentCount) {
        // Free users always see upgrade modal for paid features
        if (this.isFree() && !this.hasFeature(feature)) {
            return true;
        }

        // Paid users see upgrade modal when they hit limits
        if (this.isPaid() && currentCount != null) {
            if ("Custom Domains".equals(feature) && !this.canAddDomain(currentCount)) {
                return this == PRO; // PRO users can upgrade to BUSINESS
            }
            if ("Team Members".equals(feature) && !this.canAddTeamMember(currentCount)) {
                return this == PRO; // PRO users can upgrade to BUSINESS
            }
        }

        return false;
    }
}
