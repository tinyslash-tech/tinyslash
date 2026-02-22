package com.urlshortener.repository;

import com.urlshortener.model.PageInteraction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PageInteractionRepository extends MongoRepository<PageInteraction, String> {

  // Used by the aggregation job to find raw events naturally ordered by creation
  List<PageInteraction> findByProcessedFalseAndCreatedAtBefore(LocalDateTime beforeDate);
}
