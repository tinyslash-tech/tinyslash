package com.urlshortener.repository;

import com.urlshortener.model.Page;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

@Repository
public interface PageRepository extends MongoRepository<Page, String> {
  List<Page> findByUserId(String userId);

  Optional<Page> findBySlug(String slug);

  Optional<Page> findByCustomDomain(String customDomain);

  boolean existsBySlug(String slug);

  // Review #4: Efficient edit-mode check — avoids loading full Page document
  boolean existsBySlugAndIdNot(String slug, String id);

  List<Page> findBySlugIn(Collection<String> slugs);
}
