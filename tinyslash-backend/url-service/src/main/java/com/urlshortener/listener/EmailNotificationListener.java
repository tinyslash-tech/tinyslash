package com.urlshortener.listener;

import com.urlshortener.event.BookingConfirmedEvent;
import com.urlshortener.event.LeadCapturedEvent;
import com.urlshortener.event.OrderCompletedEvent;
import com.urlshortener.event.UserRegisteredEvent;
import com.urlshortener.model.Booking;
import com.urlshortener.model.CustomerOrder;
import com.urlshortener.model.User;
import com.urlshortener.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationListener {

  private static final Logger logger = LoggerFactory.getLogger(EmailNotificationListener.class);

  @Autowired
  private EmailService emailService;

  @Value("${app.frontend.url:https://tinyslash.com}")
  private String frontendUrl;

  /**
   * Handles Lead Captured Event asynchronously
   */
  @Async
  @EventListener
  public void handleLeadCapturedEvent(LeadCapturedEvent event) {
    logger.info("Received LeadCapturedEvent for page: {}, email: {}", event.getPageId(), event.getEmail());

    // In a real scenario, you'd look up the owner's email address using
    // event.getOwnerId()
    // and send them an email that a new lead was captured.
    // For now, this is a placeholder showing the async capability.

    try {
      // example logic:
      // User owner = userRepository.findById(event.getOwnerId()).orElseThrow(...);
      // String subject = "New Lead Captured!";
      // String body = "A new lead named " + event.getName() + " has contacted you.";
      // emailService.sendEmail(owner.getEmail(), subject, body);
      logger.debug("Lead email processing completed for: {}", event.getEmail());
    } catch (Exception e) {
      logger.error("Failed to process LeadCapturedEvent email", e);
    }
  }

  /**
   * Handles Order Completed Event asynchronously
   */
  @Async
  @EventListener
  public void handleOrderCompletedEvent(OrderCompletedEvent event) {
    CustomerOrder order = event.getOrder();
    logger.info("Received OrderCompletedEvent for order: {}, monetizationType: {}",
        order.getId(), order.getMonetizationType());

    try {
      if ("DIGITAL_PRODUCT".equals(order.getMonetizationType())) {
        String subject = "Your Digital Product Purchase Receipt";
        String body = buildDigitalProductEmail(order);
        emailService.sendHtmlEmail(order.getCustomerEmail(), subject, "Your purchase is ready.", body);
        logger.info("Sent digital product delivery email to {}", order.getCustomerEmail());
      } else if ("SERVICE_ASYNC".equals(order.getMonetizationType())) {
        String subject = "Order Confirmation: Service Request";
        String body = buildAsyncServiceEmail(order);
        emailService.sendHtmlEmail(order.getCustomerEmail(), subject, "Your request has been received.", body);
        logger.info("Sent async service confirmation email to {}", order.getCustomerEmail());
      }
    } catch (Exception e) {
      logger.error("Failed to send OrderCompletedEvent email for order {}", order.getId(), e);
    }
  }

  /**
   * Handles Booking Confirmed Event asynchronously
   */
  @Async
  @EventListener
  public void handleBookingConfirmedEvent(BookingConfirmedEvent event) {
    Booking booking = event.getBooking();
    logger.info("Received BookingConfirmedEvent for booking: {}", booking.getId());

    try {
      String subject = "Booking Confirmed - " + booking.getBookingDate();
      String body = buildBookingConfirmationEmail(booking);
      emailService.sendHtmlEmail(booking.getCustomerEmail(), subject, "Your booking is confirmed.", body);
      logger.info("Sent booking confirmation email to {}", booking.getCustomerEmail());
    } catch (Exception e) {
      logger.error("Failed to send BookingConfirmedEvent email for booking {}", booking.getId(), e);
    }
  }

  /**
   * Handles User Registered Event asynchronously
   */
  @Async
  @EventListener
  public void handleUserRegisteredEvent(UserRegisteredEvent event) {
    User user = event.getUser();
    logger.info("Received UserRegisteredEvent for user: {}", user.getEmail());

    try {
      String subject = "Welcome to TinySlash!";
      String body = buildWelcomeEmail(user);
      emailService.sendHtmlEmail(user.getEmail(), subject, "Welcome to the platform.", body);
      logger.info("Sent welcome email to {}", user.getEmail());
    } catch (Exception e) {
      logger.error("Failed to send UserRegisteredEvent welcome email to {}", user.getEmail(), e);
    }
  }

  // --- Private Email Builder Helpers ---

  private String buildDigitalProductEmail(CustomerOrder order) {
    return String.format(
        """
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Thank you for your purchase!</h2>
                <p>Hi %s,</p>
                <p>Your order for the digital product has been successfully processed.</p>
                <p><strong>Order ID:</strong> %s</p>
                <p><strong>Amount Paid:</strong> ₹%.2f</p>

                <div style="margin: 30px 0;">
                    <!-- Note: Real implementation would include the pre-signed download file URL -->
                    <a href="#" style="background: #2563EB; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Your Product</a>
                </div>

                <p>If you have any questions, please reply to this email.</p>
                <p>Best regards,<br/>The TinySlash Team</p>
            </div>
            """,
        order.getCustomerName() != null ? order.getCustomerName() : "Customer",
        order.getId(),
        order.getAmount() / 100.0);
  }

  private String buildAsyncServiceEmail(CustomerOrder order) {
    return String.format("""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Your Request has been Received!</h2>
            <p>Hi %s,</p>
            <p>We've received your service request and payment.</p>
            <p><strong>Order ID:</strong> %s</p>
            <p><strong>Amount Paid:</strong> ₹%.2f</p>
            <p>The creator has been notified and will begin working on your request shortly.</p>
            <p>If you have any questions, please reply to this email.</p>
            <p>Best regards,<br/>The TinySlash Team</p>
        </div>
        """,
        order.getCustomerName() != null ? order.getCustomerName() : "Customer",
        order.getId(),
        order.getAmount() / 100.0);
  }

  private String buildBookingConfirmationEmail(Booking booking) {
    // Formats time manually or expects them to be passed effectively
    return String.format("""
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Booking Confirmed! ✅</h2>
            <p>Hi %s,</p>
            <p>Your upcoming session is locked in.</p>

            <div style="background: #F3F4F6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Date:</strong> %s</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> %s - %s</p>
            </div>

            <p>A calendar invitation has been sent separately. Keep an eye out for any meeting links.</p>

            <p>Best regards,<br/>The TinySlash Team</p>
        </div>
        """,
        booking.getCustomerName() != null ? booking.getCustomerName() : "Customer",
        booking.getBookingDate(),
        booking.getBookingStartUtc() != null ? booking.getBookingStartUtc().toString() : "TBD",
        booking.getBookingEndUtc() != null ? booking.getBookingEndUtc().toString() : "TBD");
  }

  private String buildWelcomeEmail(User user) {
    return String.format(
        """
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to TinySlash! \uD83D\uDE80</h2>
                <p>Hi %s,</p>
                <p>We're thrilled to have you onboard.</p>
                <p>With TinySlash, you can easily build mini-portfolios, connect your custom domains, and monetize your digital skills directly through our platform.</p>

                <div style="margin: 30px 0;">
                    <a href="%s/dashboard" style="background: #2563EB; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Go to Dashboard</a>
                </div>

                <p>If you ever need help, our support team is just a click away.</p>
                <p>Best regards,<br/>The TinySlash Team</p>
            </div>
            """,
        user.getFirstName() != null ? user.getFirstName() : "there",
        frontendUrl);
  }
}
