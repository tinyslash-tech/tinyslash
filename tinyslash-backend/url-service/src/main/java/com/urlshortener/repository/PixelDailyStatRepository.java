package com.urlshortener.repository;

import com.urlshortener.model.PixelDailyStat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Repository for PixelDailyStat — pre-aggregated daily pixel fire stats.
 *
 * At 10M+ raw events, this collection stays tiny:
 * O(users × pixels × days) instead of O(raw_events)
 *
 * All analytics endpoints should read from here, not PixelFireEvent.
 */
@Repository
public interface PixelDailyStatRepository extends MongoRepository<PixelDailyStat, String> {

  // --- User-level (Performance Dashboard) ---

  /** All stats for a user in a date range — for global pixel performance card */
  List<PixelDailyStat> findByUserIdAndDateBetween(String userId, LocalDate from, LocalDate to);

  /** All stats for a user ever — for lifetime stats */
  List<PixelDailyStat> findByUserId(String userId);

  // --- Link-level (Link Analytics Page) ---

  /** All stats for a specific short link in a date range */
  List<PixelDailyStat> findByShortCodeAndDateBetween(String shortCode, LocalDate from, LocalDate to);

  /** All stats for a specific short link ever */
  List<PixelDailyStat> findByShortCode(String shortCode);

  // --- Pixel-level ---

  /** All stats for a specific pixel in a date range */
  List<PixelDailyStat> findByPixelIdAndDateBetween(String pixelId, LocalDate from, LocalDate to);

  // --- Cleanup ---

  /** Delete all stats for a pixel (called on pixel deletion) */
  void deleteAllByPixelId(String pixelId);

  /** Delete all stats for a link (called on link deletion) */
  void deleteAllByShortCode(String shortCode);
}
