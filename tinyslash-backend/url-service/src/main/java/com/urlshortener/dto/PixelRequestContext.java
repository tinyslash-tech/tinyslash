package com.urlshortener.dto;

import java.time.Instant;

public class PixelRequestContext {
  private String linkId;
  private String shortCode;
  private String originalUrl; // Useful for context
  private String userId; // Owner of the link

  // User Context
  private String ipAddress;
  private String userAgent;
  private String referrer;

  // Tracking Cookies / IDs
  private String fbc; // Facebook click ID cookie
  private String fbp; // Facebook browser ID cookie
  private String gclid; // Google Click ID

  // Deduplication
  private String eventId; // UUID for deduplication

  private Instant clickTime;

  // Hashed PII (if available and implemented later)
  private String hashedEmail;
  private String hashedPhone;

  // Constructor
  public PixelRequestContext(String linkId, String shortCode, String originalUrl, String userId, String ipAddress,
      String userAgent, String referrer, String fbc, String fbp, String gclid, String eventId, Instant clickTime,
      String hashedEmail, String hashedPhone) {
    this.linkId = linkId;
    this.shortCode = shortCode;
    this.originalUrl = originalUrl;
    this.userId = userId;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.referrer = referrer;
    this.fbc = fbc;
    this.fbp = fbp;
    this.gclid = gclid;
    this.eventId = eventId;
    this.clickTime = clickTime;
    this.hashedEmail = hashedEmail;
    this.hashedPhone = hashedPhone;
  }

  public PixelRequestContext() {
  }

  // Getters and Setters
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

  public String getOriginalUrl() {
    return originalUrl;
  }

  public void setOriginalUrl(String originalUrl) {
    this.originalUrl = originalUrl;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getIpAddress() {
    return ipAddress;
  }

  public void setIpAddress(String ipAddress) {
    this.ipAddress = ipAddress;
  }

  public String getUserAgent() {
    return userAgent;
  }

  public void setUserAgent(String userAgent) {
    this.userAgent = userAgent;
  }

  public String getReferrer() {
    return referrer;
  }

  public void setReferrer(String referrer) {
    this.referrer = referrer;
  }

  public String getFbc() {
    return fbc;
  }

  public void setFbc(String fbc) {
    this.fbc = fbc;
  }

  public String getFbp() {
    return fbp;
  }

  public void setFbp(String fbp) {
    this.fbp = fbp;
  }

  public String getGclid() {
    return gclid;
  }

  public void setGclid(String gclid) {
    this.gclid = gclid;
  }

  public String getEventId() {
    return eventId;
  }

  public void setEventId(String eventId) {
    this.eventId = eventId;
  }

  public Instant getClickTime() {
    return clickTime;
  }

  public void setClickTime(Instant clickTime) {
    this.clickTime = clickTime;
  }

  public String getHashedEmail() {
    return hashedEmail;
  }

  public void setHashedEmail(String hashedEmail) {
    this.hashedEmail = hashedEmail;
  }

  public String getHashedPhone() {
    return hashedPhone;
  }

  public void setHashedPhone(String hashedPhone) {
    this.hashedPhone = hashedPhone;
  }

  // Builder Pattern Implementation
  public static PixelRequestContextBuilder builder() {
    return new PixelRequestContextBuilder();
  }

  public static class PixelRequestContextBuilder {
    private String linkId;
    private String shortCode;
    private String originalUrl;
    private String userId;
    private String ipAddress;
    private String userAgent;
    private String referrer;
    private String fbc;
    private String fbp;
    private String gclid;
    private String eventId;
    private Instant clickTime;
    private String hashedEmail;
    private String hashedPhone;

    public PixelRequestContextBuilder linkId(String linkId) {
      this.linkId = linkId;
      return this;
    }

    public PixelRequestContextBuilder shortCode(String shortCode) {
      this.shortCode = shortCode;
      return this;
    }

    public PixelRequestContextBuilder originalUrl(String originalUrl) {
      this.originalUrl = originalUrl;
      return this;
    }

    public PixelRequestContextBuilder userId(String userId) {
      this.userId = userId;
      return this;
    }

    public PixelRequestContextBuilder ipAddress(String ipAddress) {
      this.ipAddress = ipAddress;
      return this;
    }

    public PixelRequestContextBuilder userAgent(String userAgent) {
      this.userAgent = userAgent;
      return this;
    }

    public PixelRequestContextBuilder referrer(String referrer) {
      this.referrer = referrer;
      return this;
    }

    public PixelRequestContextBuilder fbc(String fbc) {
      this.fbc = fbc;
      return this;
    }

    public PixelRequestContextBuilder fbp(String fbp) {
      this.fbp = fbp;
      return this;
    }

    public PixelRequestContextBuilder gclid(String gclid) {
      this.gclid = gclid;
      return this;
    }

    public PixelRequestContextBuilder eventId(String eventId) {
      this.eventId = eventId;
      return this;
    }

    public PixelRequestContextBuilder clickTime(Instant clickTime) {
      this.clickTime = clickTime;
      return this;
    }

    public PixelRequestContextBuilder hashedEmail(String hashedEmail) {
      this.hashedEmail = hashedEmail;
      return this;
    }

    public PixelRequestContextBuilder hashedPhone(String hashedPhone) {
      this.hashedPhone = hashedPhone;
      return this;
    }

    public PixelRequestContext build() {
      return new PixelRequestContext(linkId, shortCode, originalUrl, userId, ipAddress, userAgent, referrer, fbc, fbp,
          gclid, eventId, clickTime, hashedEmail, hashedPhone);
    }
  }
}
