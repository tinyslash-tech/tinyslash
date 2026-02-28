package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "creator_schedules")
public class CreatorSchedule {

  @Id
  private String id;

  @Indexed(unique = true)
  private String userId;

  private String timezone; // e.g., "Asia/Kolkata"

  // Key: "MONDAY", "TUESDAY", etc. Value: List of TimeWindows
  private Map<String, List<TimeWindow>> weeklyHours;

  private List<String> blockedDates; // e.g., ["2026-12-25"]

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public static class TimeWindow {
    private String start; // e.g., "09:00"
    private String end; // e.g., "17:00"

    public TimeWindow() {
    }

    public TimeWindow(String start, String end) {
      this.start = start;
      this.end = end;
    }

    public String getStart() {
      return start;
    }

    public void setStart(String start) {
      this.start = start;
    }

    public String getEnd() {
      return end;
    }

    public void setEnd(String end) {
      this.end = end;
    }
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getTimezone() {
    return timezone;
  }

  public void setTimezone(String timezone) {
    this.timezone = timezone;
  }

  public Map<String, List<TimeWindow>> getWeeklyHours() {
    return weeklyHours;
  }

  public void setWeeklyHours(Map<String, List<TimeWindow>> weeklyHours) {
    this.weeklyHours = weeklyHours;
  }

  public List<String> getBlockedDates() {
    return blockedDates;
  }

  public void setBlockedDates(List<String> blockedDates) {
    this.blockedDates = blockedDates;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }
}
