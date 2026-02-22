package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Separated collection for Link Metrics on a Page.
 * Prevents Unbounded Map Growth inside PageAnalyticsSummary.
 */
@Document(collection = "page_link_metrics")
@CompoundIndex(name = "idx_page_date_hour_url", def = "{'pageId': 1, 'date': -1, 'hour': -1, 'linkUrl': 1}", unique = true)
public class PageLinkMetric {

  @Id
  private String id;

  @Indexed
  private String pageId;

  private String date; // YYYY-MM-DD
  private int hour; // 0-23

  @Indexed
  private String linkUrl;

  private long clickCount = 0;

  public PageLinkMetric() {
  }

  public PageLinkMetric(String pageId, String date, int hour, String linkUrl) {
    this.pageId = pageId;
    this.date = date;
    this.hour = hour;
    this.linkUrl = linkUrl;
  }

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

  public String getDate() {
    return date;
  }

  public void setDate(String date) {
    this.date = date;
  }

  public int getHour() {
    return hour;
  }

  public void setHour(int hour) {
    this.hour = hour;
  }

  public String getLinkUrl() {
    return linkUrl;
  }

  public void setLinkUrl(String linkUrl) {
    this.linkUrl = linkUrl;
  }

  public long getClickCount() {
    return clickCount;
  }

  public void setClickCount(long clickCount) {
    this.clickCount = clickCount;
  }
}
