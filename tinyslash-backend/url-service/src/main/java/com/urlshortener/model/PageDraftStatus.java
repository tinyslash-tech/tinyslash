package com.urlshortener.model;

public enum PageDraftStatus {
  DRAFT, // Actively being edited, not submitted yet
  PENDING, // Submitted for client approval
  APPROVED, // Approved by client (and subsequently merged)
  REJECTED, // Rejected by client with feedback
  SUPERSEDED // Replaced by a newer draft before action could be taken
}
