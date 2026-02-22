package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import java.time.Instant;

@Document(collection = "wa_interactions")
@CompoundIndexes({
    @CompoundIndex(name = "page_timestamp_idx", def = "{'pageId': 1, 'createdAt': -1}"),
    @CompoundIndex(name = "page_link_idx", def = "{'pageId': 1, 'linkId': 1}")
})
public class WAInteraction {
  @Id
  private String id;

  private String pageId;
  private String linkId; // Nullable
  private String linkLabelSnapshot;
  private String visitorId;
  private boolean hadLinkContext; // true if tapped after link click, false if direct

  // Geo/Device Data
  private String country;
  private String city;
  private String deviceType; // MOBILE, TABLET, DESKTOP
  private String refererType; // INSTAGRAM, LINKEDIN, WHATSAPP, DIRECT, OTHER

  @Indexed(expireAfterSeconds = 7776000) // TTL 90 days
  private Instant createdAt = Instant.now();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getPageId() {
    return pageId;
  }

  public void setPageId(String pageId) {
    this.pageId = pageId;
  }

  public String getLinkId() {
    return linkId;
  }

  public void setLinkId(String linkId) {
    this.linkId = linkId;
  }

  public String getLinkLabelSnapshot() {
    return linkLabelSnapshot;
  }

  public void setLinkLabelSnapshot(String linkLabelSnapshot) {
    this.linkLabelSnapshot = linkLabelSnapshot;
  }

  public String getVisitorId() {
    return visitorId;
  }

  public void setVisitorId(String visitorId) {
    this.visitorId = visitorId;
  }

  public boolean isHadLinkContext() {
    return hadLinkContext;
  }

  public void setHadLinkContext(boolean hadLinkContext) {
    this.hadLinkContext = hadLinkContext;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getDeviceType() {
    return deviceType;
  }

  public void setDeviceType(String deviceType) {
    this.deviceType = deviceType;
  }

  public String getRefererType() {
    return refererType;
  }

  public void setRefererType(String refererType) {
    this.refererType = refererType;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }
}
