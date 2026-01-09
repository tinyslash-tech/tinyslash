package com.urlshortener.service;

import com.urlshortener.model.JobApplication;
import com.urlshortener.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class JobApplicationService {

  @Autowired
  private JobApplicationRepository jobApplicationRepository;

  @Autowired
  private GridFsTemplate gridFsTemplate;

  public JobApplication submitApplication(JobApplication application, MultipartFile resume) {
    try {
      if (resume != null && !resume.isEmpty()) {
        ObjectId fileId = gridFsTemplate.store(
            resume.getInputStream(),
            "resume_" + System.currentTimeMillis() + "_" + resume.getOriginalFilename(),
            resume.getContentType());
        // We store the GridFS File ID as the URL for internal retrieval, or construct a
        // download URL
        // For simplicity, let's store the File ID. The controller can expose a download
        // endpoint.
        application.setResumeUrl(fileId.toString());
      }
      return jobApplicationRepository.save(application);
    } catch (IOException e) {
      throw new RuntimeException("Failed to store resume", e);
    }
  }

  public List<JobApplication> getApplicationsByJobId(String jobId) {
    return jobApplicationRepository.findByJobId(jobId);
  }

  public List<JobApplication> getAllApplications() {
    return jobApplicationRepository.findAllByOrderByAppliedAtDesc();
  }

  public JobApplication updateStatus(String id, JobApplication.ApplicationStatus status) {
    JobApplication application = jobApplicationRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Application not found"));
    application.setStatus(status);
    return jobApplicationRepository.save(application);
  }

  public GridFsResource getResume(String fileId) {
    GridFSFile file = gridFsTemplate.findOne(new Query(Criteria.where("_id").is(fileId)));
    if (file == null) {
      throw new RuntimeException("Resume not found");
    }
    return gridFsTemplate.getResource(file);
  }
}
