package com.urlshortener.controller;

import com.urlshortener.model.CustomerOrder;
import com.urlshortener.model.User;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.service.MonetizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/monetization")
@CrossOrigin(origins = "*")
public class MonetizationController {

  @Autowired
  private MonetizationService monetizationService;

  @Autowired
  private UserRepository userRepository;

  @PostMapping("/create-order")
  public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
    Map<String, Object> response = new HashMap<>();
    try {
      String pageId = (String) request.get("pageId");
      String blockId = (String) request.get("blockId");
      String customerEmail = (String) request.get("customerEmail");
      String customerName = (String) request.get("customerName");

      String bookingDate = (String) request.get("bookingDate");
      String bookingStartUtcStr = (String) request.get("bookingStartUtc");
      String bookingEndUtcStr = (String) request.get("bookingEndUtc");

      @SuppressWarnings("unchecked")
      Map<String, String> answers = (Map<String, String>) request.get("answers");

      if (pageId == null || blockId == null || customerEmail == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing required fields"));
      }

      CustomerOrder order = monetizationService.createCheckoutOrder(pageId, blockId, customerEmail, customerName,
          answers, bookingDate, bookingStartUtcStr, bookingEndUtcStr);

      response.put("success", true);
      response.put("orderId", order.getRazorpayOrderId());
      response.put("amount", order.getAmount());
      response.put("currency", order.getCurrency());

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @PostMapping("/verify-payment")
  public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> request) {
    Map<String, Object> response = new HashMap<>();
    try {
      String razorpayOrderId = (String) request.get("razorpay_order_id");
      String razorpayPaymentId = (String) request.get("razorpay_payment_id");
      String razorpaySignature = (String) request.get("razorpay_signature");

      if (razorpayOrderId == null || razorpayPaymentId == null || razorpaySignature == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing verification parameters"));
      }

      CustomerOrder order = monetizationService.verifyCheckoutPayment(razorpayOrderId, razorpayPaymentId,
          razorpaySignature);

      response.put("success", true);
      response.put("message", "Payment verified securely.");

      // Send back fulfillment details based on type
      Map<String, Object> fulfillment = new HashMap<>();
      fulfillment.put("monetizationType", order.getMonetizationType());
      // TODO: Here we would fetch the actual Block content again to return the
      // calendarUrl or fileKey
      // For MVP we will let the frontend refetch or do it next.
      response.put("fulfillment", fulfillment);

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }

  @PostMapping("/connect-razorpay")
  public ResponseEntity<Map<String, Object>> connectRazorpay(@RequestBody Map<String, Object> request) {
    Map<String, Object> response = new HashMap<>();
    try {
      String userId = (String) request.get("userId");
      String razorpayAccountId = (String) request.get("razorpayAccountId");

      if (userId == null || razorpayAccountId == null || razorpayAccountId.trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Valid Account ID is required"));
      }

      Optional<User> userOpt = userRepository.findById(userId);
      if (userOpt.isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not found"));
      }

      User user = userOpt.get();
      // Prefix validation logic could go here (e.g., must start with acc_)
      if (!razorpayAccountId.startsWith("acc_")) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Account ID must start with acc_"));
      }

      user.setRazorpayAccountId(razorpayAccountId);
      user.setRazorpayConnected(true);
      userRepository.save(user);

      response.put("success", true);
      response.put("message", "Razorpay Account successfully connected!");
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to connect: " + e.getMessage());
      return ResponseEntity.badRequest().body(response);
    }
  }
}
