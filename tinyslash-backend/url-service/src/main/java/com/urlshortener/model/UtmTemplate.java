package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "utm_templates")
@CompoundIndex(name = "team_name_idx", def = "{'teamId': 1, 'name': 1}", unique = true)
public class UtmTemplate {

  @Id
  private String id;

  private String teamId;

  private String createdBy;

  private String name;

  private String utmSource;
  private String utmMedium;
  private String utmCampaign;
  private String utmTerm;
  private String utmContent;
  private String referral;

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public UtmTemplate() {
  }

  public UtmTemplate(String teamId, String createdBy, String name) {
    this.teamId = teamId;
    this.createdBy = createdBy;
    this.name = name;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTeamId() {
    return teamId;
  }

  public void setTeamId(String teamId) {
    this.teamId = teamId;
  }

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
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
