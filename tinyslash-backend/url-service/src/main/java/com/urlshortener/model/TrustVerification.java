package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "trust_verifications")
public class TrustVerification {
  @Id
  private String id;
  private String userId;
  private String businessName;
  private String brandName;
  private String businessType;
  private String officialWebsite;
  private String officialEmail;
  private String officialWhatsapp;

  // Status
  private VerificationStatus status; // PENDING_REVIEW, APPROVED, REJECTED, SUSPENDED

  private List<String> documents; // URLs to stored documents
  private String plan; // STARTER, BUSINESS

  private LocalDateTime createdAt;
  private LocalDateTime verifiedAt;
  private LocalDateTime expiresAt;

  // Getters and Setters
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

  public String getBusinessName() {
    return businessName;
  }

  public void setBusinessName(String businessName) {
    this.businessName = businessName;
  }

  public String getBrandName() {
    return brandName;
  }

  public void setBrandName(String brandName) {
    this.brandName = brandName;
  }

  public String getBusinessType() {
    return businessType;
  }

  public void setBusinessType(String businessType) {
    this.businessType = businessType;
  }

  public String getOfficialWebsite() {
    return officialWebsite;
  }

  public void setOfficialWebsite(String officialWebsite) {
    this.officialWebsite = officialWebsite;
  }

  public String getOfficialEmail() {
    return officialEmail;
  }

  public void setOfficialEmail(String officialEmail) {
    this.officialEmail = officialEmail;
  }

  public String getOfficialWhatsapp() {
    return officialWhatsapp;
  }

  public void setOfficialWhatsapp(String officialWhatsapp) {
    this.officialWhatsapp = officialWhatsapp;
  }

  public VerificationStatus getStatus() {
    return status;
  }

  public void setStatus(VerificationStatus status) {
    this.status = status;
  }

  public List<String> getDocuments() {
    return documents;
  }

  public void setDocuments(List<String> documents) {
    this.documents = documents;
  }

  public String getPlan() {
    return plan;
  }

  public void setPlan(String plan) {
    this.plan = plan;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getVerifiedAt() {
    return verifiedAt;
  }

  public void setVerifiedAt(LocalDateTime verifiedAt) {
    this.verifiedAt = verifiedAt;
  }

  public LocalDateTime getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(LocalDateTime expiresAt) {
    this.expiresAt = expiresAt;
  }

  public enum VerificationStatus {
    PENDING_REVIEW, APPROVED, REJECTED, SUSPENDED
  }
}
