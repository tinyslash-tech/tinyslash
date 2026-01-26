package com.urlshortener.repository;

import com.urlshortener.model.TrustVerification;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface TrustVerificationRepository extends MongoRepository<TrustVerification, String> {
  Optional<TrustVerification> findByUserId(String userId);

  Optional<TrustVerification> findByUserIdAndStatus(String userId, TrustVerification.VerificationStatus status);
}
