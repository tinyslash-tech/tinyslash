package com.urlshortener.repository;

import com.urlshortener.model.JobApplication;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
  List<JobApplication> findByJobId(String jobId);

  List<JobApplication> findAllByOrderByAppliedAtDesc();
}
