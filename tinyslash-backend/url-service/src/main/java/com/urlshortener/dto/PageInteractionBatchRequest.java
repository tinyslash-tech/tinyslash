package com.urlshortener.dto;

import java.util.List;
import java.util.Map;

public class PageInteractionBatchRequest {

  private String sessionId;
  private String visitorId;

  // e.g., "DESKTOP", "MOBILE", OS, Browser passed from frontend detection / UA
  // logic if available
  private String deviceType;
  private String os;
  private String browser;

  // UTM / Source overrides if needed
  private String utmSource;
  private String utmMedium;
  private String utmCampaign;
  private String refererType;

  private List<InteractionDto> interactions;

  public static class InteractionDto {
    private String type; // SCROLL, CLICK
    private Map<String, Object> meta;

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

  public String getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(String deviceType) {
    this.deviceType = deviceType;
  }

  public String getOs() {
    return os;
  }

  public void setOs(String os) {
    this.os = os;
  }

  public String getBrowser() {
    return browser;
  }

  public void setBrowser(String browser) {
    this.browser = browser;
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

  public String getRefererType() {
    return refererType;
  }

  public void setRefererType(String refererType) {
    this.refererType = refererType;
  }

  public List<InteractionDto> getInteractions() {
    return interactions;
  }

  public void setInteractions(List<InteractionDto> interactions) {
    this.interactions = interactions;
  }
}
