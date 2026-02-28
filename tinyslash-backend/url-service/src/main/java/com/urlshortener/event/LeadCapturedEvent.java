package com.urlshortener.event;

import org.springframework.context.ApplicationEvent;

public class LeadCapturedEvent extends ApplicationEvent {
  private final String leadId;
  private final String pageId;
  private final String name;
  private final String email;
  private final String ownerId;

  public LeadCapturedEvent(Object source, String leadId, String pageId, String name, String email, String ownerId) {
    super(source);
    this.leadId = leadId;
    this.pageId = pageId;
    this.name = name;
    this.email = email;
    this.ownerId = ownerId;
  }

  public String getLeadId() {
    return leadId;
  }

  public String getPageId() {
    return pageId;
  }

  public String getName() {
    return name;
  }

  public String getEmail() {
    return email;
  }

  public String getOwnerId() {
    return ownerId;
  }
}
