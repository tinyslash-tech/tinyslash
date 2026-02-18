package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "page_views")
@CompoundIndex(name = "idx_page_viewed", def = "{'pageId': 1, 'viewedAt': -1}")
public class PageView {

  @Id
  private String id;

  @Indexed
  private String pageId;

  private String visitorId; // Hash of IP + User-Agent for unique visitor tracking

  private String ip;
  private String userAgent;
  private String referer;

  private LocalDateTime viewedAt;

  public PageView() {
  }

  public PageView(String pageId, String visitorId, String ip, String userAgent, String referer) {
    this.pageId = pageId;
    this.visitorId = visitorId;
    this.ip = ip;
    this.userAgent = userAgent;
    this.referer = referer;
    this.viewedAt = LocalDateTime.now();
  }

  // Getters and setters
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

  public String getVisitorId() {
    return visitorId;
  }

  public void setVisitorId(String visitorId) {
    this.visitorId = visitorId;
  }

  public String getIp() {
    return ip;
  }

  public void setIp(String ip) {
    this.ip = ip;
  }

  public String getUserAgent() {
    return userAgent;
  }

  public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
  }

  public String getReferer() {
    return referer;
  }

  public void setReferer(String referer) {
    this.referer = referer;
  }

  public LocalDateTime getViewedAt() {
    return viewedAt;
  }

  public void setViewedAt(LocalDateTime viewedAt) {
    this.viewedAt = viewedAt;
  }
}
