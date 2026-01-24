package com.urlshortener.repository;

import com.urlshortener.model.UserTrust;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserTrustRepository extends MongoRepository<UserTrust, String> {
  Optional<UserTrust> findByUserId(String userId);
}
