package com.urlshortener.repository;

import com.urlshortener.model.DomainAuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DomainAuditLogRepository extends MongoRepository<DomainAuditLog, String> {

  // Find logs for a specific domain
  List<DomainAuditLog> findByDomainIdOrderByTimestampDesc(String domainId);

  // Find logs for a specific domain name (useful if domainId changes or is
  // deleted)
  List<DomainAuditLog> findByDomainNameOrderByTimestampDesc(String domainName);

  // Find logs by user
  List<DomainAuditLog> findByUserIdOrderByTimestampDesc(String userId);
}
