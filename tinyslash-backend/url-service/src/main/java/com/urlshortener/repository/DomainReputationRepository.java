package com.urlshortener.repository;

import com.urlshortener.model.DomainReputation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DomainReputationRepository extends MongoRepository<DomainReputation, String> {
  Optional<DomainReputation> findByDomain(String domain);
}
