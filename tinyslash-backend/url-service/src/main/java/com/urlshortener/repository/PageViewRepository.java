package com.urlshortener.repository;

import com.urlshortener.model.PageView;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PageViewRepository extends MongoRepository<PageView, String> {

  long countByPageId(String pageId);

  List<PageView> findByPageIdAndViewedAtBetween(String pageId, LocalDateTime start, LocalDateTime end);

  List<PageView> findByPageId(String pageId);
}
