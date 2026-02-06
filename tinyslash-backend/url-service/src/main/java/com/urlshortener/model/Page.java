package com.urlshortener.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "pages")
public class Page {
  @Id
  private String id;

  @Indexed
  private String userId;

  @Indexed(unique = true)
  private String slug;

  private String title;
  private String bio;
  private String avatarUrl;

  private PageTheme theme;

  private List<PageBlock> blocks = new ArrayList<>();

  private boolean published = true;
  private long views = 0;

  // Pro Features
  private String customDomain;
  private boolean removeBranding = false;

  // SEO
  private String metaTitle;
  private String metaDescription;

  @CreatedDate
  private LocalDateTime createdAt;

  @LastModifiedDate
  private LocalDateTime updatedAt;

  public Page() {
  }

  public Page(String id, String userId, String slug, String title, String bio, String avatarUrl, PageTheme theme,
      List<PageBlock> blocks, boolean published, long views, String customDomain, boolean removeBranding,
      String metaTitle, String metaDescription, LocalDateTime createdAt, LocalDateTime updatedAt) {
    this.id = id;
    this.userId = userId;
    this.slug = slug;
    this.title = title;
    this.bio = bio;
    this.avatarUrl = avatarUrl;
    this.theme = theme;
    this.blocks = blocks;
    this.published = published;
    this.views = views;
    this.customDomain = customDomain;
    this.removeBranding = removeBranding;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

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
