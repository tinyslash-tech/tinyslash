package com.urlshortener.dto;

public class WAInteractionResponse {
  private String redirectUrl;

  public WAInteractionResponse() {
  }

  public WAInteractionResponse(String redirectUrl) {
    this.redirectUrl = redirectUrl;
  }

  public String getRedirectUrl() {
    return redirectUrl;
  }

  public void setRedirectUrl(String redirectUrl) {
    this.redirectUrl = redirectUrl;
  }
}
