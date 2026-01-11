package com.urlshortener.service;

import com.urlshortener.model.User;
import com.urlshortener.model.PlanPolicy;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;

@Service
public class SubscriptionService {

    private static final Logger logger = LoggerFactory.getLogger(SubscriptionService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.urlshortener.repository.SubscriptionRepository subscriptionRepository;

    /**
     * Get all subscriptions (for admin)
     */
    public List<com.urlshortener.model.Subscription> getAllSubscriptions() {
        return subscriptionRepository.findAll();
    }

    // Plan constants
    public static final String FREE_PLAN = "FREE";
    public static final String STARTER_MONTHLY = "STARTER_MONTHLY";
    public static final String STARTER_YEARLY = "STARTER_YEARLY";
    public static final String PRO_MONTHLY = "PRO_MONTHLY";
    public static final String PRO_YEARLY = "PRO_YEARLY";
    public static final String BUSINESS_MONTHLY = "BUSINESS_MONTHLY";
    public static final String BUSINESS_YEARLY = "BUSINESS_YEARLY";

    // File size limits (Still kept here or could move to Policy if added there)
    public static final long FREE_FILE_SIZE_MB = 5;
    public static final long STARTER_FILE_SIZE_MB = 20; // Example for Starter
    public static final long PRO_FILE_SIZE_MB = 100;
    public static final long BUSINESS_FILE_SIZE_MB = 500;

    /**
     * Check if user has premium access
     * Now checks if plan is NOT Free
     */
    public boolean hasPremiumAccess(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();
        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());

        return policy != PlanPolicy.FREE && isSubscriptionActive(user);
    }

    private boolean isSubscriptionActive(User user) {
        if (PlanPolicy.fromString(user.getSubscriptionPlan()) == PlanPolicy.FREE)
            return true;

        // If expiry is null, assume active (e.g. lifetime or new)
        if (user.getSubscriptionExpiry() == null)
            return true;

        return user.getSubscriptionExpiry().isAfter(LocalDateTime.now());
    }

    /**
     * Check if user has specific business access
     */
    public boolean hasBusinessAccess(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();
        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());

        return (policy == PlanPolicy.BUSINESS || policy == PlanPolicy.BUSINESS_TRIAL) && isSubscriptionActive(user);
    }

    /**
     * Check if user is in trial period
     */
    public boolean isInTrialPeriod(User user) {
        if (user.getTrialStartDate() != null && user.getTrialEndDate() != null) {
            LocalDateTime now = LocalDateTime.now();
            return now.isAfter(user.getTrialStartDate()) && now.isBefore(user.getTrialEndDate());
        }
        return false;
    }

    /**
     * Check if user can create more URLs
     */
    public boolean canCreateUrl(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();
        resetMonthlyUsageIfNeeded(user);

        // Trial override
        if (isInTrialPeriod(user))
            return true;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());

        // If expired paid plan, treat as FREE
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user)) {
            policy = PlanPolicy.FREE;
        }

        return user.getMonthlyUrlsCreated() < policy.getUrlsPerMonth();
    }

    /**
     * Check if user can create more QR codes
     */
    public boolean canCreateQrCode(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return true; // Default allow for anonymous if handled upstream

        User user = userOpt.get();
        resetMonthlyUsageIfNeeded(user);

        if (isInTrialPeriod(user))
            return true;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        return user.getMonthlyQrCodesCreated() < policy.getQrCodesPerMonth();
    }

    /**
     * Check if user can upload more files
     */
    public boolean canUploadFile(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();
        resetMonthlyUsageIfNeeded(user);

        if (isInTrialPeriod(user))
            return true;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        return user.getMonthlyFilesUploaded() < policy.getFilesPerMonth();
    }

    // Feature checks delegated to Policy
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

    private boolean checkFeature(String userId, String featureName) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();
        if (isInTrialPeriod(user))
            return true;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        return policy.hasFeature(featureName);
    }

    /**
     * Get maximum file size for user
     */
    public long getMaxFileSizeMB(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return FREE_FILE_SIZE_MB;

        User user = userOpt.get();
        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());

        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        switch (policy) {
            case BUSINESS:
            case BUSINESS_TRIAL:
                return BUSINESS_FILE_SIZE_MB;
            case PRO:
                return PRO_FILE_SIZE_MB;
            case STARTER:
                return STARTER_FILE_SIZE_MB;
            default:
                return FREE_FILE_SIZE_MB;
        }
    }

    /**
     * Increment URL usage for user
     */
    public void incrementUrlUsage(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return;

        User user = userOpt.get();
        resetDailyUsageIfNeeded(user);
        resetMonthlyUsageIfNeeded(user);

        user.setDailyUrlsCreated(user.getDailyUrlsCreated() + 1);
        user.setMonthlyUrlsCreated(user.getMonthlyUrlsCreated() + 1);
        user.setTotalUrls(user.getTotalUrls() + 1);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    // ... (Increment methods for QR and Files remain similar, just calling save)

    public void incrementQrCodeUsage(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return;
        User user = userOpt.get();
        resetDailyUsageIfNeeded(user);
        resetMonthlyUsageIfNeeded(user);
        user.setDailyQrCodesCreated(user.getDailyQrCodesCreated() + 1);
        user.setMonthlyQrCodesCreated(user.getMonthlyQrCodesCreated() + 1);
        user.setTotalQrCodes(user.getTotalQrCodes() + 1);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void incrementFileUsage(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return;
        User user = userOpt.get();
        resetDailyUsageIfNeeded(user);
        resetMonthlyUsageIfNeeded(user);
        user.setDailyFilesUploaded(user.getDailyFilesUploaded() + 1);
        user.setMonthlyFilesUploaded(user.getMonthlyFilesUploaded() + 1);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    /**
     * Reset daily usage counters if 24 hours have passed
     */
    private void resetDailyUsageIfNeeded(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastReset = user.getLastUsageReset();

        if (lastReset == null || ChronoUnit.HOURS.between(lastReset, now) >= 24) {
            user.setDailyUrlsCreated(0);
            user.setDailyQrCodesCreated(0);
            user.setDailyFilesUploaded(0);
            user.setLastUsageReset(now);
            userRepository.save(user);
        }
    }

    /**
     * Reset monthly usage counters if 30 days have passed
     */
    private void resetMonthlyUsageIfNeeded(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastMonthlyReset = user.getLastMonthlyReset();

        if (lastMonthlyReset == null || ChronoUnit.DAYS.between(lastMonthlyReset, now) >= 30) {
            user.setMonthlyUrlsCreated(0);
            user.setMonthlyQrCodesCreated(0);
            user.setMonthlyFilesUploaded(0);
            user.setLastMonthlyReset(now);
            userRepository.save(user);
        }
    }

    /**
     * Upgrade user to premium plan
     */
    public void upgradeToPremium(String userId, String planType, String subscriptionId, String customerId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return;

        User user = userOpt.get();
        user.setSubscriptionPlan(planType);
        user.setSubscriptionId(subscriptionId);
        user.setCustomerId(customerId);

        // Set expiry date based on plan
        LocalDateTime expiry = null;
        if (planType.contains("MONTHLY")) {
            expiry = LocalDateTime.now().plusMonths(1);
        } else if (planType.contains("YEARLY")) {
            expiry = LocalDateTime.now().plusYears(1);
        }

        user.setSubscriptionExpiry(expiry);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        logger.info("Upgraded user {} to plan: {}", userId, planType);
    }

    /**
     * Start trial for eligible user
     */
    public boolean startTrial(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return false;

        User user = userOpt.get();

        if (user.isHasUsedTrial() || !isEligibleForTrial(user)) {
            return false;
        }

        LocalDateTime now = LocalDateTime.now();
        user.setTrialStartDate(now);
        user.setTrialEndDate(now.plusDays(1)); // 1-day trial
        user.setHasUsedTrial(true);
        user.setUpdatedAt(now);

        userRepository.save(user);
        return true;
    }

    /**
     * Check if user is eligible for trial
     */
    public boolean isEligibleForTrial(User user) {
        return user.getConsecutiveLoginDays() >= 7 || user.getTotalLinksShared() >= 20;
    }

    /**
     * Get remaining daily limits (Delegated to monthly limits mostly because we
     * don't strict daily limits in Policy yet)
     * But keeping structure for frontend compatibility
     */
    public int getRemainingDailyUrls(String userId) {
        // Current policy focuses on monthly. Retaining daily reset logic but
        // effectively unlimited daily if monthly ok?
        // Policy doesn't actually have daily limits defined, only monthly.
        // So we will return remaining monthly for consistency or a high number.
        return getRemainingMonthlyUrls(userId);
    }

    public int getRemainingDailyQrCodes(String userId) {
        return getRemainingMonthlyQrCodes(userId);
    }

    public int getRemainingDailyFiles(String userId) {
        return getRemainingMonthlyFiles(userId);
    }

    /**
     * Get remaining monthly limits based on Policy
     */
    public int getRemainingMonthlyUrls(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return 0;

        User user = userOpt.get();
        resetMonthlyUsageIfNeeded(user);

        if (isInTrialPeriod(user))
            return Integer.MAX_VALUE;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        int limit = policy.getUrlsPerMonth();
        if (limit == Integer.MAX_VALUE)
            return Integer.MAX_VALUE;

        return Math.max(0, limit - user.getMonthlyUrlsCreated());
    }

    public int getRemainingMonthlyQrCodes(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return 0;
        User user = userOpt.get();
        resetMonthlyUsageIfNeeded(user);
        if (isInTrialPeriod(user))
            return Integer.MAX_VALUE;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        int limit = policy.getQrCodesPerMonth();
        if (limit == Integer.MAX_VALUE)
            return Integer.MAX_VALUE;
        return Math.max(0, limit - user.getMonthlyQrCodesCreated());
    }

    public int getRemainingMonthlyFiles(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return 0;
        User user = userOpt.get();
        resetMonthlyUsageIfNeeded(user);
        if (isInTrialPeriod(user))
            return Integer.MAX_VALUE;

        PlanPolicy policy = PlanPolicy.fromString(user.getSubscriptionPlan());
        if (policy != PlanPolicy.FREE && !isSubscriptionActive(user))
            policy = PlanPolicy.FREE;

        int limit = policy.getFilesPerMonth();
        if (limit == Integer.MAX_VALUE)
            return Integer.MAX_VALUE;
        return Math.max(0, limit - user.getMonthlyFilesUploaded());
    }

    /**
     * Get user's current plan info
     */
    public UserPlanInfo getUserPlanInfo(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty())
            return new UserPlanInfo();

        User user = userOpt.get();
        resetDailyUsageIfNeeded(user);

        UserPlanInfo info = new UserPlanInfo();
        info.setPlan(user.getSubscriptionPlan());
        info.setHasPremiumAccess(hasPremiumAccess(userId));
        info.setInTrial(isInTrialPeriod(user));
        info.setTrialEligible(!user.isHasUsedTrial() && isEligibleForTrial(user));
        info.setSubscriptionExpiry(user.getSubscriptionExpiry());

        info.setRemainingDailyUrls(getRemainingDailyUrls(userId));
        info.setRemainingDailyQrCodes(getRemainingDailyQrCodes(userId));
        info.setRemainingDailyFiles(getRemainingDailyFiles(userId));
        info.setRemainingMonthlyUrls(getRemainingMonthlyUrls(userId));
        info.setRemainingMonthlyQrCodes(getRemainingMonthlyQrCodes(userId));
        info.setRemainingMonthlyFiles(getRemainingMonthlyFiles(userId));
        info.setMaxFileSizeMB(getMaxFileSizeMB(userId));

        return info;
    }

    /**
     * Check for expired subscriptions daily
     */
    @Scheduled(cron = "0 0 0 * * ?") // Daily at midnight
    public void checkSubscriptionExpiries() {
        logger.info("Running daily subscription expiration check...");
        List<User> allUsers = userRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        int expiredCount = 0;

        for (User user : allUsers) {
            if (FREE_PLAN.equals(user.getSubscriptionPlan()))
                continue;

            if (user.getSubscriptionExpiry() != null && user.getSubscriptionExpiry().isBefore(now)) {
                user.setSubscriptionPlan(FREE_PLAN);
                user.setSubscriptionId(null);
                user.setSubscriptionExpiry(null);
                user.setUpdatedAt(now);
                userRepository.save(user);
                expiredCount++;
            }
        }
    }

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

        public String getPlan() {
            return plan;
        }

        public void setPlan(String plan) {
            this.plan = plan;
        }

        public boolean isHasPremiumAccess() {
            return hasPremiumAccess;
        }

        public void setHasPremiumAccess(boolean hasPremiumAccess) {
            this.hasPremiumAccess = hasPremiumAccess;
        }

        public boolean isInTrial() {
            return inTrial;
        }

        public void setInTrial(boolean inTrial) {
            this.inTrial = inTrial;
        }

        public boolean isTrialEligible() {
            return trialEligible;
        }

        public void setTrialEligible(boolean trialEligible) {
            this.trialEligible = trialEligible;
        }

        public LocalDateTime getSubscriptionExpiry() {
            return subscriptionExpiry;
        }

        public void setSubscriptionExpiry(LocalDateTime subscriptionExpiry) {
            this.subscriptionExpiry = subscriptionExpiry;
        }

        public int getRemainingDailyUrls() {
            return remainingDailyUrls;
        }

        public void setRemainingDailyUrls(int remainingDailyUrls) {
            this.remainingDailyUrls = remainingDailyUrls;
        }

        public int getRemainingDailyQrCodes() {
            return remainingDailyQrCodes;
        }

        public void setRemainingDailyQrCodes(int remainingDailyQrCodes) {
            this.remainingDailyQrCodes = remainingDailyQrCodes;
        }

        public int getRemainingDailyFiles() {
            return remainingDailyFiles;
        }

        public void setRemainingDailyFiles(int remainingDailyFiles) {
            this.remainingDailyFiles = remainingDailyFiles;
        }

        public int getRemainingMonthlyUrls() {
            return remainingMonthlyUrls;
        }

        public void setRemainingMonthlyUrls(int remainingMonthlyUrls) {
            this.remainingMonthlyUrls = remainingMonthlyUrls;
        }

        public int getRemainingMonthlyQrCodes() {
            return remainingMonthlyQrCodes;
        }

        public void setRemainingMonthlyQrCodes(int remainingMonthlyQrCodes) {
            this.remainingMonthlyQrCodes = remainingMonthlyQrCodes;
        }

        public int getRemainingMonthlyFiles() {
            return remainingMonthlyFiles;
        }

        public void setRemainingMonthlyFiles(int remainingMonthlyFiles) {
            this.remainingMonthlyFiles = remainingMonthlyFiles;
        }

        public long getMaxFileSizeMB() {
            return maxFileSizeMB;
        }

        public void setMaxFileSizeMB(long maxFileSizeMB) {
            this.maxFileSizeMB = maxFileSizeMB;
        }
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
}