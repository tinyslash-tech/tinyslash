package com.urlshortener.dto;

public class AIGenerateRequest {

  private String category;
  private String prompt;

  public AIGenerateRequest() {
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getPrompt() {
    return prompt;
  }

  public void setPrompt(String prompt) {
    this.prompt = prompt;
  }
}
