package com.urlshortener.service;

import com.urlshortener.model.Job;
import com.urlshortener.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

  @Autowired
  private JobRepository jobRepository;

  public List<Job> getAllJobs() {
    return jobRepository.findAllByOrderByPositionAsc();
  }

  public Optional<Job> getJobById(String id) {
    return jobRepository.findById(id);
  }

  public Job createJob(Job job) {
    if (job.getPostedDate() == null) {
      job.setPostedDate(LocalDate.now());
    }
    // Default position if null? Maybe 0 or max+1. For now let it be as passed or
    // null (sorted first or last depending on db)
    // If we want 0 to be bottom, allow user to set it.
    if (job.getPosition() == null) {
      job.setPosition(0);
    }
    return jobRepository.save(job);
  }

  public Job updateJob(String id, Job jobDetails) {
    Job job = jobRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

    job.setTitle(jobDetails.getTitle());
    job.setDepartment(jobDetails.getDepartment());
    job.setLocation(jobDetails.getLocation());
    job.setType(jobDetails.getType());
    job.setExperience(jobDetails.getExperience());
    job.setSalary(jobDetails.getSalary());
    job.setDescription(jobDetails.getDescription());
    job.setResponsibilities(jobDetails.getResponsibilities());
    job.setRequirements(jobDetails.getRequirements());
    job.setBenefits(jobDetails.getBenefits());
    job.setPosition(jobDetails.getPosition());
    // Do not update postedDate unless necessary, keeping original date usually best

    return jobRepository.save(job);
  }

  public void deleteJob(String id) {
    jobRepository.deleteById(id);
  }
}
