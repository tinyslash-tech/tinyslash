package com.urlshortener.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.urlshortener.model.SupportTicket;
import com.urlshortener.model.SupportResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private SendGrid sendGrid;

    @Value("${app.frontend.url:https://tinyslash.com}")
    private String frontendUrl;

    @Value("${app.support.email:support@pebly.com}")
    private String supportEmail;

    @Value("${sendgrid.api.key:}")
    private String sendGridApiKey;

    @Value("${sendgrid.from.email:noreply@pebly.com}")
    private String fromEmail;

    @Value("${sendgrid.from.name:Pebly Team}")
    private String fromName;

    /**
     * Send ticket created confirmation email to user
     */
    public void sendTicketCreatedEmail(String userEmail, String userName, String ticketId, String subject) {
        try {
            String emailSubject = "Support Ticket Created - #" + ticketId.substring(ticketId.length() - 6);
            String emailBody = buildTicketCreatedEmailBody(userName, ticketId, subject);

            // TODO: Implement actual email sending (SMTP, SendGrid, etc.)
            logger.info("Sending ticket created email to {} for ticket {}", userEmail, ticketId);

            // For now, just log the email content
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send ticket created email to {}", userEmail, e);
        }
    }

    /**
     * Send agent response email to user
     */
    public void sendAgentResponseEmail(String userEmail, String userName, String ticketId,
            String ticketSubject, String responseMessage) {
        try {
            String emailSubject = "New Response to Your Support Ticket - #" + ticketId.substring(ticketId.length() - 6);
            String emailBody = buildAgentResponseEmailBody(userName, ticketId, ticketSubject, responseMessage);

            logger.info("Sending agent response email to {} for ticket {}", userEmail, ticketId);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send agent response email to {}", userEmail, e);
        }
    }

    /**
     * Send ticket resolved email to user
     */
    public void sendTicketResolvedEmail(String userEmail, String userName, String ticketId, String subject) {
        try {
            String emailSubject = "Support Ticket Resolved - #" + ticketId.substring(ticketId.length() - 6);
            String emailBody = buildTicketResolvedEmailBody(userName, ticketId, subject);

            logger.info("Sending ticket resolved email to {} for ticket {}", userEmail, ticketId);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send ticket resolved email to {}", userEmail, e);
        }
    }

    /**
     * Generic method to send email with subject and body
     */
    public void sendEmail(String toEmail, String subject, String body) {
        try {
            logger.info("Attempting to send email to {} with subject: {}", toEmail, subject);

            // Check if SendGrid is properly configured
            if (!StringUtils.hasText(sendGridApiKey) || "mock-api-key".equals(sendGridApiKey)) {
                logger.warn("SendGrid API key not configured. Email will be logged instead of sent.");
                logger.info("EMAIL CONTENT - To: {}, Subject: {}", toEmail, subject);
                logger.info("EMAIL BODY: {}", body);
                return;
            }

            // Create SendGrid email
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content content = new Content("text/plain", body);
            Mail mail = new Mail(from, subject, to, content);

            // Send email via SendGrid
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                logger.info("✅ Email sent successfully to {} (Status: {})", toEmail, response.getStatusCode());
            } else {
                logger.error("❌ Failed to send email to {}. Status: {}, Body: {}",
                        toEmail, response.getStatusCode(), response.getBody());
            }

        } catch (IOException e) {
            logger.error("❌ SendGrid API error when sending email to {}: {}", toEmail, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("❌ Unexpected error when sending email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    /**
     * Send HTML email with both plain text and HTML content
     */
    public void sendHtmlEmail(String toEmail, String subject, String plainTextBody, String htmlBody) {
        try {
            logger.info("Attempting to send HTML email to {} with subject: {}", toEmail, subject);

            // Check if SendGrid is properly configured
            if (!StringUtils.hasText(sendGridApiKey) || "mock-api-key".equals(sendGridApiKey)) {
                logger.warn("SendGrid API key not configured. Email will be logged instead of sent.");
                logger.info("HTML EMAIL CONTENT - To: {}, Subject: {}", toEmail, subject);
                logger.info("HTML EMAIL BODY: {}", htmlBody);
                return;
            }

            // Create SendGrid email with HTML content
            Email from = new Email(fromEmail, fromName);
            Email to = new Email(toEmail);
            Content plainContent = new Content("text/plain", plainTextBody);
            Content htmlContent = new Content("text/html", htmlBody);

            Mail mail = new Mail(from, subject, to, plainContent);
            mail.addContent(htmlContent);

            // Send email via SendGrid
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                logger.info("✅ HTML email sent successfully to {} (Status: {})", toEmail, response.getStatusCode());
            } else {
                logger.error("❌ Failed to send HTML email to {}. Status: {}, Body: {}",
                        toEmail, response.getStatusCode(), response.getBody());
            }

        } catch (IOException e) {
            logger.error("❌ SendGrid API error when sending HTML email to {}: {}", toEmail, e.getMessage(), e);
        } catch (Exception e) {
            logger.error("❌ Unexpected error when sending HTML email to {}: {}", toEmail, e.getMessage(), e);
        }
    }

    /**
     * Send new ticket notification to support team
     */
    public void sendNewTicketNotificationToSupport(SupportTicket ticket) {
        try {
            String emailSubject = String.format("[%s] New %s Support Ticket - #%s",
                    ticket.getPriority().getDisplayName(),
                    ticket.getCategory().getDisplayName(),
                    ticket.getId().substring(ticket.getId().length() - 6));

            String emailBody = buildSupportTeamNotificationBody(ticket);

            logger.info("Sending new ticket notification to support team for ticket {}", ticket.getId());
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send new ticket notification to support team", e);
        }
    }

    /**
     * Send user response notification to assigned agent
     */
    public void sendUserResponseNotificationToAgent(SupportTicket ticket, SupportResponse response) {
        try {
            String emailSubject = String.format("User Response - Ticket #%s",
                    ticket.getId().substring(ticket.getId().length() - 6));

            String emailBody = buildAgentNotificationBody(ticket, response);

            logger.info("Sending user response notification to agent {} for ticket {}",
                    ticket.getAssignedAgent(), ticket.getId());
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send user response notification to agent", e);
        }
    }

    /**
     * Build ticket created email body
     */
    private String buildTicketCreatedEmailBody(String userName, String ticketId, String subject) {
        return String.format(
                """
                        Hi %s,

                        Thank you for contacting Pebly Support! We've received your support request and our team will get back to you soon.

                        Ticket Details:
                        • Ticket ID: #%s
                        • Subject: %s
                        • Status: Open

                        What happens next?
                        • Our support team will review your request
                        • You'll receive updates via email
                        • You can track your ticket status in your dashboard

                        Need urgent help?
                        • For payment issues, include your transaction ID
                        • For technical problems, provide steps to reproduce the issue
                        • For account issues, verify your email address

                        View your ticket: %s/dashboard

                        Best regards,
                        Pebly Support Team

                        ---
                        This is an automated message. Please do not reply to this email.
                        For immediate assistance, visit: %s/contact
                        """,
                userName,
                ticketId.substring(ticketId.length() - 6),
                subject,
                frontendUrl,
                frontendUrl);
    }

    /**
     * Build agent response email body
     */
    private String buildAgentResponseEmailBody(String userName, String ticketId,
            String ticketSubject, String responseMessage) {
        return String.format("""
                Hi %s,

                You have a new response from our support team regarding your ticket.

                Ticket Details:
                • Ticket ID: #%s
                • Subject: %s

                Support Team Response:
                %s

                Next Steps:
                • Reply to continue the conversation
                • View full conversation in your dashboard
                • Mark as resolved if your issue is fixed

                View your ticket: %s/dashboard

                Best regards,
                Pebly Support Team

                ---
                This is an automated message. Please do not reply to this email.
                For immediate assistance, visit: %s/contact
                """,
                userName,
                ticketId.substring(ticketId.length() - 6),
                ticketSubject,
                responseMessage,
                frontendUrl,
                frontendUrl);
    }

    /**
     * Build ticket resolved email body
     */
    private String buildTicketResolvedEmailBody(String userName, String ticketId, String subject) {
        return String.format("""
                Hi %s,

                Great news! Your support ticket has been resolved.

                Ticket Details:
                • Ticket ID: #%s
                • Subject: %s
                • Status: Resolved

                Was this helpful?
                We'd love to hear your feedback about our support experience.

                Still need help?
                If your issue isn't fully resolved, you can reopen this ticket or create a new one.

                View your ticket: %s/dashboard

                Thank you for using Pebly!

                Best regards,
                Pebly Support Team

                ---
                This is an automated message. Please do not reply to this email.
                For immediate assistance, visit: %s/contact
                """,
                userName,
                ticketId.substring(ticketId.length() - 6),
                subject,
                frontendUrl,
                frontendUrl);
    }

    /**
     * Build support team notification body
     */
    private String buildSupportTeamNotificationBody(SupportTicket ticket) {
        return String.format("""
                New Support Ticket Received

                Ticket Details:
                • ID: #%s
                • Category: %s
                • Priority: %s
                • Status: %s
                • User: %s (%s)
                • Created: %s

                Subject: %s

                Message:
                %s

                User Information:
                • Email: %s
                • User Agent: %s
                • IP Address: %s
                • Current Page: %s

                Actions Required:
                • Review and assign ticket
                • Respond within SLA timeframe
                • Update ticket status

                View ticket in admin panel: %s/admin/tickets/%s
                """,
                ticket.getId().substring(ticket.getId().length() - 6),
                ticket.getCategory().getDisplayName(),
                ticket.getPriority().getDisplayName(),
                ticket.getStatus().getDisplayName(),
                ticket.getUserName(),
                ticket.getUserEmail(),
                ticket.getCreatedAt(),
                ticket.getSubject(),
                ticket.getMessage(),
                ticket.getUserEmail(),
                ticket.getUserAgent(),
                ticket.getIpAddress(),
                ticket.getCurrentPage(),
                frontendUrl,
                ticket.getId());
    }

    /**
     * Build agent notification body
     */
    private String buildAgentNotificationBody(SupportTicket ticket, SupportResponse response) {
        return String.format("""
                User Response Received

                Ticket Details:
                • ID: #%s
                • Subject: %s
                • User: %s (%s)
                • Priority: %s

                User Response:
                %s

                Response Time: %s

                Actions Required:
                • Review user response
                • Provide assistance
                • Update ticket status if resolved

                View ticket: %s/admin/tickets/%s
                """,
                ticket.getId().substring(ticket.getId().length() - 6),
                ticket.getSubject(),
                ticket.getUserName(),
                ticket.getUserEmail(),
                ticket.getPriority().getDisplayName(),
                response.getMessage(),
                response.getTimestamp(),
                frontendUrl,
                ticket.getId());
    }

    /**
     * Send domain transfer notification email
     */
    public void sendDomainTransferNotification(String userEmail, String domainName, String reason) {
        try {
            String emailSubject = "Domain Transfer Notification - " + domainName;
            String emailBody = buildDomainTransferEmailBody(domainName, reason);

            logger.info("Sending domain transfer notification to {} for domain {}", userEmail, domainName);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send domain transfer notification to {}", userEmail, e);
        }
    }

    /**
     * Send One-Time Password (OTP)
     */
    public void sendOtpEmail(String userEmail, String otpCode) {
        try {
            String emailSubject = "Your Login Code: " + otpCode;

            String plainTextBody = "Hello,\n\n" +
                    "Your secure login code is: " + otpCode + "\n\n" +
                    "This code will expire in 5 minutes.\n\n" +
                    "If you did not request this code, you can safely ignore this email.";

            String htmlBody = "<div style=\"font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;\">"
                    +
                    "<div style=\"text-align: center; margin-bottom: 30px;\">" +
                    "<h1 style=\"color: #111827; font-size: 24px; font-weight: 700; margin: 0;\">Login securely to Tinyslash</h1>"
                    +
                    "</div>" +
                    "<div style=\"background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center; margin-bottom: 30px;\">"
                    +
                    "<p style=\"color: #4b5563; font-size: 16px; margin-top: 0; margin-bottom: 24px;\">Use the following code to sign in to your account. This code is valid for <strong>5 minutes</strong>.</p>"
                    +
                    "<div style=\"background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 8px; padding: 16px; display: inline-block;\">"
                    +
                    "<span style=\"font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #111827;\">" + otpCode
                    + "</span>" +
                    "</div>" +
                    "</div>" +
                    "<div style=\"text-align: center;\">" +
                    "<p style=\"color: #6b7280; font-size: 14px; margin: 0;\">If you didn't attempt to log in, you can safely ignore this email.</p>"
                    +
                    "<p style=\"color: #9ca3af; font-size: 12px; margin-top: 20px;\">© "
                    + java.time.Year.now().getValue() + " Tinyslash. All rights reserved.</p>" +
                    "</div>" +
                    "</div>";

            logger.info("Sending OTP email to {}", userEmail);

            // Call existing unified HTML sender
            sendHtmlEmail(userEmail, emailSubject, plainTextBody, htmlBody);

        } catch (Exception e) {
            logger.error("Failed to send OTP email to {}", userEmail, e);
            throw new RuntimeException("Failed to send login code");
        }
    }

    /**
     * Send domain verification success email
     */
    public void sendDomainVerificationSuccess(String userEmail, String domainName) {
        try {
            String emailSubject = "Domain Verified Successfully - " + domainName;
            String emailBody = buildDomainVerificationSuccessEmailBody(domainName);

            logger.info("Sending domain verification success email to {} for domain {}", userEmail, domainName);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send domain verification success email to {}", userEmail, e);
        }
    }

    /**
     * Send domain verification failure email
     */
    public void sendDomainVerificationFailure(String userEmail, String domainName, String error) {
        try {
            String emailSubject = "Domain Verification Failed - " + domainName;
            String emailBody = buildDomainVerificationFailureEmailBody(domainName, error);

            logger.info("Sending domain verification failure email to {} for domain {}", userEmail, domainName);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send domain verification failure email to {}", userEmail, e);
        }
    }

    /**
     * Send SSL certificate renewal failure alert
     */
    public void sendSslRenewalFailureAlert(String userEmail, String domainName) {
        try {
            String emailSubject = "SSL Certificate Renewal Failed - " + domainName;
            String emailBody = buildSslRenewalFailureEmailBody(domainName);

            logger.info("Sending SSL renewal failure alert to {} for domain {}", userEmail, domainName);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

        } catch (Exception e) {
            logger.error("Failed to send SSL renewal failure alert to {}", userEmail, e);
        }
    }

    // Private helper methods for building email bodies

    private String buildDomainTransferEmailBody(String domainName, String reason) {
        return String.format("""
                Hello,

                Your custom domain %s has been successfully transferred.

                Transfer Reason: %s
                Transfer Date: %s

                If you have any questions about this transfer, please contact our support team.

                Best regards,
                The Pebly Team
                """, domainName, reason, java.time.LocalDateTime.now().toString());
    }

    private String buildDomainVerificationSuccessEmailBody(String domainName) {
        return String.format("""
                Congratulations!

                Your custom domain %s has been successfully verified and is now active.

                ✅ Domain verified
                🔒 SSL certificate provisioned
                🚀 Ready to use for short links

                You can now create short links using your custom domain in the Advanced Settings.

                Best regards,
                The Pebly Team
                """, domainName);
    }

    private String buildDomainVerificationFailureEmailBody(String domainName, String error) {
        return String.format("""
                Domain Verification Update

                We were unable to verify your custom domain %s.

                Error: %s

                Please check your DNS configuration and ensure the CNAME record is correctly set up:

                Type: CNAME
                Name: %s
                Value: tinyslash.com

                Once you've updated your DNS settings, you can retry verification in your dashboard.

                Need help? Contact our support team.

                Best regards,
                The Pebly Team
                """, domainName, error, domainName);
    }

    private String buildSslRenewalFailureEmailBody(String domainName) {
        return String.format(
                """
                        SSL Certificate Renewal Alert

                        We were unable to renew the SSL certificate for your custom domain %s.

                        Your domain will continue to work, but the SSL certificate may expire soon.

                        We will continue attempting to renew the certificate automatically. If the issue persists, please contact our support team.

                        Best regards,
                        The Pebly Team
                        """,
                domainName);
    }

    /**
     * Send domain misconfigured notification
     */
    public void sendDomainMisconfiguredNotification(String userEmail, String domainName) {
        try {
            String emailSubject = "Action Required: Domain Misconfigured - " + domainName;
            String emailBody = buildDomainMisconfiguredEmailBody(domainName);

            logger.info("Sending domain misconfigured email to {} for domain {}", userEmail, domainName);
            logger.debug("Email Subject: {}", emailSubject);
            logger.debug("Email Body: {}", emailBody);

            // Send logic calling sendEmail (internally handles mock/sendgrid)
            sendEmail(userEmail, emailSubject, emailBody);

        } catch (Exception e) {
            logger.error("Failed to send domain misconfigured email to {}", userEmail, e);
        }
    }

    private String buildDomainMisconfiguredEmailBody(String domainName) {
        return String.format("""
                Domain Configuration Alert

                We detected that your custom domain %s is no longer pointing correctly to our servers.

                This may happen if DNS records were changed or removed.

                Please check your DNS configuration:
                Type: CNAME
                Name: %s
                Value: tinyslash.com

                If this was intentional, you can ignore this email.
                Otherwise, please fix your DNS settings to restore service.

                Best regards,
                The Pebly Team
                """, domainName, domainName);
    }
}