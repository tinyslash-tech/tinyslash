package com.urlshortener.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.urlshortener.model.CustomerOrder;
import com.urlshortener.model.Page;
import com.urlshortener.model.PageBlock;
import com.urlshortener.model.User;
import com.urlshortener.repository.CustomerOrderRepository;
import com.urlshortener.repository.PageRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.event.OrderCompletedEvent;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class MonetizationService {

  @Autowired
  private CustomerOrderRepository customerOrderRepository;

  @Autowired
  private PageRepository pageRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private BookingService bookingService;

  @Autowired
  private ApplicationEventPublisher eventPublisher;

  @Value("${razorpay.key.id}")
  private String razorpayKeyId;

  @Value("${razorpay.key.secret}")
  private String razorpayKeySecret;

  // Platform Fee Configuration
  private static final int PLATFORM_FEE_PERCENTAGE = 5;

  public CustomerOrder createCheckoutOrder(String pageId, String blockId, String customerEmail, String customerName,
      Map<String, String> answers, String bookingDate, String bookingStartUtcStr, String bookingEndUtcStr)
      throws Exception {
    // 1. Fetch Page and Block details
    Page page = pageRepository.findById(pageId)
        .orElseThrow(() -> new RuntimeException("Page not found"));

    User creator = userRepository.findById(page.getUserId())
        .orElseThrow(() -> new RuntimeException("Creator not found"));

    if (!creator.isRazorpayConnected() || creator.getRazorpayAccountId() == null) {
      throw new RuntimeException("Creator cannot accept payments currently.");
    }

    PageBlock targetBlock = page.getBlocks().stream()
        .filter(b -> b.getId().equals(blockId) && b.getType() == PageBlock.BlockType.MONETIZATION)
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Monetization product not found"));

    Map<String, Object> content = targetBlock.getContent();

    // Parse Price
    Object priceObj = content.get("price");
    if (priceObj == null || priceObj.toString().trim().isEmpty()) {
      throw new RuntimeException("This product is free.");
    }
    int priceInRupees = Integer.parseInt(priceObj.toString());
    int amountInPaise = priceInRupees * 100;

    String monetizationType = (String) content.getOrDefault("monetizationType", "DIGITAL_FILE");

    // Serialize answers if any
    String requirementAnswers = null;
    if (answers != null && !answers.isEmpty()) {
      requirementAnswers = new JSONObject(answers).toString();
    }

    // 2. Initialize Razorpay Client
    RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

    // 3. Construct Order Payload with Transfers
    JSONObject orderRequest = new JSONObject();
    orderRequest.put("amount", amountInPaise);
    orderRequest.put("currency", "INR");
    orderRequest.put("receipt", "m_txn_" + System.currentTimeMillis());

    // Calculate Transfer (95% to Creator, 5% to Platform)
    int platformFeePaise = (int) (amountInPaise * (PLATFORM_FEE_PERCENTAGE / 100.0));
    int creatorAmountPaise = amountInPaise - platformFeePaise;

    JSONArray transfers = new JSONArray();
    JSONObject transferToCreator = new JSONObject();
    transferToCreator.put("account", creator.getRazorpayAccountId());
    transferToCreator.put("amount", creatorAmountPaise);
    transferToCreator.put("currency", "INR");

    JSONObject notes = new JSONObject();
    notes.put("note_key 1", "Transfer for " + content.get("title"));
    notes.put("note_key 2", "Page: " + page.getSlug());
    transferToCreator.put("notes", notes);
    transferToCreator.put("on_hold", false); // Execute immediately for digital goods

    transfers.put(transferToCreator);
    orderRequest.put("transfers", transfers);

    // 4. Create Order on Razorpay
    Order order = razorpay.orders.create(orderRequest);
    String subMerchantOrderId = order.get("id");

    // 4.5 If SERVICE_LIVE, acquire atomic lock.
    // If it fails (DuplicateKey), we throw and the user has to try another slot.
    if ("SERVICE_LIVE".equals(monetizationType)) {
      if (bookingDate == null || bookingStartUtcStr == null || bookingEndUtcStr == null) {
        throw new RuntimeException("Booking date and times are required for live services.");
      }
      try {
        Instant startUtc = Instant.parse(bookingStartUtcStr);
        Instant endUtc = Instant.parse(bookingEndUtcStr);
        bookingService.createPendingBooking(creator.getId(), pageId, blockId, subMerchantOrderId, customerName,
            customerEmail,
            bookingDate, startUtc, endUtc);
      } catch (org.springframework.dao.DuplicateKeyException e) {
        throw new RuntimeException("This timeslot is no longer available. Please select another time.");
      } catch (Exception e) {
        throw new RuntimeException("Failed to secure timeslot: " + e.getMessage());
      }
    }

    // 5. Save pending order to DB
    CustomerOrder newOrder = new CustomerOrder();
    newOrder.setPageId(pageId);
    newOrder.setBlockId(blockId);
    newOrder.setCreatorId(creator.getId());
    newOrder.setCustomerEmail(customerEmail);
    newOrder.setCustomerName(customerName);
    newOrder.setAmount(amountInPaise);
    newOrder.setCurrency("INR");
    newOrder.setMonetizationType(monetizationType);
    newOrder.setStatus("PENDING");
    newOrder.setRazorpayOrderId(subMerchantOrderId);
    newOrder.setRequirementAnswers(requirementAnswers);

    return customerOrderRepository.save(newOrder);
  }

  public CustomerOrder verifyCheckoutPayment(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature)
      throws Exception {
    // 1. Verify Signature
    JSONObject options = new JSONObject();
    options.put("razorpay_order_id", razorpayOrderId);
    options.put("razorpay_payment_id", razorpayPaymentId);
    options.put("razorpay_signature", razorpaySignature);

    boolean isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
    if (!isValid) {
      throw new RuntimeException("Invalid payment signature");
    }

    // 2. Fetch Order
    CustomerOrder order = customerOrderRepository.findByRazorpayOrderId(razorpayOrderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    if (!"PENDING".equals(order.getStatus())) {
      return order; // Already verified
    }

    // 3. Mark as Paid
    order.setStatus("PAID");
    order.setRazorpayPaymentId(razorpayPaymentId);
    order.setUpdatedAt(LocalDateTime.now());

    // 3.5 Permanently lock the booking slot if applicable
    if ("SERVICE_LIVE".equals(order.getMonetizationType())) {
      bookingService.confirmBooking(razorpayOrderId);
    }

    CustomerOrder savedOrder = customerOrderRepository.save(order);
    eventPublisher.publishEvent(new OrderCompletedEvent(this, savedOrder));

    return savedOrder;
  }
}
