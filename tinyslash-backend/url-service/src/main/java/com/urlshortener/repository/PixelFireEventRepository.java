package com.urlshortener.repository;

import com.urlshortener.model.PixelFireEvent;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PixelFireEventRepository extends MongoRepository<PixelFireEvent, String> {

  // Per-link queries (by DB id)
  List<PixelFireEvent> findByLinkId(String linkId);

  long countByLinkIdAndStatus(String linkId, PixelFireEvent.Status status);

  // Per-shortCode queries (used by frontend which has shortCode, not DB id)
  List<PixelFireEvent> findByShortCode(String shortCode);

  // Per-pixel queries
  List<PixelFireEvent> findByPixelId(String pixelId);

  long countByPixelIdAndStatus(String pixelId, PixelFireEvent.Status status);

  // Per-user queries (for global analytics dashboard)
  List<PixelFireEvent> findByUserId(String userId);

  // Time-range queries for charts
  @Query("{'userId': ?0, 'firedAt': {$gte: ?1, $lte: ?2}}")
  List<PixelFireEvent> findByUserIdAndFiredAtBetween(String userId, LocalDateTime from, LocalDateTime to);

  @Query("{'linkId': ?0, 'firedAt': {$gte: ?1, $lte: ?2}}")
  List<PixelFireEvent> findByLinkIdAndFiredAtBetween(String linkId, LocalDateTime from, LocalDateTime to);

  // Delete all events for a pixel (cleanup on pixel delete)
  void deleteAllByPixelId(String pixelId);

  // Delete all events for a link (cleanup on link delete)
  void deleteAllByLinkId(String linkId);
}
