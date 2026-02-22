package com.urlshortener.repository;

import com.urlshortener.model.PageAnalyticsSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageAnalyticsSummaryRepository extends MongoRepository<PageAnalyticsSummary, String> {

  Optional<PageAnalyticsSummary> findByPageIdAndDateAndHour(String pageId, String date, int hour);

  List<PageAnalyticsSummary> findByPageId(String pageId);

  List<PageAnalyticsSummary> findByPageIdAndDateBetween(String pageId, String startDate, String endDate);
}
