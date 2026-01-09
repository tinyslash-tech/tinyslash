package com.urlshortener.repository;

import com.urlshortener.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
  List<Job> findAllByOrderByPositionAsc();

  boolean existsByTitle(String title);
}
