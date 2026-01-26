package com.urlshortener.dto;

public class LeadCaptureRequest {
  private String email;
  private String whatsapp;
  private String leadType; // EMAIL, WHATSAPP, BOTH

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getWhatsapp() {
    return whatsapp;
  }

  public void setWhatsapp(String whatsapp) {
    this.whatsapp = whatsapp;
  }

  public String getLeadType() {
    return leadType;
  }

  public void setLeadType(String leadType) {
    this.leadType = leadType;
  }
}
