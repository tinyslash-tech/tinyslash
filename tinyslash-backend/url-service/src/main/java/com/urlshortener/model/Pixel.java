package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "pixels")
public class Pixel {

  @Id
  private String id;

  @Indexed
  private String userId;

  private String name; // "My Facebook Pixel"

  private PixelType type; // FACEBOOK_CAPI, GOOGLE_ADS, GA4, WEBHOOK

  private String pixelId; // Facebook Pixel ID or Google Tag ID
  private String accessToken; // Facebook CAPI access token (encrypted at rest)
  private String conversionApiEndpoint; // custom for WEBHOOK type

  private boolean active = true;

  /**
   * P5: Sampling rate. 100 = fire every time, 50 = fire 50% of the time.
   * Prevents API quota exhaustion and cost explosion for high-traffic links.
   */
  private int samplingPercent = 100;

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  // Analytics
  private long totalFired = 0;
  private long totalFailed = 0;
  private LocalDateTime lastFiredAt;

  // Constructors
  public Pixel() {
  }

  public Pixel(String userId, String name, PixelType type, String pixelId) {
    this.userId = userId;
    this.name = name;
    this.type = type;
    this.pixelId = pixelId;
  }

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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public PixelType getType() {
    return type;
  }

  public void setType(PixelType type) {
    this.type = type;
  }

  public String getPixelId() {
    return pixelId;
  }

  public void setPixelId(String pixelId) {
    this.pixelId = pixelId;
  }

  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }

  public String getConversionApiEndpoint() {
    return conversionApiEndpoint;
  }

  public void setConversionApiEndpoint(String conversionApiEndpoint) {
    this.conversionApiEndpoint = conversionApiEndpoint;
  }

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
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

  public long getTotalFired() {
    return totalFired;
  }

  public void setTotalFired(long totalFired) {
    this.totalFired = totalFired;
  }

  public long getTotalFailed() {
    return totalFailed;
  }

  public void setTotalFailed(long totalFailed) {
    this.totalFailed = totalFailed;
  }

  public LocalDateTime getLastFiredAt() {
    return lastFiredAt;
  }

  public void setLastFiredAt(LocalDateTime lastFiredAt) {
    this.lastFiredAt = lastFiredAt;
  }

  public int getSamplingPercent() {
    return samplingPercent;
  }

  public void setSamplingPercent(int samplingPercent) {
    this.samplingPercent = Math.max(1, Math.min(100, samplingPercent));
  }
}
