package com.urlshortener.repository;

import com.urlshortener.model.Lead;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LeadRepository extends MongoRepository<Lead, String> {
  List<Lead> findByLinkId(String linkId);

  List<Lead> findByOwnerUserId(String ownerUserId);

  long countByLinkId(String linkId);

  List<Lead> findByQrCodeId(String qrCodeId);

  long countByQrCodeId(String qrCodeId);
}
