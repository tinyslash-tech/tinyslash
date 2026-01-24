package com.urlshortener.dto;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;

public class RiskAnalysis {

  private int riskScore = 0;

  private final Set<String> violations = new LinkedHashSet<>();
  private final Set<String> checksPerformed = new LinkedHashSet<>();
  private final Map<String, Integer> riskBreakdown = new LinkedHashMap<>();

  private boolean whitelisted = false;

  public boolean isWhitelisted() {
    return whitelisted;
  }

  public void setWhitelisted(boolean whitelisted) {
    this.whitelisted = whitelisted;
  }

  public void addViolation(String violation) {
    violations.add(violation);
  }

  public void addCheckPerformed(String checkName) {
    checksPerformed.add(checkName);
  }

  public void addRiskScore(String reason, int score) {
    riskBreakdown.merge(reason, score, Integer::sum);
    riskScore = Math.max(0, riskScore + score);
  }

  public int getRiskScore() {
    return riskScore;
  }

  public Set<String> getViolations() {
    return Collections.unmodifiableSet(violations);
  }

  public Set<String> getChecksPerformed() {
    return Collections.unmodifiableSet(checksPerformed);
  }

  public Map<String, Integer> getRiskBreakdown() {
    return Collections.unmodifiableMap(riskBreakdown);
  }

  public String summary() {
    return "RiskScore=" + riskScore +
           ", Violations=" + violations +
           ", Breakdown=" + riskBreakdown;
  }
}

