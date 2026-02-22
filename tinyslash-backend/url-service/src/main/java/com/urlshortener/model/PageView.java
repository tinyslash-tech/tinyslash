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

  private String sessionId; // UUID from frontend
  private String visitorId; // Hash of IP + User-Agent OR anonymousId from frontend

  private String ip;
  private String userAgent;
  private String referer;

  // --- Analytical Dimensions ---
  private String deviceType; // DESKTOP, MOBILE, TABLET
  private String browser;
  private String os;
  private String country;
  private String city;

  // Traffic Source
  private String refererType; // DIRECT, SEARCH, SOCIAL, WHATSAPP, INSTAGRAM, etc.
  private String utmSource;
  private String utmMedium;
  private String utmCampaign;

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

  public String getSessionId() {
    return sessionId;
  }

  public void setSessionId(String sessionId) {
    this.sessionId = sessionId;
  }

  public String getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(String deviceType) {
    this.deviceType = deviceType;
  }

  public String getBrowser() {
    return browser;
  }

  public void setBrowser(String browser) {
    this.browser = browser;
  }

  public String getOs() {
    return os;
  }

  public void setOs(String os) {
    this.os = os;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getRefererType() {
    return refererType;
  }

  public void setRefererType(String refererType) {
    this.refererType = refererType;
  }

  public String getUtmSource() {
    return utmSource;
  }

  public void setUtmSource(String utmSource) {
    this.utmSource = utmSource;
  }

  public String getUtmMedium() {
    return utmMedium;
  }

  public void setUtmMedium(String utmMedium) {
    this.utmMedium = utmMedium;
  }

  public String getUtmCampaign() {
    return utmCampaign;
  }

  public void setUtmCampaign(String utmCampaign) {
    this.utmCampaign = utmCampaign;
  }
}
