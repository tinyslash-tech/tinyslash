package com.urlshortener.controller;

import com.urlshortener.service.SubscriptionService;
import com.urlshortener.service.SubscriptionService.UserPlanInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Subscription Controller — full server-side plan enforcement.
 *
 * Key endpoint:
 * GET /api/v1/subscription/features/{userId}
 * → Returns complete capability JSON (limits + features + usage).
 * Frontend should consume this instead of any hardcoded plan logic.
 */
@RestController
@RequestMapping("/api/v1/subscription")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    // ── GET /features/{userId} — primary server-side capability endpoint ──────

    @GetMapping("/features/{userId}")
    public ResponseEntity<Map<String, Object>> getUserFeatures(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, Object> featureMap = subscriptionService.getUserFeatureMap(userId);
            response.put("success", true);
            response.put("data", featureMap);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get feature map: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── GET /plan/{userId} — legacy detailed plan info ─────────────────────────

    @GetMapping("/plan/{userId}")
    public ResponseEntity<Map<String, Object>> getUserPlan(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            UserPlanInfo info = subscriptionService.getUserPlanInfo(userId);
            Map<String, Object> planData = new LinkedHashMap<>();
            planData.put("plan", info.getPlan());
            planData.put("hasProAccess", info.isHasPremiumAccess());
            planData.put("inTrial", info.isInTrial());
            planData.put("trialEligible", info.isTrialEligible());
            planData.put("subscriptionExpiry", info.getSubscriptionExpiry());
            planData.put("remainingDailyUrls", info.getRemainingDailyUrls());
            planData.put("remainingDailyQrCodes", info.getRemainingDailyQrCodes());
            planData.put("remainingDailyFiles", info.getRemainingDailyFiles());
            planData.put("remainingMonthlyUrls", info.getRemainingMonthlyUrls());
            planData.put("remainingMonthlyQrCodes", info.getRemainingMonthlyQrCodes());
            planData.put("remainingMonthlyFiles", info.getRemainingMonthlyFiles());
            planData.put("maxFileSizeMB", info.getMaxFileSizeMB());
            planData.put("canUseCustomAlias", subscriptionService.canUseCustomAlias(userId));
            planData.put("canUsePasswordProtection", subscriptionService.canUsePasswordProtection(userId));
            planData.put("canSetExpiration", subscriptionService.canSetExpiration(userId));
            planData.put("canUseCustomDomain", subscriptionService.canUseCustomDomain(userId));
            planData.put("canAccessDetailedAnalytics", subscriptionService.canAccessDetailedAnalytics(userId));
            planData.put("canCustomizeQrCodes", subscriptionService.canCustomizeQrCodes(userId));
            planData.put("maxPages", info.getMaxPages());
            planData.put("linksPerPage", info.getLinksPerPage());
            planData.put("canRemovePageBranding", info.isCanRemovePageBranding());
            planData.put("canUsePageCustomDomain", info.isCanUsePageCustomDomain());
            planData.put("canUseSmartLinks", info.isCanUseSmartLinks());
            planData.put("canUseLeadForms", info.isCanUseLeadForms());
            response.put("success", true);
            response.put("data", planData);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get plan info: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── GET /check/{userId}/{action} — per-action gate ────────────────────────

    @GetMapping("/check/{userId}/{action}")
    public ResponseEntity<Map<String, Object>> checkAccess(
            @PathVariable String userId, @PathVariable String action) {

        Map<String, Object> response = new HashMap<>();
        try {
            boolean hasAccess;
            String message = "";

            switch (action.toLowerCase()) {
                // Usage limits
                case "create-url":
                    hasAccess = subscriptionService.canCreateUrl(userId);
                    if (!hasAccess)
                        message = "Monthly URL limit reached. Remaining: "
                                + subscriptionService.getRemainingMonthlyUrls(userId);
                    break;
                case "create-static-qr":
                case "create-qr":
                    hasAccess = subscriptionService.canCreateStaticQR(userId);
                    if (!hasAccess)
                        message = "Monthly static QR limit reached.";
                    break;
                case "create-dynamic-qr":
                    hasAccess = subscriptionService.canCreateDynamicQR(userId);
                    if (!hasAccess)
                        message = "Monthly dynamic QR limit reached.";
                    break;
                case "upload-file":
                    hasAccess = subscriptionService.canUploadFile(userId);
                    if (!hasAccess)
                        message = "Monthly file upload limit reached.";
                    break;

                // Short Link features
                case "custom-alias":
                    hasAccess = subscriptionService.canUseCustomAlias(userId);
                    if (!hasAccess)
                        message = "Custom aliases are available from the Starter plan.";
                    break;
                case "password-protection":
                    hasAccess = subscriptionService.canUsePasswordProtection(userId);
                    if (!hasAccess)
                        message = "Password protection is available from the Starter plan.";
                    break;
                case "expiration":
                    hasAccess = subscriptionService.canSetExpiration(userId);
                    if (!hasAccess)
                        message = "Link expiration is available from the Starter plan.";
                    break;
                case "rich-link-preview":
                    hasAccess = subscriptionService.canUseRichLinkPreview(userId);
                    if (!hasAccess)
                        message = "Rich link preview is available from the Starter plan.";
                    break;
                case "open-in-app":
                    hasAccess = subscriptionService.canUseOpenInApp(userId);
                    if (!hasAccess)
                        message = "Open in App is available on the Pro plan.";
                    break;
                case "language-routing":
                    hasAccess = subscriptionService.canUseLanguageRouting(userId);
                    if (!hasAccess)
                        message = "Language routing is available on the Pro plan.";
                    break;
                case "location-routing":
                    hasAccess = subscriptionService.canUseLocationRouting(userId);
                    if (!hasAccess)
                        message = "Location routing is available on the Pro plan.";
                    break;
                case "unlock-after-signup":
                    hasAccess = subscriptionService.canUseUnlockAfterSignup(userId);
                    if (!hasAccess)
                        message = "Unlock after signup is available on the Pro plan.";
                    break;
                case "pixel-retargeting":
                    hasAccess = subscriptionService.canUsePixelRetargeting(userId);
                    if (!hasAccess)
                        message = "Pixel retargeting is available on the Pro plan.";
                    break;
                case "ab-testing":
                    hasAccess = subscriptionService.canUseAbTesting(userId);
                    if (!hasAccess)
                        message = "A/B testing is available on the Business plan.";
                    break;
                case "bulk-import":
                    hasAccess = subscriptionService.canUseBulkImport(userId);
                    if (!hasAccess)
                        message = "Bulk import is available on the Business plan.";
                    break;
                case "webhooks":
                    hasAccess = subscriptionService.canUseWebhooks(userId);
                    if (!hasAccess)
                        message = "Webhooks are available on the Business plan.";
                    break;

                // QR features
                case "dynamic-qr":
                    hasAccess = subscriptionService.canUseDynamicQR(userId);
                    if (!hasAccess)
                        message = "Dynamic QR is available from the Starter plan.";
                    break;
                case "customize-qr":
                case "custom-qr-colors":
                    hasAccess = subscriptionService.canCustomizeQrCodes(userId);
                    if (!hasAccess)
                        message = "QR customization is available from the Starter plan.";
                    break;
                case "lead-capture-qr":
                    hasAccess = subscriptionService.canUseLeadCaptureQR(userId);
                    if (!hasAccess)
                        message = "Lead capture QR is available on the Pro plan.";
                    break;
                case "bulk-qr-generation":
                    hasAccess = subscriptionService.canUseBulkQRGeneration(userId);
                    if (!hasAccess)
                        message = "Bulk QR generation is available on the Business plan.";
                    break;
                case "white-label-qr":
                    hasAccess = subscriptionService.canUseWhiteLabelQR(userId);
                    if (!hasAccess)
                        message = "White-label QR is available on the Business plan.";
                    break;

                // Custom domain / analytics
                case "custom-domain":
                    hasAccess = subscriptionService.canUseCustomDomain(userId);
                    if (!hasAccess)
                        message = "Custom domains are available on the Pro plan.";
                    break;
                case "detailed-analytics":
                    hasAccess = subscriptionService.canAccessDetailedAnalytics(userId);
                    if (!hasAccess)
                        message = "Analytics are available from the Starter plan.";
                    break;

                // Verified Badge
                case "verified-badge":
                    hasAccess = subscriptionService.canUseVerifiedBadge(userId);
                    if (!hasAccess)
                        message = "Verified badge is available on the Pro plan.";
                    break;
                case "white-label-badge":
                    hasAccess = subscriptionService.canUseWhiteLabelBadge(userId);
                    if (!hasAccess)
                        message = "White-label badge is available on the Business plan.";
                    break;

                // File Sharing
                case "lead-capture-download":
                    hasAccess = subscriptionService.canUseLeadCaptureBeforeDownload(userId);
                    if (!hasAccess)
                        message = "Lead capture before download is available on the Business plan.";
                    break;
                case "file-expiration":
                    hasAccess = subscriptionService.canUseFileExpiration(userId);
                    if (!hasAccess)
                        message = "File expiration is available on the Business plan.";
                    break;
                case "remove-branding":
                    hasAccess = subscriptionService.canRemoveBranding(userId);
                    if (!hasAccess)
                        message = "Remove branding is available from the Starter plan.";
                    break;

                // Pages
                case "create-page":
                    hasAccess = subscriptionService.canCreatePage(userId);
                    if (!hasAccess)
                        message = "You have reached the maximum number of pages for your plan.";
                    break;
                case "remove-page-branding":
                    hasAccess = subscriptionService.canRemovePageBranding(userId);
                    if (!hasAccess)
                        message = "Remove page branding is available from the Starter plan.";
                    break;
                case "page-custom-domain":
                    hasAccess = subscriptionService.canUsePageCustomDomain(userId);
                    if (!hasAccess)
                        message = "Page custom domain is available on the Pro plan.";
                    break;
                case "smart-links":
                    hasAccess = subscriptionService.canUseSmartLinks(userId);
                    if (!hasAccess)
                        message = "Smart links are available on the Pro plan.";
                    break;
                case "lead-forms":
                    hasAccess = subscriptionService.canUseLeadForms(userId);
                    if (!hasAccess)
                        message = "Lead forms are available on the Business plan.";
                    break;
                case "white-label-pages":
                    hasAccess = subscriptionService.canUseWhiteLabelPages(userId);
                    if (!hasAccess)
                        message = "White-label pages are available on the Business plan.";
                    break;

                default:
                    response.put("success", false);
                    response.put("message", "Unknown action: " + action);
                    return ResponseEntity.badRequest().body(response);
            }

            response.put("success", true);
            response.put("hasAccess", hasAccess);
            response.put("message", message);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to check access: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── POST /trial/{userId} ───────────────────────────────────

    @PostMapping("/trial/{userId}")
    public ResponseEntity<Map<String, Object>> startTrial(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean started = subscriptionService.startTrial(userId);
            response.put("success", started);
            response.put("message", started
                    ? "Trial started! You now have 24-hour premium access."
                    : "Not eligible for trial or trial already used.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to start trial: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── POST /upgrade ─────────────────────────────────────────

    @PostMapping("/upgrade")
    public ResponseEntity<Map<String, Object>> upgradePlan(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            String userId = (String) request.get("userId");
            String planType = (String) request.get("planType");
            String subscriptionId = (String) request.get("subscriptionId");
            String customerId = (String) request.get("customerId");

            if (userId == null || planType == null) {
                response.put("success", false);
                response.put("message", "userId and planType are required");
                return ResponseEntity.badRequest().body(response);
            }

            subscriptionService.upgradeToPremium(userId, planType, subscriptionId, customerId);
            response.put("success", true);
            response.put("message", "Plan upgraded to " + planType);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upgrade plan: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── POST /cancel/{userId} ─────────────────────────────────

    @PostMapping("/cancel/{userId}")
    public ResponseEntity<Map<String, Object>> cancelSubscription(@PathVariable String userId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean cancelled = subscriptionService.cancelSubscription(userId);
            response.put("success", cancelled);
            response.put("message", cancelled
                    ? "Subscription cancelled. Access continues until billing period ends."
                    : "No active subscription found.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to cancel: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── GET /admin/all ────────────────────────────────────────

    @GetMapping("/admin/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllSubscriptions() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<com.urlshortener.model.Subscription> subs = subscriptionService.getAllSubscriptions();
            List<Map<String, Object>> list = new ArrayList<>();
            for (com.urlshortener.model.Subscription sub : subs) {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", sub.getId());
                m.put("userId", sub.getUserId());
                m.put("planType", sub.getPlanType());
                m.put("planTier", sub.getPlanTier());
                m.put("billingCycle", sub.getBillingCycle());
                m.put("amount", sub.getAmountPaid());
                m.put("currency", sub.getCurrency());
                m.put("paymentId", sub.getPaymentId());
                m.put("orderId", sub.getOrderId());
                m.put("status", sub.isActive() ? "Active" : "Inactive");
                m.put("createdAt", sub.getCreatedAt());
                m.put("expiresAt", sub.getExpiresAt());
                m.put("renewalDate", sub.getRenewalDate());
                m.put("cancelled", sub.isCancelled());
                list.add(m);
            }
            response.put("success", true);
            response.put("data", list);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch subscriptions: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // ── GET /pricing — live pricing data served from backend ──────────────────

    @GetMapping("/pricing")
    public ResponseEntity<Map<String, Object>> getPricing() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Map<String, Object>> plans = new ArrayList<>();

            // FREE
            plans.add(buildPlan("FREE", "Free", 0, 0, "forever",
                    "₹0",
                    new String[] {
                            "15 short links / month",
                            "15 static QR codes / month",
                            "3 file uploads (10 MB max)",
                            "7-day analytics",
                            "1 TinySlash Page (5 links)",
                            "Community support"
                    }, null));

            // STARTER
            plans.add(buildPlan("STARTER", "Starter", 299, 2990, "month",
                    "₹299 / month | ₹2,990 / year",
                    new String[] {
                            "1,000 links / month",
                            "25 dynamic QR · unlimited static QR",
                            "50 file uploads (100 MB max)",
                            "30-day analytics",
                            "Custom slug · password · expiry",
                            "Rich link preview",
                            "2 TinySlash Pages · remove branding",
                            "Email support"
                    }, null));

            // PRO
            Map<String, Object> pro = buildPlan("PRO", "Pro", 999, 9990, "month",
                    "₹999 / month | ₹9,990 / year",
                    new String[] {
                            "Unlimited links",
                            "500 dynamic QR · unlimited static QR",
                            "200 file uploads (500 MB max)",
                            "90-day analytics + UTM builder",
                            "2 custom domains",
                            "Open in App · language + location routing",
                            "Pixel retargeting (5 pixels/account, 2/link)",
                            "Verified badge · 5 Pages · 3 members",
                            "Priority support"
                    }, "Most Popular");
            plans.add(pro);

            // BUSINESS
            plans.add(buildPlan("BUSINESS", "Business", 3499, 34990, "month",
                    "₹3,499 / month | ₹34,990 / year",
                    new String[] {
                            "Unlimited links, QR, files (2 GB)",
                            "1-year analytics + data export",
                            "10 custom domains",
                            "A/B testing · bulk import · webhooks",
                            "Enterprise pixels — all platforms",
                            "White-label QR + badge + pages",
                            "10 members · RBAC · audit logs",
                            "Dedicated manager · 99.9% SLA"
                    }, null));

            response.put("success", true);
            response.put("data", plans);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to get pricing: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    private Map<String, Object> buildPlan(String id, String name, int monthlyPrice, int yearlyPrice,
            String period, String priceLabel,
            String[] features, String badge) {
        Map<String, Object> plan = new LinkedHashMap<>();
        plan.put("id", id);
        plan.put("name", name);
        plan.put("monthlyPrice", monthlyPrice);
        plan.put("yearlyPrice", yearlyPrice);
        plan.put("currency", "INR");
        plan.put("period", period);
        plan.put("priceLabel", priceLabel);
        plan.put("features", features);
        if (badge != null)
            plan.put("badge", badge);
        return plan;
    }
}