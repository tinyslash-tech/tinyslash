package com.urlshortener.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.urlshortener.model.CreatorSchedule;
import java.util.Optional;

public interface CreatorScheduleRepository extends MongoRepository<CreatorSchedule, String> {
  Optional<CreatorSchedule> findByUserId(String userId);
}
