package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "coupons")
public class Coupon {

  @Id
  private String id;

  @Indexed(unique = true)
  private String code;

  private String description;

  private String discountType; // PERCENTAGE, FIXED_AMOUNT
  private Double discountValue;

  private Integer maxUses;
  private Integer usedCount = 0;

  private LocalDateTime expiryDate;
  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  private boolean isActive = true;

  private List<String> applicablePlans; // e.g., ["PRO_MONTHLY", "BUSINESS_YEARLY"]

  // Constructors
  public Coupon() {
  }

  public Coupon(String code, String discountType, Double discountValue) {
    this.code = code;
    this.discountType = discountType;
    this.discountValue = discountValue;
  }

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDiscountType() {
    return discountType;
  }

  public void setDiscountType(String discountType) {
    this.discountType = discountType;
  }

  public Double getDiscountValue() {
    return discountValue;
  }

  public void setDiscountValue(Double discountValue) {
    this.discountValue = discountValue;
  }

  public Integer getMaxUses() {
    return maxUses;
  }

  public void setMaxUses(Integer maxUses) {
    this.maxUses = maxUses;
  }

  public Integer getUsedCount() {
    return usedCount;
  }

  public void setUsedCount(Integer usedCount) {
    this.usedCount = usedCount;
  }

  public LocalDateTime getExpiryDate() {
    return expiryDate;
  }

  public void setExpiryDate(LocalDateTime expiryDate) {
    this.expiryDate = expiryDate;
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

  public boolean isActive() {
    return isActive;
  }

  public void setActive(boolean active) {
    isActive = active;
  }

  public List<String> getApplicablePlans() {
    return applicablePlans;
  }

  public void setApplicablePlans(List<String> applicablePlans) {
    this.applicablePlans = applicablePlans;
  }

  // Helper methods
  public boolean isValid() {
    if (!isActive)
      return false;
    if (expiryDate != null && LocalDateTime.now().isAfter(expiryDate))
      return false;
    if (maxUses != null && usedCount >= maxUses)
      return false;
    return true;
  }
}
