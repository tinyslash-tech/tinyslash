package com.urlshortener.repository;

import com.urlshortener.model.PageLinkMetric;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageLinkMetricRepository extends MongoRepository<PageLinkMetric, String> {

  Optional<PageLinkMetric> findByPageIdAndDateAndHourAndLinkUrl(String pageId, String date, int hour, String linkUrl);

  List<PageLinkMetric> findByPageId(String pageId);
}
