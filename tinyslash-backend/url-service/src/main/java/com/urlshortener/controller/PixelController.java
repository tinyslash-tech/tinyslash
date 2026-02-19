package com.urlshortener.controller;

import com.urlshortener.annotation.RequiresPlan;
import com.urlshortener.model.Pixel;
import com.urlshortener.model.PixelDailyStat;
import com.urlshortener.model.PixelType;
import com.urlshortener.repository.PixelDailyStatRepository;
import com.urlshortener.repository.PixelRepository;
import com.urlshortener.service.EncryptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/pixels")
@CrossOrigin(origins = "*")
public class PixelController {

  @Autowired
  private PixelRepository pixelRepository;

  /** P1: Use PixelDailyStat repo for analytics — O(thousands) not O(millions) */
  @Autowired
  private PixelDailyStatRepository pixelDailyStatRepository;

  @Autowired
  private EncryptionService encryptionService;

  @GetMapping
  public ResponseEntity<Map<String, Object>> getUserPixels(@RequestParam String userId) {
    Map<String, Object> response = new HashMap<>();
    try {
      List<Pixel> pixels = pixelRepository.findByUserId(userId);

      // Mask sensitive tokens in response
      pixels.forEach(p -> p.setAccessToken(p.getAccessToken() != null ? "********" : null));

      response.put("success", true);
      response.put("data", pixels);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @PostMapping
  @RequiresPlan(feature = "pixels") // Assuming 'pixels' feature is defined in plan system
  public ResponseEntity<Map<String, Object>> createPixel(@RequestBody Map<String, Object> request) {
    Map<String, Object> response = new HashMap<>();
    try {
      String userId = (String) request.get("userId");
      String name = (String) request.get("name");
      String typeStr = (String) request.get("type");
      String pixelId = (String) request.get("pixelId");
      String accessToken = (String) request.get("accessToken");

      if (userId == null || name == null || typeStr == null || pixelId == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Missing required fields"));
      }

      PixelType type = PixelType.valueOf(typeStr);
      Pixel pixel = new Pixel(userId, name, type, pixelId);

      // Encrypt Token
      if (accessToken != null && !accessToken.isEmpty()) {
        pixel.setAccessToken(encryptionService.encrypt(accessToken));
      }

      if (request.containsKey("conversionApiEndpoint")) {
        pixel.setConversionApiEndpoint((String) request.get("conversionApiEndpoint"));
      }

      Pixel saved = pixelRepository.save(pixel);

      // Return safe version
      saved.setAccessToken("********");

      response.put("success", true);
      response.put("data", saved);
      return ResponseEntity.ok(response);
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid Pixel Type"));
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to create pixel: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Map<String, Object>> deletePixel(@PathVariable String id, @RequestParam String userId) {
    try {
      Optional<Pixel> pixelOpt = pixelRepository.findByIdAndUserId(id, userId);
      if (pixelOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("success", false, "message", "Pixel not found"));
      }

      pixelRepository.deleteById(id);
      return ResponseEntity.ok(Map.of("success", true, "message", "Pixel deleted"));
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error deleting pixel"));
    }
  }

  @PutMapping("/{id}/toggle")
  public ResponseEntity<Map<String, Object>> togglePixel(@PathVariable String id, @RequestParam String userId,
      @RequestParam boolean active) {
    try {
      Optional<Pixel> pixelOpt = pixelRepository.findByIdAndUserId(id, userId);
      if (pixelOpt.isEmpty()) {
        return ResponseEntity.status(404).body(Map.of("success", false, "message", "Pixel not found"));
      }

      Pixel pixel = pixelOpt.get();
      pixel.setActive(active);
      pixel.setUpdatedAt(LocalDateTime.now());
      pixelRepository.save(pixel);

      return ResponseEntity.ok(Map.of("success", true, "message", "Pixel updated"));
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error updating pixel"));
    }
  }

  /**
   * P1: Per-link pixel fire breakdown — reads from PixelDailyStat
   * (pre-aggregated).
   * O(pixels × days_active) instead of O(raw_events).
   * GET /api/v1/pixels/link-stats?shortCode=xxx&userId=xxx
   */
  @GetMapping("/link-stats")
  public ResponseEntity<Map<String, Object>> getLinkPixelStats(
      @RequestParam(required = false) String shortCode,
      @RequestParam(required = false) String linkId,
      @RequestParam String userId) {
    try {
      String lookupKey = (shortCode != null && !shortCode.isBlank()) ? shortCode : linkId;

      // Fast path: read from pre-aggregated daily stat collection
      List<PixelDailyStat> stats = (shortCode != null && !shortCode.isBlank())
          ? pixelDailyStatRepository.findByShortCode(shortCode)
          : pixelDailyStatRepository.findByShortCode(linkId); // fallback

      // Aggregate across days per pixel
      Map<String, Map<String, Object>> pixelMap = new LinkedHashMap<>();
      for (PixelDailyStat stat : stats) {
        pixelMap.computeIfAbsent(stat.getPixelId(), k -> {
          Map<String, Object> m = new LinkedHashMap<>();
          m.put("pixelId", stat.getPixelId());
          m.put("name", stat.getPixelName());
          m.put("type", stat.getPixelType() != null ? stat.getPixelType().name() : "UNKNOWN");
          m.put("fired", 0L);
          m.put("failed", 0L);
          return m;
        });
        Map<String, Object> m = pixelMap.get(stat.getPixelId());
        m.put("fired", (Long) m.get("fired") + stat.getFired());
        m.put("failed", (Long) m.get("failed") + stat.getFailed());
      }

      // Compute fire rates
      List<Map<String, Object>> pixelList = new ArrayList<>(pixelMap.values());
      long totalFired = 0, totalFailed = 0;
      for (Map<String, Object> m : pixelList) {
        long f = (Long) m.get("fired"), fl = (Long) m.get("failed"), t = f + fl;
        m.put("fireRate", t > 0 ? Math.round((f * 1000.0) / t) / 10.0 : 0.0);
        m.put("total", t);
        totalFired += f;
        totalFailed += fl;
      }
      long grandTotal = totalFired + totalFailed;
      double overallFireRate = grandTotal > 0 ? Math.round((totalFired * 1000.0) / grandTotal) / 10.0 : 0.0;

      Map<String, Object> response = new LinkedHashMap<>();
      response.put("success", true);
      response.put("linkId", lookupKey);
      response.put("pixels", pixelList);
      response.put("totalFired", totalFired);
      response.put("totalFailed", totalFailed);
      response.put("overallFireRate", overallFireRate);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  /**
   * P1: Global pixel performance — reads from PixelDailyStat (pre-aggregated).
   * P4: Adds fireRateAlert flag when fire rate < 80% (shown as warning banner in
   * dashboard).
   * GET /api/v1/pixels/performance?userId=xxx&days=30
   */
  @GetMapping("/performance")
  public ResponseEntity<Map<String, Object>> getPixelPerformance(
      @RequestParam String userId,
      @RequestParam(defaultValue = "30") int days) {
    try {
      LocalDate from = LocalDate.now().minusDays(days);
      LocalDate to = LocalDate.now();

      // Fast path: read from pre-aggregated daily stat — O(pixels × days) indexed
      // lookup
      List<PixelDailyStat> stats = pixelDailyStatRepository.findByUserIdAndDateBetween(userId, from, to);

      // Aggregate totals
      long totalFired = stats.stream().mapToLong(PixelDailyStat::getFired).sum();
      long totalFailed = stats.stream().mapToLong(PixelDailyStat::getFailed).sum();
      long grandTotal = totalFired + totalFailed;
      double fireRate = grandTotal > 0 ? Math.round((totalFired * 1000.0) / grandTotal) / 10.0 : 0.0;

      // Per-pixel aggregation
      Map<String, Map<String, Object>> byPixelMap = new LinkedHashMap<>();
      for (PixelDailyStat stat : stats) {
        byPixelMap.computeIfAbsent(stat.getPixelId(), k -> {
          Map<String, Object> m = new LinkedHashMap<>();
          m.put("pixelId", stat.getPixelId());
          m.put("name", stat.getPixelName());
          m.put("type", stat.getPixelType() != null ? stat.getPixelType().name() : "UNKNOWN");
          m.put("fired", 0L);
          m.put("failed", 0L);
          return m;
        });
        Map<String, Object> m = byPixelMap.get(stat.getPixelId());
        m.put("fired", (Long) m.get("fired") + stat.getFired());
        m.put("failed", (Long) m.get("failed") + stat.getFailed());
      }
      byPixelMap.values().forEach(m -> {
        long f = (Long) m.get("fired"), fl = (Long) m.get("failed"), t = f + fl;
        m.put("fireRate", t > 0 ? Math.round((f * 1000.0) / t) / 10.0 : 0.0);
      });

      // Daily breakdown for trend chart (group by date, sum fired/failed)
      Map<LocalDate, long[]> daily = new TreeMap<>();
      for (PixelDailyStat stat : stats) {
        daily.computeIfAbsent(stat.getDate(), k -> new long[] { 0, 0 });
        daily.get(stat.getDate())[0] += stat.getFired();
        daily.get(stat.getDate())[1] += stat.getFailed();
      }
      List<Map<String, Object>> byDay = daily.entrySet().stream()
          .map(e -> Map.<String, Object>of(
              "date", e.getKey().toString(),
              "fired", e.getValue()[0],
              "failed", e.getValue()[1]))
          .collect(Collectors.toList());

      Map<String, Object> response = new LinkedHashMap<>();
      response.put("success", true);
      response.put("totalFired", totalFired);
      response.put("totalFailed", totalFailed);
      response.put("fireRate", fireRate);
      // P4: Alert flag — shown as warning banner in dashboard when fire rate is poor
      response.put("fireRateAlert", grandTotal > 0 && fireRate < 80.0);
      response.put("byPixel", new ArrayList<>(byPixelMap.values()));
      response.put("byDay", byDay);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
    }
  }
}
