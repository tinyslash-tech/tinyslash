package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDate;

/**
 * Pre-aggregated daily pixel fire stats.
 *
 * Instead of aggregating raw PixelFireEvent on every query (expensive at 10M+
 * events),
 * this document is atomically upserted ($inc) on every pixel fire.
 *
 * Analytics queries read from this small collection (users × pixels × days)
 * instead of scanning millions of raw events.
 *
 * Schema grows: O(users × pixels × days), not O(events).
 * Example: 1000 users × 5 pixels × 365 days = 1.8M docs (vs 10M+ raw events).
 */
@Document(collection = "pixel_daily_stats")
@CompoundIndexes({
    // Primary lookup: user's performance dashboard
    @CompoundIndex(name = "user_date_pixel_idx", def = "{'userId': 1, 'date': 1, 'pixelId': 1}", unique = true),
    // Per-link lookup: link analytics page
    @CompoundIndex(name = "shortcode_date_idx", def = "{'shortCode': 1, 'date': 1}"),
    // Per-pixel global lookup
    @CompoundIndex(name = "pixel_date_idx", def = "{'pixelId': 1, 'date': 1}")
})
public class PixelDailyStat {

  @Id
  private String id;

  /** The user who owns the pixel */
  @Indexed
  private String userId;

  /** The pixel that fired */
  @Indexed
  private String pixelId;

  /** The short link associated with this fire (for link-stats lookup) */
  @Indexed
  private String shortCode;

  /** The DB id of the link (for linkId-based lookup) */
  private String linkId;

  /**
   * Denormalized for display — updated on first insert, not on subsequent incs
   */
  private String pixelName;
  private PixelType pixelType;

  /** The calendar date (UTC) of these events — daily granularity */
  private LocalDate date;

  /** Total successful fires on this date */
  private long fired = 0;

  /** Total failed fires on this date */
  private long failed = 0;

  // ---- Constructors ----

  public PixelDailyStat() {
  }

  // ---- Getters & Setters ----

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

  public String getPixelId() {
    return pixelId;
  }

  public void setPixelId(String pixelId) {
    this.pixelId = pixelId;
  }

  public String getShortCode() {
    return shortCode;
  }

  public void setShortCode(String shortCode) {
    this.shortCode = shortCode;
  }

  public String getLinkId() {
    return linkId;
  }

  public void setLinkId(String linkId) {
    this.linkId = linkId;
  }

  public String getPixelName() {
    return pixelName;
  }

  public void setPixelName(String pixelName) {
    this.pixelName = pixelName;
  }

  public PixelType getPixelType() {
    return pixelType;
  }

  public void setPixelType(PixelType pixelType) {
    this.pixelType = pixelType;
  }

  public LocalDate getDate() {
    return date;
  }

  public void setDate(LocalDate date) {
    this.date = date;
  }

  public long getFired() {
    return fired;
  }

  public void setFired(long fired) {
    this.fired = fired;
  }

  public long getFailed() {
    return failed;
  }

  public void setFailed(long failed) {
    this.failed = failed;
  }

  /** Computed: total events on this day */
  public long getTotal() {
    return fired + failed;
  }

  /** Computed: fire rate percentage (0.0–100.0) */
  public double getFireRate() {
    long total = getTotal();
    return total > 0 ? Math.round((fired * 1000.0) / total) / 10.0 : 0.0;
  }
}
