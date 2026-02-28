package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import java.time.Instant;
import java.time.LocalDateTime;

@Document(collection = "bookings")
@CompoundIndexes({
    @CompoundIndex(name = "creator_date_status_idx", def = "{'creatorId': 1, 'bookingDate': 1, 'status': 1}")
})
public class Booking {

  @Id
  private String id;

  private String creatorId;
  @Indexed
  private String pageId;
  private String blockId;
  private String customerOrderId;

  private String customerName;
  private String customerEmail;

  private String bookingDate; // e.g. "2026-12-25"
  private Instant bookingStartUtc;
  private Instant bookingEndUtc;
  private String creatorTimezone;

  @Indexed(unique = true)
  private String slotLockKey;

  private String status = "PENDING"; // PENDING, CONFIRMED, CANCELLED

  @Indexed(expireAfterSeconds = 0)
  private Instant expiresAt; // TTL index for abandoned checkouts

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getCreatorId() {
    return creatorId;
  }

  public void setCreatorId(String creatorId) {
    this.creatorId = creatorId;
  }

  public String getPageId() {
    return pageId;
  }

  public void setPageId(String pageId) {
    this.pageId = pageId;
  }

  public String getBlockId() {
    return blockId;
  }

  public void setBlockId(String blockId) {
    this.blockId = blockId;
  }

  public String getCustomerOrderId() {
    return customerOrderId;
  }

  public void setCustomerOrderId(String customerOrderId) {
    this.customerOrderId = customerOrderId;
  }

  public String getCustomerName() {
    return customerName;
  }

  public void setCustomerName(String customerName) {
    this.customerName = customerName;
  }

  public String getCustomerEmail() {
    return customerEmail;
  }

  public void setCustomerEmail(String customerEmail) {
    this.customerEmail = customerEmail;
  }

  public String getBookingDate() {
    return bookingDate;
  }

  public void setBookingDate(String bookingDate) {
    this.bookingDate = bookingDate;
  }

  public Instant getBookingStartUtc() {
    return bookingStartUtc;
  }

  public void setBookingStartUtc(Instant bookingStartUtc) {
    this.bookingStartUtc = bookingStartUtc;
  }

  public Instant getBookingEndUtc() {
    return bookingEndUtc;
  }

  public void setBookingEndUtc(Instant bookingEndUtc) {
    this.bookingEndUtc = bookingEndUtc;
  }

  public String getCreatorTimezone() {
    return creatorTimezone;
  }

  public void setCreatorTimezone(String creatorTimezone) {
    this.creatorTimezone = creatorTimezone;
  }

  public String getSlotLockKey() {
    return slotLockKey;
  }

  public void setSlotLockKey(String slotLockKey) {
    this.slotLockKey = slotLockKey;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public void setExpiresAt(Instant expiresAt) {
    this.expiresAt = expiresAt;
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
