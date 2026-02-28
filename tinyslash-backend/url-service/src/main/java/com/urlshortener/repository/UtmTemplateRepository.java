package com.urlshortener.repository;

import com.urlshortener.model.UtmTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UtmTemplateRepository extends MongoRepository<UtmTemplate, String> {

  List<UtmTemplate> findByTeamId(String teamId);

  Optional<UtmTemplate> findByTeamIdAndId(String teamId, String id);

  boolean existsByTeamIdAndNameIgnoreCase(String teamId, String name);

  boolean existsByTeamIdAndNameIgnoreCaseAndIdNot(String teamId, String name, String id);
}
