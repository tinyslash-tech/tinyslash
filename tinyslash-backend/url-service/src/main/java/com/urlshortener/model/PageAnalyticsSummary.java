package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashMap;
import java.util.Map;

/**
 * Aggregated analytics for a page, grouped by Date and Hour.
 * This is the permanent storage for analytics, optimized for fast dashboard
 * queries.
 */
@Document(collection = "page_analytics_summaries")
@CompoundIndex(name = "idx_page_date_hour", def = "{'pageId': 1, 'date': -1, 'hour': -1}", unique = true)
public class PageAnalyticsSummary {

  @Id
  private String id;

  @Indexed
  private String pageId;

  private String date; // YYYY-MM-DD
  private int hour; // 0-23

  // Views & Sessions
  private long totalViews = 0;
  private long uniqueVisitors = 0; // Requires distinct count during aggregation or HyperLogLog, usually we just
                                   // keep a Set of visitorIds or an estimate if scale is huge. We will aggregate
                                   // this hourly.
  private long returningVisitors = 0;

  // Scroll Depth Counts
  private long scroll25Count = 0;
  private long scroll50Count = 0;
  private long scroll75Count = 0;
  private long scroll100Count = 0;

  // Categorized Dimension Splits
  private Map<String, Long> deviceSplit = new HashMap<>(); // MOBILE, DESKTOP, TABLET
  private Map<String, Long> browserSplit = new HashMap<>(); // Chrome, Safari, etc
  private Map<String, Long> osSplit = new HashMap<>(); // iOS, Android, Windows
  private Map<String, Long> countrySplit = new HashMap<>(); // IN, US, UK
  private Map<String, Long> citySplit = new HashMap<>(); // Mumbai, Delhi, etc.

  // Traffic Sources (Categorized)
  private Map<String, Long> trafficSources = new HashMap<>(); // Direct, Instagram, WhatsApp, etc.
  private Map<String, Long> utmCampaigns = new HashMap<>();

  public PageAnalyticsSummary() {
  }

  public PageAnalyticsSummary(String pageId, String date, int hour) {
    this.pageId = pageId;
    this.date = date;
    this.hour = hour;
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

  public long getTotalViews() {
    return totalViews;
  }

  public void setTotalViews(long totalViews) {
    this.totalViews = totalViews;
  }

  public long getUniqueVisitors() {
    return uniqueVisitors;
  }

  public void setUniqueVisitors(long uniqueVisitors) {
    this.uniqueVisitors = uniqueVisitors;
  }

  public long getReturningVisitors() {
    return returningVisitors;
  }

  public void setReturningVisitors(long returningVisitors) {
    this.returningVisitors = returningVisitors;
  }

  public long getScroll25Count() {
    return scroll25Count;
  }

  public void setScroll25Count(long scroll25Count) {
    this.scroll25Count = scroll25Count;
  }

  public long getScroll50Count() {
    return scroll50Count;
  }

  public void setScroll50Count(long scroll50Count) {
    this.scroll50Count = scroll50Count;
  }

  public long getScroll75Count() {
    return scroll75Count;
  }

  public void setScroll75Count(long scroll75Count) {
    this.scroll75Count = scroll75Count;
  }

  public long getScroll100Count() {
    return scroll100Count;
  }

  public void setScroll100Count(long scroll100Count) {
    this.scroll100Count = scroll100Count;
  }

  public Map<String, Long> getDeviceSplit() {
    return deviceSplit;
  }

  public void setDeviceSplit(Map<String, Long> deviceSplit) {
    this.deviceSplit = deviceSplit;
  }

  public Map<String, Long> getBrowserSplit() {
    return browserSplit;
  }

  public void setBrowserSplit(Map<String, Long> browserSplit) {
    this.browserSplit = browserSplit;
  }

  public Map<String, Long> getOsSplit() {
    return osSplit;
  }

  public void setOsSplit(Map<String, Long> osSplit) {
    this.osSplit = osSplit;
  }

  public Map<String, Long> getCountrySplit() {
    return countrySplit;
  }

  public void setCountrySplit(Map<String, Long> countrySplit) {
    this.countrySplit = countrySplit;
  }

  public Map<String, Long> getCitySplit() {
    return citySplit;
  }

  public void setCitySplit(Map<String, Long> citySplit) {
    this.citySplit = citySplit;
  }

  public Map<String, Long> getTrafficSources() {
    return trafficSources;
  }

  public void setTrafficSources(Map<String, Long> trafficSources) {
    this.trafficSources = trafficSources;
  }

  public Map<String, Long> getUtmCampaigns() {
    return utmCampaigns;
  }

  public void setUtmCampaigns(Map<String, Long> utmCampaigns) {
    this.utmCampaigns = utmCampaigns;
  }
}
