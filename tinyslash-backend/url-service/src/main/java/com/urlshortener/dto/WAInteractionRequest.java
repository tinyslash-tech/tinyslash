package com.urlshortener.dto;

public class WAInteractionRequest {
  private String linkId;
  private String visitorId;

  public String getLinkId() {
    return linkId;
  }

  public void setLinkId(String linkId) {
    this.linkId = linkId;
  }

  public String getVisitorId() {
    return visitorId;
  }

  public void setVisitorId(String visitorId) {
    this.visitorId = visitorId;
  }
}
