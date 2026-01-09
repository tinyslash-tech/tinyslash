package com.urlshortener.controller;

import com.urlshortener.model.Job;
import com.urlshortener.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class JobController {

  @Autowired
  private JobService jobService;

  // Public endpoint for frontend
  @GetMapping("/public/jobs")
  public List<Job> getAllPublicJobs() {
    return jobService.getAllJobs();
  }

  // Admin endpoints
  @GetMapping("/admin/jobs")
  @PreAuthorize("hasRole('ADMIN')")
  public List<Job> getAllJobs() {
    return jobService.getAllJobs();
  }

  @GetMapping("/admin/jobs/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Job> getJobById(@PathVariable String id) {
    return jobService.getJobById(id)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @PostMapping("/admin/jobs")
  @PreAuthorize("hasRole('ADMIN')")
  public Job createJob(@RequestBody Job job) {
    return jobService.createJob(job);
  }

  @PutMapping("/admin/jobs/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Job> updateJob(@PathVariable String id, @RequestBody Job jobDetails) {
    try {
      return ResponseEntity.ok(jobService.updateJob(id, jobDetails));
    } catch (RuntimeException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @DeleteMapping("/admin/jobs/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> deleteJob(@PathVariable String id) {
    jobService.deleteJob(id);
    return ResponseEntity.ok().build();
  }
}
