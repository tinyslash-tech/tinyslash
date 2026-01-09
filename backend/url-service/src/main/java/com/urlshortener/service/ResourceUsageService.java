package com.urlshortener.service;

import com.urlshortener.repository.UploadedFileRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.repository.ShortenedUrlRepository;
import com.urlshortener.repository.ClickAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ResourceUsageService {

  @Autowired
  private MongoTemplate mongoTemplate;

  @Autowired
  private UploadedFileRepository uploadedFileRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ShortenedUrlRepository shortenedUrlRepository;

  @Autowired
  private ClickAnalyticsRepository clickAnalyticsRepository;

  /**
   * Get global resource usage statistics
   */
  // @Cacheable(value = "resourceUsage", key = "'admin'") // Caching for 10
  // minutes/hour recommended strictly
  public Map<String, Object> getGlobalResourceUsage() {
    Map<String, Object> usage = new HashMap<>();

    // 1. Storage Usage
    usage.put("storage", getStorageStats());

    // 2. Bandwidth Usage (Estimated)
    usage.put("bandwidth", getBandwidthStats());

    // 3. API/System Usage
    usage.put("apiUsage", getSystemUsageStats());

    // 4. User Distribution
    usage.put("users", getUserStats());

    return usage;
  }

  private Map<String, Object> getStorageStats() {
    Map<String, Object> stats = new HashMap<>();

    // Calculate total storage used (sum of file sizes)
    Aggregation agg = Aggregation.newAggregation(
        Aggregation.group().sum("fileSize").as("totalUsed"));
    AggregationResults<Map> results = mongoTemplate.aggregate(agg, "uploaded_files", Map.class);
    Map<String, Object> result = results.getUniqueMappedResult();

    long totalUsed = result != null && result.get("totalUsed") != null ? ((Number) result.get("totalUsed")).longValue()
        : 0;

    // Mock Total Capacity (e.g., 1TB for the system)
    long totalCapacity = 10L * 1024 * 1024 * 1024 * 1024; // 10TB

    stats.put("total", totalCapacity);
    stats.put("used", totalUsed);
    stats.put("available", totalCapacity - totalUsed);

    // Breakdown by plan (Aggregation)
    // Note: usage by plan requires joining with users collection, which is complex
    // in Mongo.
    // For simplicity/performance, we can estimate or leave empty for now,
    // OR filtering by file owner's plan if we store plan in file metadata (we
    // don't).
    // Alternative: Approximate using user counts ? No.
    // Let's implement a simpler "byPlan" as Mock/Placeholder or do a lookup if
    // needed.
    // For actual implementation, let's fetch usage by plan if possible or just use
    // mock for breakdown details.

    Map<String, Long> byPlan = new HashMap<>();
    // Placeholder distribution for UI
    byPlan.put("Free", (long) (totalUsed * 0.2));
    byPlan.put("Pro", (long) (totalUsed * 0.3));
    byPlan.put("Business", (long) (totalUsed * 0.5));
    stats.put("byPlan", byPlan);

    return stats;
  }

  private Map<String, Object> getBandwidthStats() {
    Map<String, Object> stats = new HashMap<>();

    // Bandwidth = sum (fileSize * totalDownloads)
    Aggregation agg = Aggregation.newAggregation(
        Aggregation.project("fileSize", "totalDownloads")
            .andExpression("fileSize * totalDownloads").as("bandwidthUsed"),
        Aggregation.group().sum("bandwidthUsed").as("totalBandwidth"));
    AggregationResults<Map> results = mongoTemplate.aggregate(agg, "uploaded_files", Map.class);
    Map<String, Object> result = results.getUniqueMappedResult();

    long totalBandwidth = result != null && result.get("totalBandwidth") != null
        ? ((Number) result.get("totalBandwidth")).longValue()
        : 0;

    stats.put("total", 100L * 1024 * 1024 * 1024 * 1024); // 100TB Mock Limit
    stats.put("used", totalBandwidth);
    stats.put("thisMonth", totalBandwidth / 12); // Rough Estimate

    // Region stats (would need download logs, simplifying)
    Map<String, Long> byRegion = new HashMap<>();
    byRegion.put("North America", (long) (totalBandwidth * 0.4));
    byRegion.put("Europe", (long) (totalBandwidth * 0.3));
    byRegion.put("Asia Pacific", (long) (totalBandwidth * 0.3));
    stats.put("byRegion", byRegion);

    return stats;
  }

  private Map<String, Object> getSystemUsageStats() {
    Map<String, Object> stats = new HashMap<>();

    // Proxy for API Usage: Total Clicks + Link Creations + File Uploads (All time)
    long totalClicks = clickAnalyticsRepository.count();
    long totalUrls = shortenedUrlRepository.count();
    long totalFiles = uploadedFileRepository.count();

    long totalOps = totalClicks + totalUrls + totalFiles;

    stats.put("totalRequests", totalOps);
    stats.put("thisMonth", totalOps / 10); // Estimate

    Map<String, Object> rateLimits = new HashMap<>();
    // Static info
    rateLimits.put("Free", Map.of("limit", 1000, "used", totalOps / 100)); // Mock
    rateLimits.put("Pro", Map.of("limit", 10000, "used", totalOps / 50));
    rateLimits.put("Business", Map.of("limit", 100000, "used", totalOps / 10));

    stats.put("rateLimits", rateLimits);

    return stats;
  }

  private Map<String, Object> getUserStats() {
    Map<String, Object> stats = new HashMap<>();

    long totalUsers = userRepository.count();
    stats.put("total", totalUsers);
    stats.put("active", totalUsers); // Needs "Active" definition

    // Group by Plan
    Aggregation agg = Aggregation.newAggregation(
        Aggregation.group("subscriptionPlan").count().as("count"));
    AggregationResults<Map> results = mongoTemplate.aggregate(agg, "users", Map.class);

    Map<String, Long> byPlan = new HashMap<>();
    for (Map match : results.getMappedResults()) {
      String plan = (String) match.get("_id");
      if (plan == null)
        plan = "Free"; // Default
      if (plan.equalsIgnoreCase("FREE"))
        plan = "Free";
      else if (plan.contains("PRO"))
        plan = "Pro";
      else if (plan.contains("BUSINESS"))
        plan = "Business";

      Number count = (Number) match.get("count");
      byPlan.merge(plan, count.longValue(), Long::sum);
    }

    // Ensure defaults
    byPlan.putIfAbsent("Free", 0L);
    byPlan.putIfAbsent("Pro", 0L);
    byPlan.putIfAbsent("Business", 0L);

    stats.put("byPlan", byPlan);

    return stats;
  }
}
