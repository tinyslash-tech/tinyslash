package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;

@Document(collection = "leads")
public class Lead {
  @Id
  private String id;

  @Indexed
  private String linkId;

  @Indexed
  private String pageId;

  @Indexed
  private String ownerUserId;

  @Indexed
  private String qrCodeId;

  private String source = "LINK"; // LINK or QR or PAGE

  private String email;
  private String whatsapp;
  private String leadType; // EMAIL or WHATSAPP or FORM

  private boolean verified;
  private String otp; // Hashed/temporary
  private LocalDateTime otpExpiresAt;

  // Metadata
  private String ip;
  private String country;
  private String state;
  private String userAgent;
  private String referrer;

  private LocalDateTime createdAt = LocalDateTime.now();

  public Lead() {
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getLinkId() {
    return linkId;
  }

  public void setLinkId(String linkId) {
    this.linkId = linkId;
  }

  public String getPageId() {
    return pageId;
  }

  public void setPageId(String pageId) {
    this.pageId = pageId;
  }

  public String getOwnerUserId() {
    return ownerUserId;
  }

  public void setOwnerUserId(String ownerUserId) {
    this.ownerUserId = ownerUserId;
  }

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

  public boolean isVerified() {
    return verified;
  }

  public void setVerified(boolean verified) {
    this.verified = verified;
  }

  public String getOtp() {
    return otp;
  }

  public void setOtp(String otp) {
    this.otp = otp;
  }

  public LocalDateTime getOtpExpiresAt() {
    return otpExpiresAt;
  }

  public void setOtpExpiresAt(LocalDateTime otpExpiresAt) {
    this.otpExpiresAt = otpExpiresAt;
  }

  public String getIp() {
    return ip;
  }

  public void setIp(String ip) {
    this.ip = ip;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
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

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public String getQrCodeId() {
    return qrCodeId;
  }

  public void setQrCodeId(String qrCodeId) {
    this.qrCodeId = qrCodeId;
  }

  public String getSource() {
    return source;
  }

  public void setSource(String source) {
    this.source = source;
  }
}
