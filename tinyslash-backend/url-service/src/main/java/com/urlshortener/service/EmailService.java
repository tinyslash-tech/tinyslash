package com.urlshortener.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.urlshortener.model.SupportTicket;
import com.urlshortener.model.SupportResponse;
import com.urlshortener.model.CustomerOrder;
import com.urlshortener.model.Booking;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class EmailService {

        private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
        private static final String RESEND_API_URL = "https://api.resend.com/emails";

        private final ObjectMapper objectMapper;
        private final HttpClient httpClient;

        @Value("${app.frontend.url:https://tinyslash.com}")
        private String frontendUrl;

        @Value("${app.support.email:support@pebly.com}")
        private String supportEmail;

        @Value("${resend.from.name:Tinyslash Team}")
        private String defaultFromName;

        // Resend specific configurations injected from application.properties / .env
        @Value("${resend.api.key:re_placeholder_key_here}")
        private String resendApiKey;

        @Value("${resend.from.auth:auth@tinyslash.com}")
        private String fromAuthEmail;

        @Value("${resend.from.notifications:notifications@tinyslash.com}")
        private String fromNotificationsEmail;

        public EmailService() {
                this.objectMapper = new ObjectMapper();
                this.httpClient = HttpClient.newBuilder()
                                .version(HttpClient.Version.HTTP_2)
                                .connectTimeout(Duration.ofSeconds(10))
                                .build();
        }

        @PostConstruct
        public void init() {
                if (this.resendApiKey != null)
                        this.resendApiKey = this.resendApiKey.trim();
                if (this.fromAuthEmail != null)
                        this.fromAuthEmail = this.fromAuthEmail.trim();
                if (this.fromNotificationsEmail != null)
                        this.fromNotificationsEmail = this.fromNotificationsEmail.trim();

                logger.info("EmailService initialized with RESEND_API_KEY length: {}",
                                resendApiKey != null ? resendApiKey.length() : 0);
                logger.info("EmailService from addresses: auth={}, notifications={}", fromAuthEmail,
                                fromNotificationsEmail);
        }

        /**
         * Core Private Dispatcher using Native Java 11+ HttpClient
         */
        private void dispatchTransnationalEmail(String toEmail, String fromEmailAddress, String subject,
                        String htmlBody) {
                if (!StringUtils.hasText(resendApiKey) || resendApiKey.contains("placeholder")
                                || resendApiKey.isEmpty()) {
                        logger.warn("[MOCK MODE] Resend API key missing. Would have sent via {}: {} -> {}",
                                        fromEmailAddress,
                                        subject, toEmail);
                        logger.debug(htmlBody);
                        return;
                }

                try {
                        ObjectNode payload = objectMapper.createObjectNode();
                        payload.put("from", defaultFromName + " <" + fromEmailAddress + ">");

                        ArrayNode toArray = payload.putArray("to");
                        toArray.add(toEmail);

                        payload.put("subject", subject);
                        payload.put("html", htmlBody);

                        String requestBody = objectMapper.writeValueAsString(payload);

                        HttpRequest request = HttpRequest.newBuilder()
                                        .uri(URI.create(RESEND_API_URL))
                                        .header("Authorization", "Bearer " + resendApiKey)
                                        .header("Content-Type", "application/json")
                                        .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                                        .build();

                        logger.info("Attempting to send email via Resend to {}. Request body length: {}. Key length: {}",
                                        toEmail, requestBody.length(),
                                        resendApiKey != null ? resendApiKey.length() : "NULL");

                        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

                        if (response.statusCode() >= 200 && response.statusCode() < 300) {
                                logger.info("Email dispatched successfully to {} via {}. Status: {}", toEmail,
                                                fromEmailAddress, response.statusCode());
                        } else {
                                logger.error("Failed to sequence Resend dispatch to {}. API Status: {}. Response: {}",
                                                toEmail,
                                                response.statusCode(), response.body());
                                logger.error("Failed payload body: {}", requestBody);
                        }

                } catch (Exception e) {
                        logger.error("Critical failure constructing/sending Resend payload for {}. Exception: {}",
                                        toEmail, e.getMessage(), e);
                }
        }

        /**
         * Wraps content in standard B2B HTML structure (Sans-serif, neutral palette, no
         * emojis)
         */
        private String wrapHtmlBody(String headerText, String mainContent, String subText) {
                StringBuilder sb = new StringBuilder();
                sb.append(
                                "<div style=\"font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;\">");
                sb.append("<div style=\"border-bottom: 1px solid #e5e7eb; padding-bottom: 24px; margin-bottom: 32px;\">");
                sb.append("<strong style=\"color: #111827; font-size: 20px; font-weight: 600; margin: 0;\">")
                                .append(headerText)
                                .append("</strong>");
                sb.append("</div>");

                sb.append("<div style=\"color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 32px;\">");
                sb.append(mainContent);
                sb.append("</div>");

                if (StringUtils.hasText(subText)) {
                        sb.append(
                                        "<div style=\"background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 20px; margin-bottom: 32px;\">");
                        sb.append("<p style=\"color: #4b5563; font-size: 14px; margin: 0;\">").append(subText)
                                        .append("</p>");
                        sb.append("</div>");
                }

                sb.append("<div style=\"border-top: 1px solid #e5e7eb; padding-top: 24px; text-align: left;\">");
                sb.append(
                                "<p style=\"color: #9ca3af; font-size: 12px; margin: 0;\">This is an automated system notification from Tinyslash Inc. Please do not reply directly to this address.</p>");
                sb.append("</div>");
                sb.append("</div>");

                return sb.toString();
        }

        /* -------------------------------------------------------------------------- */
        /* 1. AUTHENTICATION (OTP) */
        /* -------------------------------------------------------------------------- */

        public void sendOtpEmail(String userEmail, String otpCode) {
                String mainContent = "<p style=\"margin-top: 0;\">A login attempt was initiated for your Tinyslash account. Use the following authorization code to complete your login:</p>"
                                +
                                "<div style=\"background-color: #f3f4f6; border-radius: 4px; padding: 24px; text-align: center; margin: 32px 0;\">"
                                +
                                "<span style=\"font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 12px; color: #111827;\">"
                                + otpCode + "</span>" +
                                "</div>" +
                                "<p style=\"margin-bottom: 0;\">This code is valid for 5 minutes. If you did not initiate this request, you may securely ignore this warning.</p>";

                String htmlBody = wrapHtmlBody("Account Authentication", mainContent, "");
                dispatchTransnationalEmail(userEmail, fromAuthEmail, "Authorization Code: " + otpCode, htmlBody);
        }

        /* -------------------------------------------------------------------------- */
        /* 2. COLLABORATION (TEAM INVITES) */
        /* -------------------------------------------------------------------------- */

        public void sendTeamInviteEmail(String toEmail, String teamName, String inviterName, String role,
                        String inviteLink) {
                String mainContent = "<p>You have been invited by <strong>" + inviterName
                                + "</strong> to join the workspace <strong>" + teamName + "</strong> as a <strong>"
                                + role
                                + "</strong>.</p>" +
                                "<p>Tinyslash provides unified link management, routing, and analytics. Access your new workspace by accepting the invitation below.</p>"
                                +
                                "<div style=\"margin: 32px 0;\">" +
                                "<a href=\"" + inviteLink
                                + "\" style=\"background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block;\">Accept Invitation</a>"
                                +
                                "</div>" +
                                "<p style=\"font-size: 13px; color: #6b7280;\">If the button fails, copy and paste this link into your browser:<br>"
                                + inviteLink + "</p>";

                String htmlBody = wrapHtmlBody("Workspace Invitation", mainContent,
                                "Note: This invitation will expire in 7 days.");
                dispatchTransnationalEmail(toEmail, fromNotificationsEmail,
                                "Invitation to join " + teamName + " on Tinyslash",
                                htmlBody);
        }

        /* -------------------------------------------------------------------------- */
        /* 3. BILLING & SUBSCRIPTIONS */
        /* -------------------------------------------------------------------------- */

        public void sendPaymentSuccess(String userEmail, String planName, String amount, String receiptUrl) {
                String mainContent = "<p>We have successfully processed your recent payment for the <strong>" + planName
                                + "</strong>.</p>" +
                                "<p>Your subscription is active and your account limits have been automatically updated. You can view your detailed billing history and download official invoices directly from your workspace settings.</p>"
                                +
                                "<div style=\"margin: 32px 0;\">" +
                                "<a href=\"" + receiptUrl
                                + "\" style=\"color: #2563eb; text-decoration: underline; font-weight: 500;\">View or Download Invoice</a>"
                                +
                                "</div>";

                String htmlBody = wrapHtmlBody("Payment Receipt Scheduled", mainContent, "Amount Processed: " + amount);
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail, "Payment Confirmation: " + planName,
                                htmlBody);
        }

        public void sendPaymentFailed(String userEmail, String planName) {
                String mainContent = "<p>We encountered an error while attempting to process the renewal payment for your <strong>"
                                + planName + "</strong>.</p>" +
                                "<p>Please update your payment method in your billing settings to prevent any interruption in service. We will attempt to process the payment again in 24 hours.</p>"
                                +
                                "<div style=\"margin: 32px 0;\">" +
                                "<a href=\"" + frontendUrl
                                + "/settings/billing\" style=\"background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block;\">Update Billing Detail</a>"
                                +
                                "</div>";

                String htmlBody = wrapHtmlBody("Action Required: Payment Failed", mainContent,
                                "Your routing services may be suspended if payment is not secured.");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Action Required: Payment Processing Failure",
                                htmlBody);
        }

        public void sendSubscriptionCancelled(String userEmail, String planName, String endOfBillingPeriod) {
                String mainContent = "<p>Your subscription to the <strong>" + planName
                                + "</strong> has been successfully cancelled.</p>" +
                                "<p>You will retain access to all plan features until the end of your current billing period on <strong>"
                                + endOfBillingPeriod
                                + "</strong>. Afterward, your account will be reverted to the strictly restricted free tier limitations.</p>";

                String htmlBody = wrapHtmlBody("Subscription Adjusted", mainContent,
                                "If this was an error, you can resume billing from your workspace dashboard.");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail, "Subscription Cancellation Notice",
                                htmlBody);
        }

        public void sendSubscriptionEndingAlert(String userEmail, String planName, String endOfBillingPeriod,
                        int daysRemaining) {
                String urgencyWord = daysRemaining == 1 ? "tomorrow" : "in " + daysRemaining + " days";
                String mainContent = "<p>Your access to the <strong>" + planName + "</strong> expires " + urgencyWord
                                + ".</p>" +
                                "<p>On <strong>" + endOfBillingPeriod
                                + "</strong>, your account will lose access to custom domains, advanced analytics, and priority support. Active links using custom routing may be suspended.</p>"
                                +
                                "<div style=\"margin: 32px 0;\">" +
                                "<a href=\"" + frontendUrl
                                + "/settings/billing\" style=\"background-color: #111827; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 14px; font-weight: 500; display: inline-block;\">Renew Subscription</a>"
                                +
                                "</div>";

                String htmlBody = wrapHtmlBody("Action Required: Subscription Expiring", mainContent,
                                "Avoid service interruption by updating your billing.");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Action Required: " + planName + " Expires " + urgencyWord, htmlBody);
        }

        public void sendSubscriptionRenewingAlert(String userEmail, String planName, String amount, String renewalDate,
                        int daysRemaining) {
                String urgencyWord = daysRemaining == 1 ? "tomorrow" : "in " + daysRemaining + " days";
                String mainContent = "<p>Your <strong>" + planName + "</strong> is scheduled to automatically renew "
                                + urgencyWord + " on <strong>" + renewalDate + "</strong>.</p>" +
                                "<p>Your payment method on file will be charged <strong>" + amount
                                + "</strong>. If you wish to make changes to your plan or cancel your subscription, please do so before the renewal date.</p>"
                                +
                                "<div style=\"margin: 32px 0;\">" +
                                "<a href=\"" + frontendUrl
                                + "/settings/billing\" style=\"color: #2563eb; text-decoration: underline; font-weight: 500;\">Manage Billing Settings</a>"
                                +
                                "</div>";

                String htmlBody = wrapHtmlBody("Upcoming Subscription Renewal", mainContent,
                                "No action is required to maintain service.");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail, "Upcoming Renewal: " + planName,
                                htmlBody);
        }
        /* -------------------------------------------------------------------------- */
        /* 4. DOMAINS & SSL infrastructure */
        /* -------------------------------------------------------------------------- */

        public void sendDomainVerificationSuccess(String userEmail, String domainName) {
                String mainContent = "<p>DNS Verification for <strong>" + domainName
                                + "</strong> has been completed successfully.</p>" +
                                "<p>Our systems have automatically provisioned universal SSL certificates. This custom domain is now fully active across your workspace and is ready to route traffic.</p>";

                String htmlBody = wrapHtmlBody("Domain Infrastructure Operative", mainContent, "");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Infrastructure Status: Domain " + domainName + " Verified", htmlBody);
        }

        public void sendDomainVerificationFailure(String userEmail, String domainName, String error) {
                String mainContent = "<p>Our automated systems failed to verify the DNS configuration for <strong>"
                                + domainName
                                + "</strong>.</p>" +
                                "<p>Diagnostic Error: <code>" + error + "</code></p>" +
                                "<p>Please ensure your registrar holds the correct CNAME propagation:</p>" +
                                "<pre style=\"background-color: #f3f4f6; border-radius: 4px; padding: 16px; font-size: 13px; color: #1f2937;\">"
                                +
                                "Type: CNAME\n" +
                                "Name: " + domainName + "\n" +
                                "Value: tinyslash.com" +
                                "</pre>" +
                                "<p>DNS propagation relies on global infrastructure limits and may take up to 48 hours in rare cases.</p>";

                String htmlBody = wrapHtmlBody("Action Required: Domain Configuration Failed", mainContent,
                                "Traffic masking will remain disabled until verification succeeds.");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Action Required: Domain Verification Failure for " + domainName, htmlBody);
        }

        public void sendDomainMisconfiguredNotification(String userEmail, String domainName) {
                String mainContent = "<p>Our infrastructure monitors detected a configuration fault with <strong>"
                                + domainName
                                + "</strong>.</p>" +
                                "<p>The required CNAME records routing to Tinyslash have been removed or altered at your registrar. If this was intentional, no action is required. Otherwise, link routing for this domain is currently suspended.</p>";

                String htmlBody = wrapHtmlBody("Routing Notification", mainContent,
                                "Restore CNAME values to port traffic back to Tinyslash network.");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Routing Warning: " + domainName + " Configuration Dropped", htmlBody);
        }

        public void sendSslRenewalFailureAlert(String userEmail, String domainName) {
                String mainContent = "<p>Automated certificate renewal failed for the domain <strong>" + domainName
                                + "</strong>.</p>" +
                                "<p>This typically indicates the domain is no longer directly pointing to our ingress servers. Without intervention, HTTPS negotiations for your routed links may soon trigger browser security warnings.</p>";

                String htmlBody = wrapHtmlBody("Certificate Authority Warning", mainContent, "");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Action Requested: SSL Certificate Renewal Failure", htmlBody);
        }

        public void sendDomainTransferNotification(String userEmail, String domainName, String reason) {
                String mainContent = "<p>Traffic authority for <strong>" + domainName
                                + "</strong> has been permanently transferred.</p>" +
                                "<p>System Registration Trigger: <code>" + reason + "</code></p>";

                String htmlBody = wrapHtmlBody("Infrastructure Modification", mainContent, "");
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Domain Transfer System Alert: " + domainName,
                                htmlBody);
        }

        /* -------------------------------------------------------------------------- */
        /* 5. SUPPORT (TICKETS) */
        /* -------------------------------------------------------------------------- */

        public void sendTicketCreatedEmail(String userEmail, String userName, String ticketId, String subject) {
                String shortenedId = ticketId.length() >= 6 ? ticketId.substring(ticketId.length() - 6) : ticketId;
                String mainContent = "<p>Hello " + userName + ",</p>" +
                                "<p>We have received your support request regarding <strong>" + subject
                                + "</strong>.</p>" +
                                "<p>Our engineering and support operations team will review the details you provided. Status updates will be communicated directly to this address or accessible via your administrative dashboard.</p>";

                String subText = "Ticket Allocation ID: #" + shortenedId + " | Status: Open";
                String htmlBody = wrapHtmlBody("Support Request Registered", mainContent, subText);
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Request Received: [#" + shortenedId + "] " + subject, htmlBody);
        }

        public void sendAgentResponseEmail(String userEmail, String userName, String ticketId, String ticketSubject,
                        String responseMessage) {
                String shortenedId = ticketId.length() >= 6 ? ticketId.substring(ticketId.length() - 6) : ticketId;
                String mainContent = "<p>Hello " + userName + ",</p>" +
                                "<p>An agent from our operations team has updated your ticket:</p>" +
                                "<div style=\"border-left: 3px solid #d1d5db; padding-left: 16px; margin: 24px 0; color: #374151;\">"
                                +
                                responseMessage.replace("\n", "<br>") +
                                "</div>" +
                                "<p>You can reply directly to this notification block via your dashboard to append diagnostic logs or further questions.</p>";

                String subText = "Reference Ticket ID: #" + shortenedId;
                String htmlBody = wrapHtmlBody("Case Update: " + ticketSubject, mainContent, subText);
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Case Update [#" + shortenedId + "]: " + ticketSubject, htmlBody);
        }

        public void sendTicketResolvedEmail(String userEmail, String userName, String ticketId, String subject) {
                String shortenedId = ticketId.length() >= 6 ? ticketId.substring(ticketId.length() - 6) : ticketId;
                String mainContent = "<p>Hello " + userName + ",</p>" +
                                "<p>The support case <strong>" + subject
                                + "</strong> has been marked as completely resolved by our infrastructure team.</p>" +
                                "<p>If you believe this issue was closed prematurely, access your dashboard to reopen the file and re-flag for queue review.</p>";

                String htmlBody = wrapHtmlBody("Case Resolved", mainContent, "Reference Ticket ID: #" + shortenedId);
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Resolved [#" + shortenedId + "]: " + subject,
                                htmlBody);
        }

        public void sendNewTicketNotificationToSupport(SupportTicket ticket) {
                String shortenedId = ticket.getId().length() >= 6
                                ? ticket.getId().substring(ticket.getId().length() - 6)
                                : ticket.getId();
                String mainContent = "<p>A new engineering or support flag has breached queues.</p>" +
                                "<pre style=\"background-color: #f3f4f6; border-radius: 4px; padding: 16px; font-size: 13px; color: #1f2937;\">"
                                +
                                "User: " + ticket.getUserEmail() + "\n" +
                                "Subject: " + ticket.getSubject() + "\n" +
                                "Category: " + ticket.getCategory().getDisplayName() + "\n" +
                                "Priority: " + ticket.getPriority().getDisplayName() + "\n" +
                                "Page Trace: " + ticket.getCurrentPage() + "\n" +
                                "</pre>" +
                                "<p><strong>Payload:</strong><br>" + ticket.getMessage().replace("\n", "<br>") + "</p>";

                String htmlBody = wrapHtmlBody("ESCALATION ALERT", mainContent, "Trace ID: " + shortenedId);
                dispatchTransnationalEmail(supportEmail, fromNotificationsEmail,
                                "ESCALATION [" + ticket.getPriority().getDisplayName() + "]: " + ticket.getSubject(),
                                htmlBody);
        }

        public void sendUserResponseNotificationToAgent(SupportTicket ticket, SupportResponse response) {
                String shortenedId = ticket.getId().length() >= 6
                                ? ticket.getId().substring(ticket.getId().length() - 6)
                                : ticket.getId();
                String mainContent = "<p>User " + ticket.getUserEmail() + " appended logs/text to open case data.</p>" +
                                "<div style=\"border-left: 3px solid #d1d5db; padding-left: 16px; margin: 24px 0;\">" +
                                response.getMessage().replace("\n", "<br>") +
                                "</div>";

                String htmlBody = wrapHtmlBody("Append Modification", mainContent, "Trace ID: " + shortenedId);
                dispatchTransnationalEmail(supportEmail, fromNotificationsEmail,
                                "UPDATE [#" + shortenedId + "]: " + ticket.getSubject(), htmlBody);
        }

        public void sendWelcomeEmail(String toEmail, String name) {
                String subject = "Welcome to Tinyslash!";
                String headerText = "Welcome to Tinyslash";

                String mainContent = "<p style=\"margin-top: 0; margin-bottom: 24px;\">Hi " + (name != null ? name : "")
                                + ",</p>"
                                + "<p style=\"margin-top: 0; margin-bottom: 24px;\">We're thrilled to have you here at Tinyslash! Our platform gives you the power to manage your brand links efficiently with state-of-the-art tools and analytics.</p>"
                                + "<p style=\"margin-top: 0; margin-bottom: 24px;\">To get started, simply log in and explore your dashboard. We recommend setting up your workspace and exploring our features.</p>"
                                + "<a href=\"" + frontendUrl
                                + "/dashboard\" style=\"display: inline-block; padding: 12px 24px; background-color: #000000; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;\">Go to Dashboard</a>";

                String subText = "If you have any questions or need assistance, simply reply to this email. We're here to help.";

                String htmlBody = wrapHtmlBody(headerText, mainContent, subText);

                // Use the auth email address for welcome emails directly
                dispatchTransnationalEmail(toEmail, fromAuthEmail, subject, htmlBody);
        }

        public void sendHtmlEmail(String toEmail, String subject, String plainTextBody, String htmlBody) {
                String wrappedBody = wrapHtmlBody(subject, htmlBody, "");
                dispatchTransnationalEmail(toEmail, fromNotificationsEmail, subject, wrappedBody);
        }

        /* -------------------------------------------------------------------------- */
        /* 6. CREATOR COMMERCE (Booking & Orders) */
        /* -------------------------------------------------------------------------- */

        public void sendOrderConfirmation(String userEmail, CustomerOrder order) {
                String mainContent = "<p>Attached is the official fulfillment receipt for your order ID <strong>"
                                + order.getId() + "</strong>.</p>" +
                                "<p>The requested digital payload or service directive is being processed by the system.</p>"
                                +
                                "<div style=\"background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px; margin: 24px 0;\">"
                                +
                                "<p style=\"margin: 0 0 12px 0;\"><strong>Amount Authorized:</strong> "
                                + order.getAmount() + " "
                                + order.getCurrency() + "</p>" +
                                "<p style=\"margin: 0; color: #6b7280;\">The charges will appear on your statement as TINYSLASH_COMMERCE.</p>"
                                +
                                "</div>";

                String htmlBody = wrapHtmlBody("Fulfillment Receipt Initiated", mainContent,
                                "Order ID: " + order.getId());
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail, "Order Confirmation: " + order.getId(),
                                htmlBody);
        }

        public void sendBookingConfirmation(String userEmail, Booking booking) {
                String mainContent = "<p>An allocation block has been successfully scheduled.</p>" +
                                "<div style=\"background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 24px; margin: 24px 0;\">"
                                +
                                "<p style=\"margin: 0 0 12px 0;\"><strong>Date:</strong> " + booking.getBookingDate()
                                + "</p>" +
                                "<p style=\"margin: 0 0 12px 0;\"><strong>Time block (UTC):</strong> "
                                + booking.getBookingStartUtc().toString() + " - "
                                + booking.getBookingEndUtc().toString() + "</p>" +
                                "<p style=\"margin: 0;\"><strong>Conferencing:</strong> Included link will be distributed via ICS protocol.</p>"
                                +
                                "</div>" +
                                "<p>Standard cancellation SLA policies apply to this calendar block.</p>";

                String htmlBody = wrapHtmlBody("Time Allocation Granted", mainContent,
                                "Booking Reference: " + booking.getId());
                dispatchTransnationalEmail(userEmail, fromNotificationsEmail,
                                "Meeting Schedule Guaranteed - " + booking.getBookingDate(), htmlBody);
        }
}