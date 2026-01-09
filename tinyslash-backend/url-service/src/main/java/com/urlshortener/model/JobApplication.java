package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "job_applications")
public class JobApplication {
  @Id
  private String id;
  private String jobId;
  private String jobTitle; // Denormalized for convenient listing
  private String firstName;
  private String lastName;
  private String email;
  private String phone;
  private String resumeUrl;
  private String portfolioUrl;
  private String linkedinUrl;
  private ApplicationStatus status = ApplicationStatus.APPLIED;
  private LocalDateTime appliedAt = LocalDateTime.now();

  public JobApplication() {
  }

  public JobApplication(String id, String jobId, String jobTitle, String firstName, String lastName, String email,
      String phone, String resumeUrl, String portfolioUrl, String linkedinUrl, ApplicationStatus status,
      LocalDateTime appliedAt) {
    this.id = id;
    this.jobId = jobId;
    this.jobTitle = jobTitle;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.resumeUrl = resumeUrl;
    this.portfolioUrl = portfolioUrl;
    this.linkedinUrl = linkedinUrl;
    this.status = status;
    this.appliedAt = appliedAt;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getJobId() {
    return jobId;
  }

  public void setJobId(String jobId) {
    this.jobId = jobId;
  }

  public String getJobTitle() {
    return jobTitle;
  }

  public void setJobTitle(String jobTitle) {
    this.jobTitle = jobTitle;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public String getResumeUrl() {
    return resumeUrl;
  }

  public void setResumeUrl(String resumeUrl) {
    this.resumeUrl = resumeUrl;
  }

  public String getPortfolioUrl() {
    return portfolioUrl;
  }

  public void setPortfolioUrl(String portfolioUrl) {
    this.portfolioUrl = portfolioUrl;
  }

  public String getLinkedinUrl() {
    return linkedinUrl;
  }

  public void setLinkedinUrl(String linkedinUrl) {
    this.linkedinUrl = linkedinUrl;
  }

  public ApplicationStatus getStatus() {
    return status;
  }

  public void setStatus(ApplicationStatus status) {
    this.status = status;
  }

  public LocalDateTime getAppliedAt() {
    return appliedAt;
  }

  public void setAppliedAt(LocalDateTime appliedAt) {
    this.appliedAt = appliedAt;
  }

  public enum ApplicationStatus {
    APPLIED,
    SCREENING,
    INTERVIEW,
    OFFER,
    REJECTED,
    HIRED
  }
}
