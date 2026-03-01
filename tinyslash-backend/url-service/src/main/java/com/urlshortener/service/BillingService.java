package com.urlshortener.service;

import com.urlshortener.model.User;
import com.urlshortener.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BillingService {

    private static final Logger logger = LoggerFactory.getLogger(BillingService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SubscriptionService subscriptionService;

    /**
     * Process successful payment and upgrade user
     */
    @Transactional
    public boolean processPaymentSuccess(String userId, String planType, String paymentId,
            String orderId, Double amount, Map<String, Object> paymentDetails) {
        try {
            logger.info("Processing payment success for user: {}, plan: {}", userId, planType);

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                logger.error("User not found: {}", userId);
                return false;
            }

            User user = userOpt.get();
            String oldPlan = user.getPlan();

            // Upgrade user plan
            try {
                subscriptionService.upgradeToPremium(userId, planType, paymentId, null);
            } catch (Exception e) {
                logger.error("Failed to upgrade user plan: {}", e.getMessage());
                return false;
            }

            // Send payment success email
            sendPaymentSuccessEmail(user, planType, paymentId, orderId, amount, paymentDetails);

            logger.info("Payment processed successfully for user: {}, upgraded from {} to {}",
                    userId, oldPlan, planType);
            return true;

        } catch (Exception e) {
            logger.error("Error processing payment success: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * Process failed payment
     */
    public void processPaymentFailure(String userId, String planType, String orderId,
            String errorMessage, Map<String, Object> paymentDetails) {
        try {
            logger.info("Processing payment failure for user: {}, plan: {}", userId, planType);

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                logger.error("User not found: {}", userId);
                return;
            }

            User user = userOpt.get();

            // Send payment failure email
            sendPaymentFailureEmail(user, planType, orderId, errorMessage, paymentDetails);

            logger.info("Payment failure processed for user: {}", userId);

        } catch (Exception e) {
            logger.error("Error processing payment failure: {}", e.getMessage(), e);
        }
    }

    /**
     * Check and send trial expiry reminders
     */
    public void checkAndSendTrialExpiryReminders() {
        try {
            logger.info("Checking for trial expiry reminders");

            LocalDateTime now = LocalDateTime.now();

            // Find users whose trial expires soon
            List<User> users = userRepository.findAll();

            for (User user : users) {
                // Check if user has a trial or subscription expiry date
                if (user.getSubscriptionExpiry() != null) {
                    long daysUntilExpiry = ChronoUnit.DAYS.between(now, user.getSubscriptionExpiry());

                    // Only send reminders for trial users (FREE plan with expiry date)
                    if ("FREE".equals(user.getPlan()) || user.getPlan() == null) {
                        // Send reminder 3 days before expiry
                        if (daysUntilExpiry == 3) {
                            sendTrialExpiryReminderEmail(user, 3);
                            logger.info("Sent 3-day trial expiry reminder to user: {}", user.getId());
                        }
                        // Send reminder 1 day before expiry
                        else if (daysUntilExpiry == 1) {
                            sendTrialExpiryReminderEmail(user, 1);
                            logger.info("Sent 1-day trial expiry reminder to user: {}", user.getId());
                        }
                        // Send reminder on expiry day
                        else if (daysUntilExpiry == 0) {
                            sendTrialExpiryReminderEmail(user, 0);
                            logger.info("Sent trial expiry day reminder to user: {}", user.getId());
                        }
                    }
                }
            }

        } catch (Exception e) {
            logger.error("Error checking trial expiry reminders: {}", e.getMessage(), e);
        }
    }

    /**
     * Send payment success email with invoice
     */
    private void sendPaymentSuccessEmail(User user, String planType, String paymentId,
            String orderId, Double amount, Map<String, Object> paymentDetails) {
        try {
            String planName = getPlanDisplayName(planType);
            String receiptUrl = (String) paymentDetails.getOrDefault("receipt_url", "N/A"); // Assuming receipt_url is
                                                                                            // in paymentDetails
            emailService.sendPaymentSuccess(user.getEmail(), planName, amount.toString() + " USD", receiptUrl);
            logger.info("Payment success email sent to: {}", user.getEmail());

        } catch (Exception e) {
            logger.error("Error sending payment success email: {}", e.getMessage(), e);
        }
    }

    /**
     * Send payment failure email
     */
    private void sendPaymentFailureEmail(User user, String planType, String orderId,
            String errorMessage, Map<String, Object> paymentDetails) {
        try {
            String planName = getPlanDisplayName(planType);
            emailService.sendPaymentFailed(user.getEmail(), planName);
            logger.info("Payment failure email sent to: {}", user.getEmail());

        } catch (Exception e) {
            logger.error("Error sending payment failure email: {}", e.getMessage(), e);
        }
    }

    /**
     * Send trial expiry reminder email
     */
    private void sendTrialExpiryReminderEmail(User user, int daysRemaining) {
        try {
            String planName = "Trial Account";
            LocalDateTime expiryDate = user.getSubscriptionExpiry();
            String dateStr = expiryDate != null ? expiryDate.toLocalDate().toString() : "N/A";

            // Use the new standard Resend-based method
            emailService.sendSubscriptionEndingAlert(user.getEmail(), planName, dateStr, daysRemaining);
            logger.info("Trial expiry reminder email sent to: {}", user.getEmail());

        } catch (Exception e) {
            logger.error("Error sending trial expiry reminder email: {}", e.getMessage(), e);
        }
    }

    // Removed legacy inline HTML builder methods to enforce architectural
    // transition to EmailService.java templates.

    /**
     * Get plan display name
     */
    private String getPlanDisplayName(String planType) {
        return switch (planType) {
            case "PRO_MONTHLY" -> "Pro Monthly";
            case "PRO_YEARLY" -> "Pro Yearly";
            case "BUSINESS_MONTHLY" -> "Business Monthly";
            case "BUSINESS_YEARLY" -> "Business Yearly";
            default -> planType;
        };
    }
}
