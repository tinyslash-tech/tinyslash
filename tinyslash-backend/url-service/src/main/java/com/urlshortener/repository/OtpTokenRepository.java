package com.urlshortener.repository;

import com.urlshortener.model.OtpToken;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends MongoRepository<OtpToken, String> {
  Optional<OtpToken> findByEmail(String email);

  void deleteByEmail(String email);
}
