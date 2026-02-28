package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateUtmTemplateRequest {

  @NotBlank(message = "Template name is required")
  @Size(max = 255, message = "Template name cannot exceed 255 characters")
  private String name;

  @Size(max = 255)
  private String utmSource;

  @Size(max = 255)
  private String utmMedium;

  @Size(max = 255)
  private String utmCampaign;

  @Size(max = 255)
  private String utmTerm;

  @Size(max = 255)
  private String utmContent;

  @Size(max = 255)
  private String referral;

  // Getters and Setters
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
}
