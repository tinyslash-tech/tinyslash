package com.urlshortener.dto;

public class AIFieldGenerateRequest {

  private String category;
  private String prompt;
  private String fieldName;

  public AIFieldGenerateRequest() {
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

  public String getFieldName() {
    return fieldName;
  }

  public void setFieldName(String fieldName) {
    this.fieldName = fieldName;
  }
}
