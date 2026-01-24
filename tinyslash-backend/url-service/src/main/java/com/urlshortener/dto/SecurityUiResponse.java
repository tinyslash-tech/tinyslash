package com.urlshortener.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

// Using plain getters/setters if Lombok is not fully configured, 
// but assuming Lombok is present based on standard Spring conventions.
// If compilation fails, I will revert to standard POJO.

public class SecurityUiResponse {
  private String title;
  private String message; // Primary Message
  private String secondaryMessage; // "Supportive Line" or explanation
  private String localizedMessage; // For future/current simple English
  private String uiType; // ERROR, WARNING, INFO
  private String uiErrorCode; // e.g., TS-BLOCK-001
  private boolean allowed;

  public SecurityUiResponse() {
  }

  public SecurityUiResponse(String title, String message, String secondaryMessage, String uiType, String uiErrorCode,
      boolean allowed) {
    this.title = title;
    this.message = message;
    this.secondaryMessage = secondaryMessage;
    this.uiType = uiType;
    this.uiErrorCode = uiErrorCode;
    this.allowed = allowed;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }

  public String getSecondaryMessage() {
    return secondaryMessage;
  }

  public void setSecondaryMessage(String secondaryMessage) {
    this.secondaryMessage = secondaryMessage;
  }

  public String getUiType() {
    return uiType;
  }

  public void setUiType(String uiType) {
    this.uiType = uiType;
  }

  public String getUiErrorCode() {
    return uiErrorCode;
  }

  public void setUiErrorCode(String uiErrorCode) {
    this.uiErrorCode = uiErrorCode;
  }

  public boolean isAllowed() {
    return allowed;
  }

  public void setAllowed(boolean allowed) {
    this.allowed = allowed;
  }
}
