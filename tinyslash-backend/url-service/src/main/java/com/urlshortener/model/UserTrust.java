package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "user_trust")
public class UserTrust {

  @Id
  private String userId;

  @Indexed
  private int trustScore = 50; // 0 to 100

  private int accountAgeDays = 0;

  private long totalLinksCreated = 0;
  private long blockedLinks = 0;
  private long reportedLinks = 0;

  private LocalDateTime lastBlockAt;
  private int consecutiveBlocks = 0;

  private boolean emailVerified = false;
  private boolean phoneVerified = false;

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public UserTrust() {
  }

  public UserTrust(String userId) {
    this.userId = userId;
  }

  public void recordBlock() {
    this.blockedLinks++;
    this.consecutiveBlocks++;
    this.lastBlockAt = LocalDateTime.now();
    this.trustScore = Math.max(0, this.trustScore - 5); // Immediate penalty
    this.updatedAt = LocalDateTime.now();
  }

  public void recordSuccess() {
    this.totalLinksCreated++;
    this.consecutiveBlocks = 0;
    this.updatedAt = LocalDateTime.now();
    // Slow trust recovery
    if (this.trustScore < 100 && this.totalLinksCreated % 10 == 0) {
      this.trustScore++;
    }
  }

  // Getters and Setters
  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public int getTrustScore() {
    return trustScore;
  }

  public void setTrustScore(int trustScore) {
    this.trustScore = trustScore;
  }

  public int getAccountAgeDays() {
    return accountAgeDays;
  }

  public void setAccountAgeDays(int accountAgeDays) {
    this.accountAgeDays = accountAgeDays;
  }

  public long getTotalLinksCreated() {
    return totalLinksCreated;
  }

  public void setTotalLinksCreated(long totalLinksCreated) {
    this.totalLinksCreated = totalLinksCreated;
  }

  public long getBlockedLinks() {
    return blockedLinks;
  }

  public void setBlockedLinks(long blockedLinks) {
    this.blockedLinks = blockedLinks;
  }

  public long getReportedLinks() {
    return reportedLinks;
  }

  public void setReportedLinks(long reportedLinks) {
    this.reportedLinks = reportedLinks;
  }

  public LocalDateTime getLastBlockAt() {
    return lastBlockAt;
  }

  public void setLastBlockAt(LocalDateTime lastBlockAt) {
    this.lastBlockAt = lastBlockAt;
  }

  public int getConsecutiveBlocks() {
    return consecutiveBlocks;
  }

  public void setConsecutiveBlocks(int consecutiveBlocks) {
    this.consecutiveBlocks = consecutiveBlocks;
  }

  public boolean isEmailVerified() {
    return emailVerified;
  }

  public void setEmailVerified(boolean emailVerified) {
    this.emailVerified = emailVerified;
  }

  public boolean isPhoneVerified() {
    return phoneVerified;
  }

  public void setPhoneVerified(boolean phoneVerified) {
    this.phoneVerified = phoneVerified;
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
