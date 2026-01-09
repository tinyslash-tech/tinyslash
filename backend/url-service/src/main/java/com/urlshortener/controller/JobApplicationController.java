package com.urlshortener.controller;

import com.urlshortener.model.JobApplication;
import com.urlshortener.service.JobApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class JobApplicationController {

  @Autowired
  private JobApplicationService jobApplicationService;

  // Public submission
  @PostMapping(value = "/public/applications", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<JobApplication> submitApplication(
      @RequestParam("application") String applicationJson,
      @RequestParam(value = "resume", required = false) MultipartFile resume) {
    try {
      ObjectMapper mapper = new ObjectMapper();
      JobApplication application = mapper.readValue(applicationJson, JobApplication.class);
      return ResponseEntity.ok(jobApplicationService.submitApplication(application, resume));
    } catch (IOException e) {
      return ResponseEntity.badRequest().build();
    }
  }

  // Admin endpoints
  @GetMapping("/admin/applications/job/{jobId}")
  @PreAuthorize("hasRole('ADMIN')")
  public List<JobApplication> getApplicationsByJob(@PathVariable String jobId) {
    return jobApplicationService.getApplicationsByJobId(jobId);
  }

  @GetMapping("/admin/applications")
  @PreAuthorize("hasRole('ADMIN')")
  public List<JobApplication> getAllApplications() {
    return jobApplicationService.getAllApplications();
  }

  @PutMapping("/admin/applications/{id}/status")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<JobApplication> updateStatus(@PathVariable String id, @RequestBody String status) {
    // Status comes as a raw string or JSON string, handling simple value
    String cleanStatus = status.replace("\"", "").trim();
    return ResponseEntity
        .ok(jobApplicationService.updateStatus(id, JobApplication.ApplicationStatus.valueOf(cleanStatus)));
  }

  @GetMapping("/admin/applications/resume/{fileId}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Resource> downloadResume(@PathVariable String fileId) {
    try {
      Resource resource = jobApplicationService.getResume(fileId);

      MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
      try {
        // Try to determine media type from filename
        mediaType = org.springframework.http.MediaTypeFactory
            .getMediaType(resource)
            .orElse(MediaType.APPLICATION_OCTET_STREAM);
      } catch (Exception e) {
        // ignore
      }

      return ResponseEntity.ok()
          .contentType(mediaType)
          .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
          .body(resource);
    } catch (Exception e) {
      return ResponseEntity.notFound().build();
    }
  }
}
