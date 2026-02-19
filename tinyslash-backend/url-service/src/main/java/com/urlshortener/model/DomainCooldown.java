package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Domain Cooldown Table.
 * Prevents race conditions and immediate re-addition of deleted domains.
 * TTL: 24 Hours.
 */
@Document(collection = "domain_cooldowns")
public class DomainCooldown {

  @Id
  private String domainName; // The domain itself is the key

  @Indexed(expireAfterSeconds = 86400) // TTL 24 Hours
  private LocalDateTime deletedAt;

  private String previousOwnerId;
  private String deleteReason;

  public DomainCooldown() {
  }

  public DomainCooldown(String domainName, String previousOwnerId, String deleteReason) {
    this.domainName = domainName;
    this.deletedAt = LocalDateTime.now();
    this.previousOwnerId = previousOwnerId;
    this.deleteReason = deleteReason;
  }

  public String getDomainName() {
    return domainName;
  }

  public void setDomainName(String domainName) {
    this.domainName = domainName;
  }

  public LocalDateTime getDeletedAt() {
    return deletedAt;
  }

  public void setDeletedAt(LocalDateTime deletedAt) {
    this.deletedAt = deletedAt;
  }

  public String getPreviousOwnerId() {
    return previousOwnerId;
  }

  public void setPreviousOwnerId(String previousOwnerId) {
    this.previousOwnerId = previousOwnerId;
  }

  public String getDeleteReason() {
    return deleteReason;
  }

  public void setDeleteReason(String deleteReason) {
    this.deleteReason = deleteReason;
  }
}
