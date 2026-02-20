package com.urlshortener.service;

import com.urlshortener.model.PlanPolicy;
import com.urlshortener.model.Subscription;
import com.urlshortener.model.User;
import com.urlshortener.repository.PageRepository;
import com.urlshortener.repository.SubscriptionRepository;
import com.urlshortener.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    // ── Constants ──────────────────────────────────────────────

    public static final String FREE_PLAN = "FREE";
    public static final String STARTER_MONTHLY = "STARTER_MONTHLY";
    public static final String STARTER_YEARLY = "STARTER_YEARLY";
    public static final String PRO_MONTHLY = "PRO_MONTHLY";
    public static final String PRO_YEARLY = "PRO_YEARLY";
    public static final String BUSINESS_MONTHLY = "BUSINESS_MONTHLY";
    public static final String BUSINESS_YEARLY = "BUSINESS_YEARLY";

    // Pricing in INR (used by /pricing endpoint)
    private static final int STARTER_MONTHLY_PRICE = 299;
    private static final int STARTER_YEARLY_PRICE = 2990;
    private static final int PRO_MONTHLY_PRICE = 999;
    private static final int PRO_YEARLY_PRICE = 9990;
    private static final int BUSINESS_MONTHLY_PRICE = 3499;
    private static final int BUSINESS_YEARLY_PRICE = 34990;

    // ── Dependencies ───────────────────────────────────────────

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubscriptionRepository subscriptionRepository;
    @Autowired
    private PageRepository pageRepository;

    // ── Internal helpers ───────────────────────────────────────

    public User getUser(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    /**
     * Resolves a user's effective PlanPolicy.
     * Falls back to FREE if subscription has expired.
     */
    private PlanPolicy getPolicy(User user) {
        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (!policy.isFree() && !isSubscriptionActive(user)) {
            return PlanPolicy.FREE;
        }
        return policy;
    }

    private boolean isSubscriptionActive(User user) {
        PlanPolicy p = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (p.isFree())
            return true; // FREE never expires
        if (user.getSubscriptionExpiry() == null)
            return true; // no expiry = active
        return user.getSubscriptionExpiry().isAfter(LocalDateTime.now());
    }

    private boolean isInTrialPeriod(User user) {
        if (user.getTrialStartDate() == null || user.getTrialEndDate() == null)
            return false;
        LocalDateTime now = LocalDateTime.now();
        return now.isAfter(user.getTrialStartDate()) && now.isBefore(user.getTrialEndDate());
    }

    // ── Usage reset helpers ────────────────────────────────────

    private void resetDailyUsageIfNeeded(User user) {
        LocalDateTime lastReset = user.getLastUsageReset();
        LocalDateTime now = LocalDateTime.now();
        if (lastReset == null || ChronoUnit.HOURS.between(lastReset, now) >= 24) {
            user.setDailyUrlsCreated(0);
            user.setDailyQrCodesCreated(0);
            user.setDailyFilesUploaded(0);
            user.setLastUsageReset(now);
            userRepository.save(user);
        }
    }

    private void resetMonthlyUsageIfNeeded(User user) {
        LocalDateTime lastReset = user.getLastMonthlyReset();
        LocalDateTime now = LocalDateTime.now();
        if (lastReset == null || ChronoUnit.DAYS.between(lastReset, now) >= 30) {
            user.setMonthlyUrlsCreated(0);
            user.setMonthlyQrCodesCreated(0);
            user.setMonthlyFilesUploaded(0);
            user.setLastMonthlyReset(now);
            userRepository.save(user);
        }
    }

    // ── Usage checks ───────────────────────────────────────────

    public boolean hasPremiumAccess(String userId) {
        return userRepository.findById(userId)
                .map(u -> !getPolicy(u).isFree())
                .orElse(false);
    }

    public boolean hasBusinessAccess(String userId) {
        return userRepository.findById(userId)
                .map(u -> {
                    PlanPolicy p = getPolicy(u);
                    return p == PlanPolicy.BUSINESS || p == PlanPolicy.BUSINESS_TRIAL;
                }).orElse(false);
    }

    public boolean canCreateUrl(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return true;
            PlanPolicy policy = getPolicy(user);
            return policy.canCreateUrl(user.getMonthlyUrlsCreated());
        }).orElse(false);
    }

    public boolean canCreateQrCode(String userId) {
        return canCreateStaticQR(userId); // legacy compat routed through static
    }

    public boolean canCreateStaticQR(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return true;
            PlanPolicy policy = getPolicy(user);
            return policy.canCreateStaticQR(user.getMonthlyQrCodesCreated());
        }).orElse(false);
    }

    public boolean canCreateDynamicQR(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return true;
            PlanPolicy policy = getPolicy(user);
            // dynamic QR usage stored separately if you have monthlyDynamicQrCreated, else
            // use monthly total
            int used = (user.getMonthlyDynamicQrCreated() != null) ? user.getMonthlyDynamicQrCreated() : 0;
            return policy.canCreateDynamicQR(used);
        }).orElse(false);
    }

    public boolean canUploadFile(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return true;
            PlanPolicy policy = getPolicy(user);
            return policy.canUploadFile(user.getMonthlyFilesUploaded());
        }).orElse(false);
    }

    // ── Feature checks (delegated to PlanPolicy) ───────────────

    private boolean checkFeature(String userId, String featureName) {
        return userRepository.findById(userId).map(user -> {
            if (isInTrialPeriod(user))
                return true;
            return getPolicy(user).hasFeature(featureName);
        }).orElse(false);
    }

    public boolean canUseCustomAlias(String userId) {
        return checkFeature(userId, "customAlias");
    }

    public boolean canUsePasswordProtection(String userId) {
        return checkFeature(userId, "passwordProtection");
    }

    public boolean canSetExpiration(String userId) {
        return checkFeature(userId, "linkExpiration");
    }

    public boolean canUseCustomDomain(String userId) {
        return checkFeature(userId, "customDomain");
    }

    public boolean canAccessDetailedAnalytics(String userId) {
        return checkFeature(userId, "analytics");
    }

    public boolean canCustomizeQrCodes(String userId) {
        return checkFeature(userId, "customQRColors");
    }

    public boolean canUseDynamicQR(String userId) {
        return checkFeature(userId, "dynamicQR");
    }

    public boolean canUseRichLinkPreview(String userId) {
        return checkFeature(userId, "richLinkPreview");
    }

    public boolean canUseOpenInApp(String userId) {
        return checkFeature(userId, "openInApp");
    }

    public boolean canUseLanguageRouting(String userId) {
        return checkFeature(userId, "languageRouting");
    }

    public boolean canUseLocationRouting(String userId) {
        return checkFeature(userId, "locationRouting");
    }

    public boolean canUseUnlockAfterSignup(String userId) {
        return checkFeature(userId, "unlockAfterSignup");
    }

    public boolean canUsePixelRetargeting(String userId) {
        return checkFeature(userId, "pixelRetargeting");
    }

    public boolean canUseAbTesting(String userId) {
        return checkFeature(userId, "abTesting");
    }

    public boolean canUseBulkImport(String userId) {
        return checkFeature(userId, "bulkImport");
    }

    public boolean canUseWebhooks(String userId) {
        return checkFeature(userId, "webhooks");
    }

    public boolean canUseVerifiedBadge(String userId) {
        return checkFeature(userId, "verifiedBadge");
    }

    public boolean canUseWhiteLabelBadge(String userId) {
        return checkFeature(userId, "whiteLabelBadge");
    }

    public boolean canUseLeadCaptureQR(String userId) {
        return checkFeature(userId, "leadCaptureQR");
    }

    public boolean canUseBulkQRGeneration(String userId) {
        return checkFeature(userId, "bulkQRGeneration");
    }

    public boolean canUseWhiteLabelQR(String userId) {
        return checkFeature(userId, "whiteLabelQR");
    }

    public boolean canUseLeadCaptureBeforeDownload(String userId) {
        return checkFeature(userId, "leadCaptureBeforeDownload");
    }

    public boolean canUseFileExpiration(String userId) {
        return checkFeature(userId, "fileExpiration");
    }

    public boolean canRemoveBranding(String userId) {
        return checkFeature(userId, "removeBranding");
    }

    // Pages
    public boolean canCreatePage(String userId) {
        return userRepository.findById(userId).map(user -> {
            PlanPolicy policy = getPolicy(user);
            int currentPages = (int) pageRepository.countByUserId(userId);
            return policy.canCreatePage(currentPages);
        }).orElse(false);
    }

    public boolean canRemovePageBranding(String userId) {
        return checkFeature(userId, "removePageBranding");
    }

    public boolean canUsePageCustomDomain(String userId) {
        return checkFeature(userId, "pageCustomDomain");
    }

    public boolean canUseSmartLinks(String userId) {
        return checkFeature(userId, "smartLinks");
    }

    public boolean canUseLeadForms(String userId) {
        return checkFeature(userId, "leadForms");
    }

    public boolean canUseWhiteLabelPages(String userId) {
        return checkFeature(userId, "whiteLabelPages");
    }

    // ── File size limit ─────────────────────────────────────────

    public long getMaxFileSizeMB(String userId) {
        return userRepository.findById(userId)
                .map(u -> (long) getPolicy(u).getMaxFileSizeMb())
                .orElse(10L);
    }

    // ── Analytics retention ─────────────────────────────────────

    public int getAnalyticsRetentionDays(String userId) {
        return userRepository.findById(userId)
                .map(u -> getPolicy(u).getAnalyticsRetentionDays())
                .orElse(7);
    }

    // ── Remaining usage ─────────────────────────────────────────

    public int getRemainingMonthlyUrls(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return Integer.MAX_VALUE;
            PlanPolicy policy = getPolicy(user);
            int limit = policy.getUrlsPerMonth();
            if (limit == -1)
                return Integer.MAX_VALUE;
            return Math.max(0, limit - user.getMonthlyUrlsCreated());
        }).orElse(0);
    }

    public int getRemainingMonthlyQrCodes(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return Integer.MAX_VALUE;
            PlanPolicy policy = getPolicy(user);
            int limit = policy.getStaticQrPerMonth();
            if (limit == -1)
                return Integer.MAX_VALUE;
            return Math.max(0, limit - user.getMonthlyQrCodesCreated());
        }).orElse(0);
    }

    public int getRemainingMonthlyDynamicQr(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return Integer.MAX_VALUE;
            PlanPolicy policy = getPolicy(user);
            int limit = policy.getDynamicQrPerMonth();
            if (limit == -1)
                return Integer.MAX_VALUE;
            if (limit == 0)
                return 0;
            int used = (user.getMonthlyDynamicQrCreated() != null) ? user.getMonthlyDynamicQrCreated() : 0;
            return Math.max(0, limit - used);
        }).orElse(0);
    }

    public int getRemainingMonthlyFiles(String userId) {
        return userRepository.findById(userId).map(user -> {
            resetMonthlyUsageIfNeeded(user);
            if (isInTrialPeriod(user))
                return Integer.MAX_VALUE;
            PlanPolicy policy = getPolicy(user);
            int limit = policy.getFilesPerMonth();
            if (limit == -1)
                return Integer.MAX_VALUE;
            return Math.max(0, limit - user.getMonthlyFilesUploaded());
        }).orElse(0);
    }

    // Daily = Monthly (no separate daily caps in policy)
    public int getRemainingDailyUrls(String userId) {
        return getRemainingMonthlyUrls(userId);
    }

    public int getRemainingDailyQrCodes(String userId) {
        return getRemainingMonthlyQrCodes(userId);
    }

    public int getRemainingDailyFiles(String userId) {
        return getRemainingMonthlyFiles(userId);
    }

    // ── Usage increment ─────────────────────────────────────────

    public void incrementUrlUsage(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            resetDailyUsageIfNeeded(user);
            resetMonthlyUsageIfNeeded(user);
            user.setDailyUrlsCreated(user.getDailyUrlsCreated() + 1);
            user.setMonthlyUrlsCreated(user.getMonthlyUrlsCreated() + 1);
            user.setTotalUrls(user.getTotalUrls() + 1);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    public void incrementQrCodeUsage(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            resetDailyUsageIfNeeded(user);
            resetMonthlyUsageIfNeeded(user);
            user.setDailyQrCodesCreated(user.getDailyQrCodesCreated() + 1);
            user.setMonthlyQrCodesCreated(user.getMonthlyQrCodesCreated() + 1);
            user.setTotalQrCodes(user.getTotalQrCodes() + 1);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    public void incrementDynamicQrUsage(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            resetMonthlyUsageIfNeeded(user);
            int used = (user.getMonthlyDynamicQrCreated() != null) ? user.getMonthlyDynamicQrCreated() : 0;
            user.setMonthlyDynamicQrCreated(used + 1);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    public void incrementFileUsage(String userId) {
        userRepository.findById(userId).ifPresent(user -> {
            resetDailyUsageIfNeeded(user);
            resetMonthlyUsageIfNeeded(user);
            user.setDailyFilesUploaded(user.getDailyFilesUploaded() + 1);
            user.setMonthlyFilesUploaded(user.getMonthlyFilesUploaded() + 1);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        });
    }

    // ── Subscription lifecycle ──────────────────────────────────

    public void upgradeToPremium(String userId, String planType, String subscriptionId, String customerId) {
        userRepository.findById(userId).ifPresent(user -> {
            user.setSubscriptionPlan(planType);
            user.setSubscriptionId(subscriptionId);
            user.setCustomerId(customerId);

            LocalDateTime now = LocalDateTime.now();
            LocalDateTime expiry;
            if (planType.contains("YEARLY"))
                expiry = now.plusYears(1);
            else if (planType.contains("MONTHLY"))
                expiry = now.plusMonths(1);
            else
                expiry = null;

            user.setSubscriptionExpiry(expiry);
            user.setUpdatedAt(now);
            userRepository.save(user);
            log.info("Upgraded user {} to plan: {}", userId, planType);
        });
    }

    public boolean cancelSubscription(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;
        User user = userOpt.get();
        if (FREE_PLAN.equals(user.getSubscriptionPlan()))
            return false;
        user.setSubscriptionCancelled(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return true;
    }

    public boolean startTrial(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;
        User user = userOpt.get();
        if (user.isHasUsedTrial() || !isEligibleForTrial(user))
            return false;
        LocalDateTime now = LocalDateTime.now();
        user.setTrialStartDate(now);
        user.setTrialEndDate(now.plusDays(1));
        user.setHasUsedTrial(true);
        user.setUpdatedAt(now);
        userRepository.save(user);
        return true;
    }

    public boolean isEligibleForTrial(User user) {
        return user.getConsecutiveLoginDays() >= 7 || user.getTotalLinksShared() >= 20;
    }

    // ── Scheduled expiry check ──────────────────────────────────

    @Scheduled(cron = "0 0 0 * * ?")
    public void checkSubscriptionExpiries() {
        log.info("Running daily subscription expiry check...");
        LocalDateTime now = LocalDateTime.now();
        int expired = 0;
        for (User user : userRepository.findAll()) {
            if (FREE_PLAN.equals(user.getSubscriptionPlan()))
                continue;
            if (user.getSubscriptionExpiry() != null && user.getSubscriptionExpiry().isBefore(now)) {
                user.setSubscriptionPlan(FREE_PLAN);
                user.setSubscriptionId(null);
                user.setSubscriptionExpiry(null);
                user.setUpdatedAt(now);
                userRepository.save(user);
                expired++;
            }
        }
        log.info("Expired {} subscriptions → downgraded to FREE", expired);
    }

    // ── Admin ───────────────────────────────────────────────────

    public List<Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    // ══════════════════════════════════════════════════════════
    // getUserFeatureMap — SINGLE SERVER-SIDE CAPABILITY SOURCE
    // ══════════════════════════════════════════════════════════

    /**
     * Returns the complete capability map for a user.
     * The frontend should call GET /api/v1/subscription/features/{userId}
     * and consume this object. Zero plan logic should exist on the frontend.
     */
    public Map<String, Object> getUserFeatureMap(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return buildGuestFeatureMap();

        User user = userOpt.get();
        resetDailyUsageIfNeeded(user);
        resetMonthlyUsageIfNeeded(user);

        PlanPolicy policy = getPolicy(user);
        boolean inTrial = isInTrialPeriod(user);
        boolean subActive = isSubscriptionActive(user);
        String planType = user.getSubscriptionPlan() != null ? user.getSubscriptionPlan() : FREE_PLAN;
        String billingCycle = PlanPolicy.getBillingCycle(planType);

        Map<String, Object> result = new LinkedHashMap<>();

        // ── Identity ──
        result.put("plan", planType);
        result.put("planTier", policy.name());
        result.put("billingCycle", billingCycle);
        result.put("isActive", subActive);
        result.put("inTrial", inTrial);
        result.put("expiresAt", user.getSubscriptionExpiry());
        result.put("trialEligible", !user.isHasUsedTrial() && isEligibleForTrial(user));

        // ── Limits ──
        Map<String, Object> limits = new LinkedHashMap<>();
        limits.put("urlsPerMonth", toApiLimit(policy.getUrlsPerMonth()));
        limits.put("staticQrPerMonth", toApiLimit(policy.getStaticQrPerMonth()));
        limits.put("dynamicQrPerMonth", policy.getDynamicQrPerMonth()); // 0 = N/A, -1 = unlimited
        limits.put("filesPerMonth", toApiLimit(policy.getFilesPerMonth()));
        limits.put("maxFileSizeMb", policy.getMaxFileSizeMb());
        limits.put("domains", policy.getDomains());
        limits.put("teamMembers", policy.getTeamMembers());
        limits.put("analyticsRetentionDays", policy.getAnalyticsRetentionDays());
        limits.put("pagesPerUser", toApiLimit(policy.getPagesPerUser()));
        limits.put("linksPerPage", toApiLimit(policy.getLinksPerPage()));
        limits.put("maxPixelsPerAccount", toApiLimit(policy.getMaxPixelsPerAccount()));
        limits.put("maxPixelsPerLink", policy.getMaxPixelsPerLink());
        result.put("limits", limits);

        // ── Features ──
        Map<String, Object> features = new LinkedHashMap<>();
        // Short Links
        features.put("customAlias", policy.hasCustomAlias());
        features.put("passwordProtection", policy.hasPasswordProtection());
        features.put("linkExpiration", policy.hasLinkExpiration());
        features.put("clickLimits", policy.hasClickLimits());
        features.put("richLinkPreview", policy.hasRichLinkPreview());
        features.put("openInApp", policy.hasOpenInApp());
        features.put("languageRouting", policy.hasLanguageRouting());
        features.put("locationRouting", policy.hasLocationRouting());
        features.put("unlockAfterSignup", policy.hasUnlockAfterSignup());
        features.put("pixelRetargeting", policy.hasPixelRetargeting());
        features.put("abTesting", policy.hasAbTesting());
        features.put("bulkImport", policy.hasBulkImport());
        features.put("smartRedirectRules", policy.hasSmartRedirectRules());
        features.put("webhooks", policy.hasWebhooks());
        // QR
        features.put("dynamicQR", policy.hasDynamicQR());
        features.put("customQRColors", policy.hasCustomQRColors());
        features.put("qrLogo", policy.hasQrLogo());
        features.put("qrBranding", policy.hasQrBranding());
        features.put("advancedQRSettings", policy.hasAdvancedQRSettings());
        features.put("multiActionQR", policy.hasMultiActionQR());
        features.put("openInAppQR", policy.hasOpenInAppQR());
        features.put("locationRoutingQR", policy.hasLocationRoutingQR());
        features.put("languageRoutingQR", policy.hasLanguageRoutingQR());
        features.put("leadCaptureQR", policy.hasLeadCaptureQR());
        features.put("pixelRetargetingQR", policy.hasPixelRetargetingQR());
        features.put("bulkQRGeneration", policy.hasBulkQRGeneration());
        features.put("whiteLabelQR", policy.hasWhiteLabelQR());
        // Pixel platforms
        features.put("metaCapi", policy.hasMetaCapi());
        features.put("googleAds", policy.hasGoogleAds());
        features.put("googleAnalytics4", policy.hasGoogleAnalytics4());
        features.put("webhookPixel", policy.hasWebhookPixel());
        features.put("advancedPixelAnalytics", policy.hasAdvancedPixelAnalytics());
        // Verified Badge
        features.put("verifiedBadge", policy.hasVerifiedBadge());
        features.put("whiteLabelBadge", policy.hasWhiteLabelBadge());
        features.put("badgeAnalytics", policy.hasBadgeAnalytics());
        features.put("agencyMode", policy.hasAgencyMode());
        // File Sharing
        features.put("advancedFileSettings", policy.hasAdvancedFileSettings());
        features.put("leadCaptureBeforeDownload", policy.hasLeadCaptureBeforeDownload());
        features.put("fileExpiration", policy.hasFileExpiration());
        features.put("removeBranding", policy.hasRemoveBranding());
        // Pages
        features.put("removePageBranding", policy.hasRemovePageBranding());
        features.put("pageCustomDomain", policy.hasPageCustomDomain());
        features.put("pageAdvancedAnalytics", policy.hasPageAdvancedAnalytics());
        features.put("smartLinks", policy.hasSmartLinks());
        features.put("leadForms", policy.hasLeadForms());
        features.put("whiteLabelPages", policy.hasWhiteLabelPages());
        features.put("customCSSInjection", policy.hasCustomCSSInjection());
        // Core
        features.put("customDomain", policy.hasCustomDomain());
        features.put("analytics", policy.hasAnalytics());
        features.put("teamCollaboration", policy.hasTeamCollaboration());
        features.put("whiteLabel", policy.hasWhiteLabel());
        features.put("apiAccess", policy.hasApiAccess());
        features.put("prioritySupport", policy.hasPrioritySupport());
        result.put("features", features);

        // ── Usage ──
        Map<String, Object> usage = new LinkedHashMap<>();
        int urlsUsed = user.getMonthlyUrlsCreated();
        int staticQrUsed = user.getMonthlyQrCodesCreated();
        int dynamicQrUsed = (user.getMonthlyDynamicQrCreated() != null) ? user.getMonthlyDynamicQrCreated() : 0;
        int filesUsed = user.getMonthlyFilesUploaded();

        usage.put("monthlyUrlsUsed", urlsUsed);
        usage.put("monthlyStaticQrUsed", staticQrUsed);
        usage.put("monthlyDynamicQrUsed", dynamicQrUsed);
        usage.put("monthlyFilesUsed", filesUsed);

        usage.put("remainingUrls", remainingLabel(policy.getUrlsPerMonth(), urlsUsed));
        usage.put("remainingStaticQr", remainingLabel(policy.getStaticQrPerMonth(), staticQrUsed));
        usage.put("remainingDynamicQr", remainingLabel(policy.getDynamicQrPerMonth(), dynamicQrUsed));
        usage.put("remainingFiles", remainingLabel(policy.getFilesPerMonth(), filesUsed));

        result.put("usage", usage);

        return result;
    }

    /** Returns -1 for unlimited, value otherwise */
    private int toApiLimit(int value) {
        return value;
    }

    /** Returns -1 for unlimited, else remaining count */
    private int remainingLabel(int limit, int used) {
        if (limit == -1)
            return -1;
        if (limit == 0)
            return 0;
        return Math.max(0, limit - used);
    }

    /** Guest / unauthenticated feature map */
    private Map<String, Object> buildGuestFeatureMap() {
        return getUserFeatureSkeleton(PlanPolicy.FREE, null);
    }

    private Map<String, Object> getUserFeatureSkeleton(PlanPolicy policy, User user) {
        // Minimal version — just returns empty limits and all-false features
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("plan", "FREE");
        result.put("planTier", "FREE");
        result.put("isActive", true);
        result.put("inTrial", false);
        return result;
    }

    // ══════════════════════════════════════════════════════════
    // Legacy getUserPlanInfo (backward compat)
    // ══════════════════════════════════════════════════════════

    public UserPlanInfo getUserPlanInfo(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return new UserPlanInfo();

        User user = userOpt.get();
        resetDailyUsageIfNeeded(user);

        UserPlanInfo info = new UserPlanInfo();
        PlanPolicy policy = getPolicy(user);

        info.setPlan(user.getSubscriptionPlan());
        info.setHasPremiumAccess(!policy.isFree());
        info.setInTrial(isInTrialPeriod(user));
        info.setTrialEligible(!user.isHasUsedTrial() && isEligibleForTrial(user));
        info.setSubscriptionExpiry(user.getSubscriptionExpiry());
        info.setRemainingDailyUrls(getRemainingDailyUrls(userId));
        info.setRemainingDailyQrCodes(getRemainingDailyQrCodes(userId));
        info.setRemainingDailyFiles(getRemainingDailyFiles(userId));
        info.setRemainingMonthlyUrls(getRemainingMonthlyUrls(userId));
        info.setRemainingMonthlyQrCodes(getRemainingMonthlyQrCodes(userId));
        info.setRemainingMonthlyFiles(getRemainingMonthlyFiles(userId));
        info.setMaxFileSizeMB(policy.getMaxFileSizeMb());
        info.setMaxPages(policy.getPagesPerUser());
        info.setLinksPerPage(policy.getLinksPerPage());
        info.setCanRemovePageBranding(policy.hasRemovePageBranding());
        info.setCanUsePageCustomDomain(policy.hasPageCustomDomain());
        info.setCanUseSmartLinks(policy.hasSmartLinks());
        info.setCanUseLeadForms(policy.hasLeadForms());
        info.setCanUsePremiumTemplates(policy.isPaid());
        return info;
    }

    // ── UserPlanInfo DTO (backward compat) ──

    public static class UserPlanInfo {
        private String plan;
        private boolean hasPremiumAccess;
        private boolean inTrial;
        private boolean trialEligible;
        private LocalDateTime subscriptionExpiry;
        private int remainingDailyUrls;
        private int remainingDailyQrCodes;
        private int remainingDailyFiles;
        private int remainingMonthlyUrls;
        private int remainingMonthlyQrCodes;
        private int remainingMonthlyFiles;
        private long maxFileSizeMB;
        private int maxPages;
        private int linksPerPage;
        private boolean canRemovePageBranding;
        private boolean canUsePageCustomDomain;
        private boolean canUseSmartLinks;
        private boolean canUseLeadForms;
        private boolean canUsePremiumTemplates;

        public String getPlan() {
            return plan;
        }

        public void setPlan(String plan) {
            this.plan = plan;
        }

        public boolean isHasPremiumAccess() {
            return hasPremiumAccess;
        }

        public void setHasPremiumAccess(boolean v) {
            this.hasPremiumAccess = v;
        }

        public boolean isInTrial() {
            return inTrial;
        }

        public void setInTrial(boolean v) {
            this.inTrial = v;
        }

        public boolean isTrialEligible() {
            return trialEligible;
        }

        public void setTrialEligible(boolean v) {
            this.trialEligible = v;
        }

        public LocalDateTime getSubscriptionExpiry() {
            return subscriptionExpiry;
        }

        public void setSubscriptionExpiry(LocalDateTime v) {
            this.subscriptionExpiry = v;
        }

        public int getRemainingDailyUrls() {
            return remainingDailyUrls;
        }

        public void setRemainingDailyUrls(int v) {
            this.remainingDailyUrls = v;
        }

        public int getRemainingDailyQrCodes() {
            return remainingDailyQrCodes;
        }

        public void setRemainingDailyQrCodes(int v) {
            this.remainingDailyQrCodes = v;
        }

        public int getRemainingDailyFiles() {
            return remainingDailyFiles;
        }

        public void setRemainingDailyFiles(int v) {
            this.remainingDailyFiles = v;
        }

        public int getRemainingMonthlyUrls() {
            return remainingMonthlyUrls;
        }

        public void setRemainingMonthlyUrls(int v) {
            this.remainingMonthlyUrls = v;
        }

        public int getRemainingMonthlyQrCodes() {
            return remainingMonthlyQrCodes;
        }

        public void setRemainingMonthlyQrCodes(int v) {
            this.remainingMonthlyQrCodes = v;
        }

        public int getRemainingMonthlyFiles() {
            return remainingMonthlyFiles;
        }

        public void setRemainingMonthlyFiles(int v) {
            this.remainingMonthlyFiles = v;
        }

        public long getMaxFileSizeMB() {
            return maxFileSizeMB;
        }

        public void setMaxFileSizeMB(long v) {
            this.maxFileSizeMB = v;
        }

        public int getMaxPages() {
            return maxPages;
        }

        public void setMaxPages(int v) {
            this.maxPages = v;
        }

        public int getLinksPerPage() {
            return linksPerPage;
        }

        public void setLinksPerPage(int v) {
            this.linksPerPage = v;
        }

        public boolean isCanRemovePageBranding() {
            return canRemovePageBranding;
        }

        public void setCanRemovePageBranding(boolean v) {
            this.canRemovePageBranding = v;
        }

        public boolean isCanUsePageCustomDomain() {
            return canUsePageCustomDomain;
        }

        public void setCanUsePageCustomDomain(boolean v) {
            this.canUsePageCustomDomain = v;
        }

        public boolean isCanUseSmartLinks() {
            return canUseSmartLinks;
        }

        public void setCanUseSmartLinks(boolean v) {
            this.canUseSmartLinks = v;
        }

        public boolean isCanUseLeadForms() {
            return canUseLeadForms;
        }

        public void setCanUseLeadForms(boolean v) {
            this.canUseLeadForms = v;
        }

        public boolean isCanUsePremiumTemplates() {
            return canUsePremiumTemplates;
        }

        public void setCanUsePremiumTemplates(boolean v) {
            this.canUsePremiumTemplates = v;
        }
    }
}