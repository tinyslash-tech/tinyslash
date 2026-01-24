package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "domain_reputation")
public class DomainReputation {

  @Id
  private String domain; // The domain name itself is the ID (e.g., "example.com")

  @Indexed
  private int trustScore = 50; // 0 (worst) to 100 (best)

  // Activity Tracking
  private long totalLinks = 0;
  private long blockedLinks = 0;
  private long warnedLinks = 0;
  private long allowedLinks = 0;

  // User Behavior
  private long uniqueUsers = 0;
  private long reportedCount = 0;

  @Indexed
  private String category = "unknown"; // 'trusted', 'risky', 'malicious', 'unknown'

  // Temporal Data
  private LocalDateTime firstSeen = LocalDateTime.now();
  private LocalDateTime lastSeen = LocalDateTime.now();
  private LocalDateTime lastBlockAt;

  // Velocity Metrics
  private int linksLastHour = 0; // Snapshot/Cache
  private int linksLastDay = 0; // Snapshot/Cache
  private int peakHourlyRate = 0;

  // Flags
  private boolean isWhitelisted = false;
  private boolean isBlacklisted = false;
  private boolean isTempBanned = false;
  private LocalDateTime tempBanUntil;

  // Metadata
  private String tld;
  private String firstSeenByUserId;
  private boolean manuallyReviewed = false;
  private String reviewNotes;

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public DomainReputation() {
  }

  public DomainReputation(String domain) {
    this.domain = domain;
    if (domain.contains(".")) {
      this.tld = domain.substring(domain.lastIndexOf("."));
    }
  }

  // Logic for updating stats
  public void incrementTotalLinks() {
    this.totalLinks++;
    this.lastSeen = LocalDateTime.now();
  }

  public void incrementBlockedLinks() {
    this.blockedLinks++;
    this.lastBlockAt = LocalDateTime.now();
    this.lastSeen = LocalDateTime.now();
    // Dynamic penalty
    this.trustScore = Math.max(0, this.trustScore - 10);
  }

  public double getBlockRatio() {
    if (totalLinks == 0)
      return 0.0;
    return (double) blockedLinks / totalLinks;
  }

  // Getters and Setters
  public String getDomain() {
    return domain;
  }

  public void setDomain(String domain) {
    this.domain = domain;
  }

  public int getTrustScore() {
    return trustScore;
  }

  public void setTrustScore(int trustScore) {
    this.trustScore = trustScore;
  }

  public long getTotalLinks() {
    return totalLinks;
  }

  public void setTotalLinks(long totalLinks) {
    this.totalLinks = totalLinks;
  }

  public long getBlockedLinks() {
    return blockedLinks;
  }

  public void setBlockedLinks(long blockedLinks) {
    this.blockedLinks = blockedLinks;
  }

  public long getWarnedLinks() {
    return warnedLinks;
  }

  public void setWarnedLinks(long warnedLinks) {
    this.warnedLinks = warnedLinks;
  }

  public long getAllowedLinks() {
    return allowedLinks;
  }

  public void setAllowedLinks(long allowedLinks) {
    this.allowedLinks = allowedLinks;
  }

  public long getUniqueUsers() {
    return uniqueUsers;
  }

  public void setUniqueUsers(long uniqueUsers) {
    this.uniqueUsers = uniqueUsers;
  }

  public long getReportedCount() {
    return reportedCount;
  }

  public void setReportedCount(long reportedCount) {
    this.reportedCount = reportedCount;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public LocalDateTime getFirstSeen() {
    return firstSeen;
  }

  public void setFirstSeen(LocalDateTime firstSeen) {
    this.firstSeen = firstSeen;
  }

  public LocalDateTime getLastSeen() {
    return lastSeen;
  }

  public void setLastSeen(LocalDateTime lastSeen) {
    this.lastSeen = lastSeen;
  }

  public LocalDateTime getLastBlockAt() {
    return lastBlockAt;
  }

  public void setLastBlockAt(LocalDateTime lastBlockAt) {
    this.lastBlockAt = lastBlockAt;
  }

  public int getLinksLastHour() {
    return linksLastHour;
  }

  public void setLinksLastHour(int linksLastHour) {
    this.linksLastHour = linksLastHour;
  }

  public int getLinksLastDay() {
    return linksLastDay;
  }

  public void setLinksLastDay(int linksLastDay) {
    this.linksLastDay = linksLastDay;
  }

  public int getPeakHourlyRate() {
    return peakHourlyRate;
  }

  public void setPeakHourlyRate(int peakHourlyRate) {
    this.peakHourlyRate = peakHourlyRate;
  }

  public boolean isWhitelisted() {
    return isWhitelisted;
  }

  public void setWhitelisted(boolean whitelisted) {
    isWhitelisted = whitelisted;
  }

  public boolean isBlacklisted() {
    return isBlacklisted;
  }

  public void setBlacklisted(boolean blacklisted) {
    isBlacklisted = blacklisted;
  }

  public boolean isTempBanned() {
    return isTempBanned;
  }

  public void setTempBanned(boolean tempBanned) {
    isTempBanned = tempBanned;
  }

  public LocalDateTime getTempBanUntil() {
    return tempBanUntil;
  }

  public void setTempBanUntil(LocalDateTime tempBanUntil) {
    this.tempBanUntil = tempBanUntil;
  }

  public String getTld() {
    return tld;
  }

  public void setTld(String tld) {
    this.tld = tld;
  }

  public String getFirstSeenByUserId() {
    return firstSeenByUserId;
  }

  public void setFirstSeenByUserId(String firstSeenByUserId) {
    this.firstSeenByUserId = firstSeenByUserId;
  }

  public boolean isManuallyReviewed() {
    return manuallyReviewed;
  }

  public void setManuallyReviewed(boolean manuallyReviewed) {
    this.manuallyReviewed = manuallyReviewed;
  }

  public String getReviewNotes() {
    return reviewNotes;
  }

  public void setReviewNotes(String reviewNotes) {
    this.reviewNotes = reviewNotes;
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
