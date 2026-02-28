package com.urlshortener.repository;

import com.urlshortener.model.ClientAccess;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientAccessRepository extends MongoRepository<ClientAccess, String> {
  Optional<ClientAccess> findByClientId(String clientId);

  List<ClientAccess> findByAgencyUserId(String agencyUserId);
}
