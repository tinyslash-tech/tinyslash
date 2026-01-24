package com.urlshortener.dto;

public class SecurityDecision {
  public enum Decision {
    ALLOW,
    WARN,
    BLOCK,
    BLOCK_TEMP
  }

  private Decision decision;
  private String reason;
  private String message;
  private int riskScore;
  private RiskAnalysis riskAnalysis;

  public SecurityDecision(Decision decision, String reason, String message, int riskScore, RiskAnalysis riskAnalysis) {
    this.decision = decision;
    this.reason = reason;
    this.message = message;
    this.riskScore = riskScore;
    this.riskAnalysis = riskAnalysis;
  }

  // Static Factories
  public static SecurityDecision allow(int riskScore, RiskAnalysis analysis) {
    return new SecurityDecision(Decision.ALLOW, null, "URL passed safety checks", riskScore, analysis);
  }

  public static SecurityDecision warn(int riskScore, RiskAnalysis analysis) {
    return new SecurityDecision(Decision.WARN, "potential_risk", "Potentially unsafe URL", riskScore, analysis);
  }

  public static SecurityDecision block(String reason, String message, int riskScore, RiskAnalysis analysis) {
    return new SecurityDecision(Decision.BLOCK, reason, message, riskScore, analysis);
  }

  // Getters
  public Decision getDecision() {
    return decision;
  }

  public String getReason() {
    return reason;
  }

  public String getMessage() {
    return message;
  }

  public int getRiskScore() {
    return riskScore;
  }

  public RiskAnalysis getRiskAnalysis() {
    return riskAnalysis;
  }
}
