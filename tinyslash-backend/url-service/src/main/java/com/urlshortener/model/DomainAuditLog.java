package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Audit Log for Domain Events.
 * Tracks every action taken on a domain for compliance and debugging.
 */
@Document(collection = "domain_audit_logs")
public class DomainAuditLog {

  public enum EventType {
    DOMAIN_ADDED,
    DNS_VERIFIED,
    SSL_ISSUED,
    SSL_FAILED,
    DELETION_SCHEDULED,
    DELETION_COMPLETED,
    DELETION_FAILED,
    PLAN_BLOCK,
    ABUSE_FLAGGED,
    MANUAL_OVERRIDE,
    DOMAIN_REVERIFIED,
    DOMAIN_MISCONFIGURED,
    DOMAIN_DISABLED_AUTO,
    DOMAIN_COOLDOWN_TRIGGERED
  }

  @Id
  private String id;

  @Indexed
  private String domainId;

  @Indexed
  private String domainName;

  @Indexed
  private String userId; // Actor (User or System)

  private EventType eventType;
  private String details;
  private String metadata; // JSON or additional info
  private LocalDateTime timestamp = LocalDateTime.now();

  public DomainAuditLog() {
  }

  public DomainAuditLog(String domainId, String domainName, String userId, EventType eventType, String details) {
    this.domainId = domainId;
    this.domainName = domainName;
    this.userId = userId;
    this.eventType = eventType;
    this.details = details;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getDomainId() {
    return domainId;
  }

  public void setDomainId(String domainId) {
    this.domainId = domainId;
  }

  public String getDomainName() {
    return domainName;
  }

  public void setDomainName(String domainName) {
    this.domainName = domainName;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public EventType getEventType() {
    return eventType;
  }

  public void setEventType(EventType eventType) {
    this.eventType = eventType;
  }

  public String getDetails() {
    return details;
  }

  public void setDetails(String details) {
    this.details = details;
  }

  public String getMetadata() {
    return metadata;
  }

  public void setMetadata(String metadata) {
    this.metadata = metadata;
  }

  public LocalDateTime getTimestamp() {
    return timestamp;
  }

  public void setTimestamp(LocalDateTime timestamp) {
    this.timestamp = timestamp;
  }
}
