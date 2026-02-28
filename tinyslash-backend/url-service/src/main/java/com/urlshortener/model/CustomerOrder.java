package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "customer_orders")
public class CustomerOrder {

  @Id
  private String id;

  @Indexed
  private String pageId;

  @Indexed
  private String blockId; // The ID of the MONETIZATION block

  @Indexed
  private String creatorId; // The user ID of the creator selling the item

  private String customerEmail;
  private String customerName;
  private Integer amount; // in paise
  private String currency = "INR";

  private String monetizationType; // DIGITAL_FILE, SERVICE_LIVE, SERVICE_ASYNC

  @Indexed
  private String status = "PENDING"; // PENDING, PAID, REFUNDED, FAILED

  private String razorpayOrderId;
  private String razorpayPaymentId;

  // Fulfillment data based on type
  private String requirementAnswers; // For SERVICE_ASYNC

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getPageId() {
    return pageId;
  }

  public void setPageId(String pageId) {
    this.pageId = pageId;
  }

  public String getBlockId() {
    return blockId;
  }

  public void setBlockId(String blockId) {
    this.blockId = blockId;
  }

  public String getCreatorId() {
    return creatorId;
  }

  public void setCreatorId(String creatorId) {
    this.creatorId = creatorId;
  }

  public String getCustomerEmail() {
    return customerEmail;
  }

  public void setCustomerEmail(String customerEmail) {
    this.customerEmail = customerEmail;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public Integer getAmount() {
    return amount;
  }

  public void setAmount(Integer amount) {
    this.amount = amount;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public String getMonetizationType() {
    return monetizationType;
  }

  public void setMonetizationType(String monetizationType) {
    this.monetizationType = monetizationType;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getRazorpayOrderId() {
    return razorpayOrderId;
  }

  public void setRazorpayOrderId(String razorpayOrderId) {
    this.razorpayOrderId = razorpayOrderId;
  }

  public String getRazorpayPaymentId() {
    return razorpayPaymentId;
  }

  public void setRazorpayPaymentId(String razorpayPaymentId) {
    this.razorpayPaymentId = razorpayPaymentId;
  }

  public String getRequirementAnswers() {
    return requirementAnswers;
  }

  public void setRequirementAnswers(String requirementAnswers) {
    this.requirementAnswers = requirementAnswers;
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
}
