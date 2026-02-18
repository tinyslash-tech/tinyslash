package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Global Reservation Table for Domains.
 * Ensures no domain is claimed by multiple accounts even if soft-deleted.
 * Acts as the "Global Lock".
 */
@Document(collection = "reserved_domains")
public class ReservedDomain {

  @Id
  private String id;

  @Indexed(unique = true)
  private String domainName;

  @Indexed
  private String originalOwnerId;

  @Indexed
  private String status; // ACTIVE, PENDING, DELETING, VERIFIED

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime expiresAt; // For temporary reservations (e.g. during creation wizard)

  public ReservedDomain() {
  }

  public ReservedDomain(String domainName, String originalOwnerId, String status) {
    this.domainName = domainName;
    this.originalOwnerId = originalOwnerId;
    this.status = status;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getDomainName() {
    return domainName;
  }

  public void setDomainName(String domainName) {
    this.domainName = domainName;
  }

  public String getOriginalOwnerId() {
    return originalOwnerId;
  }

  public void setOriginalOwnerId(String originalOwnerId) {
    this.originalOwnerId = originalOwnerId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(LocalDateTime expiresAt) {
    this.expiresAt = expiresAt;
  }
}
