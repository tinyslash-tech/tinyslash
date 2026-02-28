package com.urlshortener.dto;

import java.time.LocalDateTime;

public class UtmTemplateDto {
  private String id;
  private String name;
  private String utmSource;
  private String utmMedium;
  private String utmCampaign;
  private String utmTerm;
  private String utmContent;
  private String referral;
  private String createdBy; // User ID
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getUtmSource() {
    return utmSource;
  }

  public void setUtmSource(String utmSource) {
    this.utmSource = utmSource;
  }

  public String getUtmMedium() {
    return utmMedium;
  }

  public void setUtmMedium(String utmMedium) {
    this.utmMedium = utmMedium;
  }

  public String getUtmCampaign() {
    return utmCampaign;
  }

  public void setUtmCampaign(String utmCampaign) {
    this.utmCampaign = utmCampaign;
  }

  public String getUtmTerm() {
    return utmTerm;
  }

  public void setUtmTerm(String utmTerm) {
    this.utmTerm = utmTerm;
  }

  public String getUtmContent() {
    return utmContent;
  }

  public void setUtmContent(String utmContent) {
    this.utmContent = utmContent;
  }

  public String getReferral() {
    return referral;
  }

  public void setReferral(String referral) {
    this.referral = referral;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
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
