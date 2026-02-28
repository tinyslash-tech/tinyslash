package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "client_accesses")
public class ClientAccess {

  @Id
  private String id;

  @Indexed(unique = true)
  private String clientId; // The user ID of the client

  @Indexed
  private String agencyUserId; // The user ID of the agency owner who invited them

  private List<String> allowedPageIds = new ArrayList<>();

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();

  public ClientAccess() {
  }

  public ClientAccess(String clientId, String agencyUserId, List<String> allowedPageIds) {
    this.clientId = clientId;
    this.agencyUserId = agencyUserId;
    this.allowedPageIds = allowedPageIds != null ? allowedPageIds : new ArrayList<>();
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getClientId() {
    return clientId;
  }

  public void setClientId(String clientId) {
    this.clientId = clientId;
  }

  public String getAgencyUserId() {
    return agencyUserId;
  }

  public void setAgencyUserId(String agencyUserId) {
    this.agencyUserId = agencyUserId;
  }

  public List<String> getAllowedPageIds() {
    return allowedPageIds;
  }

  public void setAllowedPageIds(List<String> allowedPageIds) {
    this.allowedPageIds = allowedPageIds;
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
