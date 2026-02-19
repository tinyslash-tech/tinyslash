package com.urlshortener.repository;

import com.urlshortener.model.DomainCooldown;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DomainCooldownRepository extends MongoRepository<DomainCooldown, String> {
  // Find cooldowns that are still active (deletedAt > now - 24h)
  // Actually, TTL index handles expiration, so just findById is enough.
}
