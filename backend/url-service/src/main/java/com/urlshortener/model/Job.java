package com.urlshortener.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Document(collection = "jobs")
public class Job {
  @Id
  private String id;
  private String title;
  private String department;
  private String location;
  private String type;
  private String experience;
  private String salary;
  private LocalDate postedDate;
  private Integer position;
  private String description;
  private List<String> responsibilities;
  private JobRequirements requirements;
  private List<String> benefits;

  public Job() {
  }

  public Job(String id, String title, String department, String location, String type, String experience, String salary,
      LocalDate postedDate, Integer position, String description, List<String> responsibilities,
      JobRequirements requirements, List<String> benefits) {
    this.id = id;
    this.title = title;
    this.department = department;
    this.location = location;
    this.type = type;
    this.experience = experience;
    this.salary = salary;
    this.postedDate = postedDate;
    this.position = position;
    this.description = description;
    this.responsibilities = responsibilities;
    this.requirements = requirements;
    this.benefits = benefits;
  }

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getDepartment() {
    return department;
  }

  public void setDepartment(String department) {
    this.department = department;
  }

  public String getLocation() {
    return location;
  }

  public void setLocation(String location) {
    this.location = location;
  }

  public String getType() {
    return type;
  }

  public void setType(String type) {
    this.type = type;
  }

  public String getExperience() {
    return experience;
  }

  public void setExperience(String experience) {
    this.experience = experience;
  }

  public String getSalary() {
    return salary;
  }

  public void setSalary(String salary) {
    this.salary = salary;
  }

  public LocalDate getPostedDate() {
    return postedDate;
  }

  public void setPostedDate(LocalDate postedDate) {
    this.postedDate = postedDate;
  }

  public Integer getPosition() {
    return position;
  }

  public void setPosition(Integer position) {
    this.position = position;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public List<String> getResponsibilities() {
    return responsibilities;
  }

  public void setResponsibilities(List<String> responsibilities) {
    this.responsibilities = responsibilities;
  }

  public JobRequirements getRequirements() {
    return requirements;
  }

  public void setRequirements(JobRequirements requirements) {
    this.requirements = requirements;
  }

  public List<String> getBenefits() {
    return benefits;
  }

  public void setBenefits(List<String> benefits) {
    this.benefits = benefits;
  }

  public static class JobRequirements {
    private List<String> mustHave;
    private List<String> niceToHave;

    public JobRequirements() {
    }

    public JobRequirements(List<String> mustHave, List<String> niceToHave) {
      this.mustHave = mustHave;
      this.niceToHave = niceToHave;
    }

    public List<String> getMustHave() {
      return mustHave;
    }

    public void setMustHave(List<String> mustHave) {
      this.mustHave = mustHave;
    }

    public List<String> getNiceToHave() {
      return niceToHave;
    }

    public void setNiceToHave(List<String> niceToHave) {
      this.niceToHave = niceToHave;
    }
  }
}
