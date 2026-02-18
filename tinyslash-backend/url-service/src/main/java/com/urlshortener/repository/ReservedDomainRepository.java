package com.urlshortener.repository;

import com.urlshortener.model.ReservedDomain;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReservedDomainRepository extends MongoRepository<ReservedDomain, String> {

  // Check if a domain is reserved (globally locked)
  boolean existsByDomainName(String domainName);

  // Find reservation by domain name
  Optional<ReservedDomain> findByDomainName(String domainName);
}
