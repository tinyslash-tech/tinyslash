package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "employees")
public class Employee {

  @Id
  private String id;

  private String userId; // Link to User account

  private String firstName;
  private String lastName;
  private String email;
  private String phoneNumber;
  private String designation;
  private String department;
  private String status; // ACTIVE, ON_LEAVE, TERMINATED, RESIGNED
  private LocalDateTime joiningDate;

  // Transient field for role assignment during creation
  @org.springframework.data.annotation.Transient
  private java.util.Set<String> roles;

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public java.util.Set<String> getRoles() {
    return roles;
  }

  public void setRoles(java.util.Set<String> roles) {
    this.roles = roles;
  }

  // Salary Details
  private Double ctc; // Cost to Company
  private Double basicSalary;
  private String bankName;
  private String accountNumber;
  private String ifscCode;

  // Documents
  private List<EmployeeDocument> documents = new ArrayList<>();

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime updatedAt = LocalDateTime.now();
  private String createdBy; // Admin ID

  // Nested class for documents
  public static class EmployeeDocument {
    private String id;
    private String name;
    private String type; // SALARY_SLIP, ID_PROOF, OFFER_LETTER, ETC
    private String fileUrl;
    private LocalDateTime uploadedAt;
    private String uploadedBy;

    public EmployeeDocument() {
      this.id = java.util.UUID.randomUUID().toString();
      this.uploadedAt = LocalDateTime.now();
    }

    public EmployeeDocument(String name, String type, String fileUrl, String uploadedBy) {
      this();
      this.name = name;
      this.type = type;
      this.fileUrl = fileUrl;
      this.uploadedBy = uploadedBy;
    }

    // Getters and Setter
    public String getId() {
      return id;
    }

    public void setId(String id) {
      this.id = id;
    }

    public String getName() {
      return name;
    }

    public void setName(String name) {
      this.name = name;
    }

    public String getType() {
      return type;
    }

    public void setType(String type) {
      this.type = type;
    }

    public String getFileUrl() {
      return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
      this.fileUrl = fileUrl;
    }

    public LocalDateTime getUploadedAt() {
      return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt) {
      this.uploadedAt = uploadedAt;
    }

    public String getUploadedBy() {
      return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
      this.uploadedBy = uploadedBy;
    }
  }

  public Employee() {
  }

  // Getters and Setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
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

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public String getDesignation() {
    return designation;
  }

  public void setDesignation(String designation) {
    this.designation = designation;
  }

  public String getDepartment() {
    return department;
  }

  public void setDepartment(String department) {
    this.department = department;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public LocalDateTime getJoiningDate() {
    return joiningDate;
  }

  public void setJoiningDate(LocalDateTime joiningDate) {
    this.joiningDate = joiningDate;
  }

  public Double getCtc() {
    return ctc;
  }

  public void setCtc(Double ctc) {
    this.ctc = ctc;
  }

  public Double getBasicSalary() {
    return basicSalary;
  }

  public void setBasicSalary(Double basicSalary) {
    this.basicSalary = basicSalary;
  }

  public String getBankName() {
    return bankName;
  }

  public void setBankName(String bankName) {
    this.bankName = bankName;
  }

  public String getAccountNumber() {
    return accountNumber;
  }

  public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
  }

  public String getIfscCode() {
    return ifscCode;
  }

  public void setIfscCode(String ifscCode) {
    this.ifscCode = ifscCode;
  }

  public List<EmployeeDocument> getDocuments() {
    return documents;
  }

  public void setDocuments(List<EmployeeDocument> documents) {
    this.documents = documents;
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

  public String getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(String createdBy) {
    this.createdBy = createdBy;
  }

  public String getFullName() {
    return (firstName != null ? firstName : "") + " " + (lastName != null ? lastName : "");
  }
}
