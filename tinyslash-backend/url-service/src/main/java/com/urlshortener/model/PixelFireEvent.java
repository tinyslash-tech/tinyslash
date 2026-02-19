package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.Instant;

/**
 * Records a single raw pixel fire event tied to a specific link click.
 *
 * NOTE: This is a DEBUG / audit collection only.
 * Analytics queries MUST use PixelDailyStat (pre-aggregated) for performance at
 * scale.
 *
 * TTL: Documents auto-expire after 90 days via MongoDB TTL index.
 * This prevents unbounded storage growth at 10M+ events/month.
 */
@Document(collection = "pixel_fire_events")
@CompoundIndexes({
    // For debug lookups: "show me all events for this link recently"
    @CompoundIndex(name = "shortcode_firedAt_idx", def = "{'shortCode': 1, 'firedAt': -1}"),
    @CompoundIndex(name = "linkId_firedAt_idx", def = "{'linkId': 1, 'firedAt': -1}"),
    @CompoundIndex(name = "userId_firedAt_idx", def = "{'userId': 1, 'firedAt': -1}"),
    // Partial status index — fast failure auditing
    @CompoundIndex(name = "pixelId_status_idx", def = "{'pixelId': 1, 'status': 1}")
})
public class PixelFireEvent {

  public enum Status {
    SUCCESS, FAILED
  }

  @Id
  private String id;

  @Indexed
  private String pixelId;

  @Indexed
  private String linkId;

  /** Stored for frontend lookup — Analytics.tsx has shortCode, not DB id */
  @Indexed
  private String shortCode;

  @Indexed
  private String userId;

  private Status status;
  private String errorMessage; // populated on FAILED

  /**
   * TTL index — MongoDB automatically removes documents 90 days after firedAt.
   * Using Instant (not LocalDateTime) for correct timezone-independent BSON Date
   * storage.
   */
  @Indexed(expireAfterSeconds = 7776000) // 90 days = 60*60*24*90
  private Instant firedAt;

  // Constructors
  public PixelFireEvent() {
    this.firedAt = Instant.now();
  }

  /**
   * Minimal constructor — no pixelName/pixelType stored here (redundant at
   * scale).
   * Display metadata lives in PixelDailyStat.pixelName / Pixel.name.
   */
  public PixelFireEvent(String pixelId, String linkId, String shortCode, String userId, Status status) {
    this.pixelId = pixelId;
    this.linkId = linkId;
    this.shortCode = shortCode;
    this.userId = userId;
    this.status = status;
    this.firedAt = Instant.now();
  }

  // Getters & Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getPixelId() {
    return pixelId;
  }

  public void setPixelId(String pixelId) {
    this.pixelId = pixelId;
  }

  public String getLinkId() {
    return linkId;
  }

  public void setLinkId(String linkId) {
    this.linkId = linkId;
  }

  public String getShortCode() {
    return shortCode;
  }

  public void setShortCode(String shortCode) {
    this.shortCode = shortCode;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public Status getStatus() {
    return status;
  }

  public void setStatus(Status status) {
    this.status = status;
  }

  public String getErrorMessage() {
    return errorMessage;
  }

  public void setErrorMessage(String errorMessage) {
    this.errorMessage = errorMessage;
  }

  public Instant getFiredAt() {
    return firedAt;
  }

  public void setFiredAt(Instant firedAt) {
    this.firedAt = firedAt;
  }
}
