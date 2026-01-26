package com.urlshortener.dto;

public class LeadVerifyRequest {
  private String email;
  private String whatsapp;
  private String otp;

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

  public String getOtp() {
    return otp;
  }

  public void setOtp(String otp) {
    this.otp = otp;
  }
}
