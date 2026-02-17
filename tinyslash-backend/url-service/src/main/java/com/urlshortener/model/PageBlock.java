package com.urlshortener.model;

import lombok.AllArgsConstructor;
import java.util.Map;
import java.util.UUID;

public class PageBlock {
  private String id = UUID.randomUUID().toString();
  private BlockType type;
  private Map<String, Object> content;
  private boolean visible = true;
  private int order;

  public PageBlock() {
  }

  public PageBlock(String id, BlockType type, Map<String, Object> content, boolean visible, int order) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.visible = visible;
    this.order = order;
  }

  public enum BlockType {
    LINK,
    HEADER,
    IMAGE,
    SOCIAL,
    TEXT,
    VIDEO,
    FORM,
    EMAIL,
    DIVIDER,
    PAYMENT,
    AFFILIATE,
    CARD
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public BlockType getType() {
    return type;
  }

  public void setType(BlockType type) {
    this.type = type;
  }

  public Map<String, Object> getContent() {
    return content;
  }

  public void setContent(Map<String, Object> content) {
    this.content = content;
  }

  public boolean isVisible() {
    return visible;
  }

  public void setVisible(boolean visible) {
    this.visible = visible;
  }

  public int getOrder() {
    return order;
  }

  public void setOrder(int order) {
    this.order = order;
  }
}
