package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "otp_tokens")
public class OtpToken {

  @Id
  private String id;

  @Indexed
  private String email;

  private String otpCode; // Since it expires quickly, plaintext or lightweight hash is acceptable.

  @Indexed(expireAfterSeconds = 0)
  private LocalDateTime expiresAt;

  private LocalDateTime createdAt = LocalDateTime.now();

  public OtpToken() {
  }

  public OtpToken(String email, String otpCode, int expirationMinutes) {
    this.email = email;
    this.otpCode = otpCode;
    this.expiresAt = LocalDateTime.now().plusMinutes(expirationMinutes);
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getOtpCode() {
    return otpCode;
  }

  public void setOtpCode(String otpCode) {
    this.otpCode = otpCode;
  }

  public LocalDateTime getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(LocalDateTime expiresAt) {
    this.expiresAt = expiresAt;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }
}
