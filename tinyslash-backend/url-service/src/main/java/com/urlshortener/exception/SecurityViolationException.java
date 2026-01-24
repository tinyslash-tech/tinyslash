package com.urlshortener.exception;

public class SecurityViolationException extends RuntimeException {
  private final String reason;
  private final int riskScore;
  private final String uiErrorCode;

  public SecurityViolationException(String reason, int riskScore, String uiErrorCode) {
    super("Security Violation: " + reason);
    this.reason = reason;
    this.riskScore = riskScore;
    this.uiErrorCode = uiErrorCode;
  }

  public String getReason() {
    return reason;
  }

  public int getRiskScore() {
    return riskScore;
  }

  public String getUiErrorCode() {
    return uiErrorCode;
  }
}
