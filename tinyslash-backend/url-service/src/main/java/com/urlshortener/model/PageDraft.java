package com.urlshortener.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "page_drafts")
public class PageDraft {
  @Id
  private String id;

  @Indexed
  private String pageId;

  @Indexed
  private String agencyUserId;

  @Indexed
  private PageDraftStatus status;

  private String userId;
  private String slug;

  private String title;
  private String bio;
  private String avatarUrl;

  private PageTheme theme;

  private List<PageBlock> blocks = new ArrayList<>();

  private boolean published = true;
  private long views = 0;

  private String customDomain;
  private boolean removeBranding = false;
  private boolean verified = false;

  private String waNumber;
  private String waDefaultMessage;
  private String waSmartTemplate;
  private String waDisplayType;

  private String metaTitle;
  private String metaDescription;

  private String fbPixelId;
  private String googleAnalyticsId;
  private String customScripts;

  @CreatedDate
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;

  public PageDraft() {
  }

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

  public String getAgencyUserId() {
    return agencyUserId;
  }

  public void setAgencyUserId(String agencyUserId) {
    this.agencyUserId = agencyUserId;
  }

  public PageDraftStatus getStatus() {
    return status;
  }

  public void setStatus(PageDraftStatus status) {
    this.status = status;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getSlug() {
    return slug;
  }

  public void setSlug(String slug) {
    this.slug = slug;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getAvatarUrl() {
    return avatarUrl;
  }

  public void setAvatarUrl(String avatarUrl) {
    this.avatarUrl = avatarUrl;
  }

  public PageTheme getTheme() {
    return theme;
  }

  public void setTheme(PageTheme theme) {
    this.theme = theme;
  }

  public List<PageBlock> getBlocks() {
    return blocks;
  }

  public void setBlocks(List<PageBlock> blocks) {
    this.blocks = blocks;
  }

  public boolean isPublished() {
    return published;
  }

  public void setPublished(boolean published) {
    this.published = published;
  }

  public long getViews() {
    return views;
  }

  public void setViews(long views) {
    this.views = views;
  }

  public String getCustomDomain() {
    return customDomain;
  }

  public void setCustomDomain(String customDomain) {
    this.customDomain = customDomain;
  }

  public boolean isRemoveBranding() {
    return removeBranding;
  }

  public void setRemoveBranding(boolean removeBranding) {
    this.removeBranding = removeBranding;
  }

  public boolean isVerified() {
    return verified;
  }

  public void setVerified(boolean verified) {
    this.verified = verified;
  }

  public String getWaNumber() {
    return waNumber;
  }

  public void setWaNumber(String waNumber) {
    this.waNumber = waNumber;
  }

  public String getWaDefaultMessage() {
    return waDefaultMessage;
  }

  public void setWaDefaultMessage(String waDefaultMessage) {
    this.waDefaultMessage = waDefaultMessage;
  }

  public String getWaSmartTemplate() {
    return waSmartTemplate;
  }

  public void setWaSmartTemplate(String waSmartTemplate) {
    this.waSmartTemplate = waSmartTemplate;
  }

  public String getWaDisplayType() {
    return waDisplayType;
  }

  public void setWaDisplayType(String waDisplayType) {
    this.waDisplayType = waDisplayType;
  }

  public String getMetaTitle() {
    return metaTitle;
  }

  public void setMetaTitle(String metaTitle) {
    this.metaTitle = metaTitle;
  }

  public String getMetaDescription() {
    return metaDescription;
  }

  public void setMetaDescription(String metaDescription) {
    this.metaDescription = metaDescription;
  }

  public String getFbPixelId() {
    return fbPixelId;
  }

  public void setFbPixelId(String fbPixelId) {
    this.fbPixelId = fbPixelId;
  }

  public String getGoogleAnalyticsId() {
    return googleAnalyticsId;
  }

  public void setGoogleAnalyticsId(String googleAnalyticsId) {
    this.googleAnalyticsId = googleAnalyticsId;
  }

  public String getCustomScripts() {
    return customScripts;
  }

  public void setCustomScripts(String customScripts) {
    this.customScripts = customScripts;
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
