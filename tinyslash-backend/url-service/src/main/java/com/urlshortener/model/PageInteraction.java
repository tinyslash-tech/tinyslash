package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Temporary storage for raw interactions on a page (e.g., SCROLL, CLICK).
 * TTL Index ensures these documents are automatically deleted after 24 hours
 * (86400 seconds)
 * to prevent MongoDB bloat.
 */
@Document(collection = "page_interactions")
@CompoundIndex(name = "idx_page_unprocessed", def = "{'pageId': 1, 'processed': 1}")
public class PageInteraction {

  @Id
  private String id;

  @Indexed
  private String pageId;

  @Indexed
  private String sessionId;

  @Indexed
  private String visitorId;

  private String type; // e.g., "SCROLL", "CLICK"

  private Map<String, Object> meta; // flexible metadata (e.g., {"depth": 75}, {"linkUrl": "https://..."})

  private boolean processed = false; // flag for the aggregation job

  @Indexed(expireAfterSeconds = 86400) // 24 hours TTL
  private LocalDateTime createdAt;

  public PageInteraction() {
    this.createdAt = LocalDateTime.now();
  }

  public PageInteraction(String pageId, String sessionId, String visitorId, String type, Map<String, Object> meta) {
    this.pageId = pageId;
    this.sessionId = sessionId;
    this.visitorId = visitorId;
    this.type = type;
    this.meta = meta;
    this.createdAt = LocalDateTime.now();
    this.processed = false;
  }

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

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  public String getVisitorId() {
    return visitorId;
  }

  public void setVisitorId(String visitorId) {
    this.visitorId = visitorId;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public Map<String, Object> getMeta() {
    return meta;
  }

  public void setMeta(Map<String, Object> meta) {
    this.meta = meta;
  }

  public boolean isProcessed() {
    return processed;
  }

  public void setProcessed(boolean processed) {
    this.processed = processed;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
