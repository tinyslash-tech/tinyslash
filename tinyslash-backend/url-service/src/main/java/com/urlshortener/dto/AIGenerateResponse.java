package com.urlshortener.dto;

import java.util.List;

public class AIGenerateResponse {

  private String headline;
  private String bio;
  private String primaryCta;
  private String secondaryCta;
  private List<String> linkSuggestions; // Kept for backwards compatibility
  private List<java.util.Map<String, Object>> socialLinks;
  private List<java.util.Map<String, Object>> blocks;
  private String metaTitle;
  private String metaDescription;
  private String waDefaultMessage;

  private String theme;

  public AIGenerateResponse() {
  }

  public String getHeadline() {
    return headline;
  }

  public void setHeadline(String headline) {
    this.headline = headline;
  }

  public String getBio() {
    return bio;
  }

  public void setBio(String bio) {
    this.bio = bio;
  }

  public String getPrimaryCta() {
    return primaryCta;
  }

  public void setPrimaryCta(String primaryCta) {
    this.primaryCta = primaryCta;
  }

  public String getSecondaryCta() {
    return secondaryCta;
  }

  public void setSecondaryCta(String secondaryCta) {
    this.secondaryCta = secondaryCta;
  }

  public List<String> getLinkSuggestions() {
    return linkSuggestions;
  }

  public void setLinkSuggestions(List<String> linkSuggestions) {
    this.linkSuggestions = linkSuggestions;
  }

  public List<java.util.Map<String, Object>> getSocialLinks() {
    return socialLinks;
  }

  public void setSocialLinks(List<java.util.Map<String, Object>> socialLinks) {
    this.socialLinks = socialLinks;
  }

  public List<java.util.Map<String, Object>> getBlocks() {
    return blocks;
  }

  public void setBlocks(List<java.util.Map<String, Object>> blocks) {
    this.blocks = blocks;
  }

  public String getMetaTitle() {
    return metaTitle;
  }

  public void setMetaTitle(String metaTitle) {
    this.metaTitle = metaTitle;
  }

  public String getMetaDescription() {
    return metaDescription;
  }

  public void setMetaDescription(String metaDescription) {
    this.metaDescription = metaDescription;
  }

  public String getWaDefaultMessage() {
    return waDefaultMessage;
  }

  public void setWaDefaultMessage(String waDefaultMessage) {
    this.waDefaultMessage = waDefaultMessage;
  }

  public String getTheme() {
    return theme;
  }

  public void setTheme(String theme) {
    this.theme = theme;
  }
}
