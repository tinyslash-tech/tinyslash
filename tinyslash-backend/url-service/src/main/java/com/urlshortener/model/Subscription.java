package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

/**
 * Stores a user subscription record.
 *
 * planType examples: FREE, STARTER_MONTHLY, STARTER_YEARLY,
 * PRO_MONTHLY, PRO_YEARLY,
 * BUSINESS_MONTHLY, BUSINESS_YEARLY
 * planTier: the resolved tier (FREE/STARTER/PRO/BUSINESS) — derived from
 * planType.
 * billingCycle: FREE | MONTHLY | YEARLY
 */
@Document(collection = "subscriptions")
public class Subscription {

    @Id
    private String id;

    @Indexed
    private String userId;

    /** Full plan key, e.g. PRO_MONTHLY, STARTER_YEARLY, FREE */
    private String planType;

    /**
     * Resolved plan tier: FREE | STARTER | PRO | BUSINESS
     * Stored for fast access without parsing planType each time.
     */
    private String planTier;

    /** MONTHLY | YEARLY | FREE */
    private String billingCycle;

    private String paymentId; // Razorpay payment ID
    private String orderId; // Razorpay order ID
    private String signature; // Razorpay signature (for audit)

    private boolean isActive = true;
    private boolean isCancelled = false;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
    private LocalDateTime expiresAt;
    private LocalDateTime renewalDate;
    private LocalDateTime cancelledAt;

    // Payment details
    private Integer amountPaid; // Amount in paise (100 paise = ₹1)
    private String currency = "INR";
    private String couponCode;
    private Integer discountAmount;

    // AI Generation Usage
    private Integer aiPagesGenerated = 0;
    private Integer aiFieldsGenerated = 0;
    private LocalDateTime aiUsageResetAt = LocalDateTime.now().plusMonths(1);

    // ── Constructors ──

    public Subscription() {
    }

    public Subscription(String userId, String planType, String paymentId) {
        this.userId = userId;
        this.planType = planType;
        this.planTier = PlanPolicy.fromString(planType).name();
        this.billingCycle = PlanPolicy.getBillingCycle(planType);
        this.paymentId = paymentId;
    }

    // ── Getters & Setters ──

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPlanType() {
        return planType;
    }

    public void setPlanType(String planType) {
        this.planType = planType;
        this.planTier = PlanPolicy.fromString(planType).name();
        this.billingCycle = PlanPolicy.getBillingCycle(planType);
    }

    public String getPlanTier() {
        return planTier;
    }

    public void setPlanTier(String planTier) {
        this.planTier = planTier;
    }

    public String getBillingCycle() {
        return billingCycle;
    }

    public void setBillingCycle(String billingCycle) {
        this.billingCycle = billingCycle;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isCancelled() {
        return isCancelled;
    }

    public void setCancelled(boolean cancelled) {
        isCancelled = cancelled;
        if (cancelled)
            cancelledAt = LocalDateTime.now();
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

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public LocalDateTime getRenewalDate() {
        return renewalDate;
    }

    public void setRenewalDate(LocalDateTime renewalDate) {
        this.renewalDate = renewalDate;
    }

    public LocalDateTime getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(LocalDateTime cancelledAt) {
        this.cancelledAt = cancelledAt;
    }

    public Integer getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(Integer amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public Integer getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Integer discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Integer getAiPagesGenerated() {
        return aiPagesGenerated;
    }

    public void setAiPagesGenerated(Integer aiPagesGenerated) {
        this.aiPagesGenerated = aiPagesGenerated;
    }

    public Integer getAiFieldsGenerated() {
        return aiFieldsGenerated;
    }

    public void setAiFieldsGenerated(Integer aiFieldsGenerated) {
        this.aiFieldsGenerated = aiFieldsGenerated;
    }

    public LocalDateTime getAiUsageResetAt() {
        return aiUsageResetAt;
    }

    public void setAiUsageResetAt(LocalDateTime aiUsageResetAt) {
        this.aiUsageResetAt = aiUsageResetAt;
    }
}