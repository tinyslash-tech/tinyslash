package com.urlshortener.service;

import com.urlshortener.model.Page;
import com.urlshortener.model.PageTheme;
import com.urlshortener.model.PageView;
import com.urlshortener.model.User;
import com.urlshortener.repository.PageRepository;
import com.urlshortener.repository.PageViewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PageService {

  private final PageRepository pageRepository;
  private final StorageService storageService;

  @Autowired
  private SlugService slugService;

  @Autowired
  private PageViewRepository pageViewRepository;

  @Autowired
  public PageService(PageRepository pageRepository, StorageService storageService, SlugService slugService) {
    this.pageRepository = pageRepository;
    this.storageService = storageService;
    this.slugService = slugService;
  }

  public String uploadAsset(MultipartFile file, String userId) throws IOException {
    String path = "pages/" + userId + "/" + System.currentTimeMillis() + "-" + file.getOriginalFilename();
    String storedPath = storageService.uploadFile(file, path);
    String publicUrl = storageService.getPublicUrl(storedPath);

    // For R2, we get the public URL.
    if (publicUrl == null) {
      throw new IllegalStateException("Public storage domain not configured (R2_PUBLIC_DOMAIN missing)");
    }
    return publicUrl;
  }

  public List<Page> getUserPages(String userId) {
    return pageRepository.findByUserId(userId);
  }

  public Page createPage(User user, Page pageData) {
    // Enforce Limits based on plan (simulated logic for now)

    // Slug Logic
    String rawSlug = pageData.getSlug();
    if (rawSlug == null || rawSlug.trim().isEmpty()) {
      // Auto-generate from title if missing
      rawSlug = pageData.getTitle();
    }

    String safeSlug = slugService.sanitizeSlug(rawSlug);
    if (safeSlug.isEmpty()) {
      safeSlug = "page-" + UUID.randomUUID().toString().substring(0, 6);
    }

    if (slugService.isSlugReserved(safeSlug)) {
      throw new IllegalArgumentException("Slug is reserved: " + safeSlug);
    }

    pageData.setSlug(safeSlug);
    pageData.setUserId(user.getId());

    // Use default theme if null
    if (pageData.getTheme() == null) {
      pageData.setTheme(new PageTheme(
          "SOLID", "#ffffff", null, null, null,
          "ROUNDED", "#000000", "#ffffff",
          "Inter", "MD", "NORMAL", "#000000",
          "MD", "FILLED", null, null, null, true));
    }

    try {
      return pageRepository.save(pageData);
    } catch (org.springframework.dao.DuplicateKeyException e) {
      throw new IllegalArgumentException("Slug is already taken: " + safeSlug);
    }
  }

  public Page updatePage(String userId, String pageId, Page updates) {
    Page existing = pageRepository.findById(pageId)
        .orElseThrow(() -> new RuntimeException("Page not found"));

    if (!existing.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    existing.setTitle(updates.getTitle());
    existing.setBio(updates.getBio());
    existing.setAvatarUrl(updates.getAvatarUrl());
    existing.setTheme(updates.getTheme());
    existing.setBlocks(updates.getBlocks());
    existing.setBlocks(updates.getBlocks());
    existing.setPublished(updates.isPublished());

    // Pro Features
    existing.setVerified(updates.isVerified());
    existing.setRemoveBranding(updates.isRemoveBranding());
    existing.setCustomDomain(updates.getCustomDomain());

    // SEO
    existing.setMetaTitle(updates.getMetaTitle());
    existing.setMetaDescription(updates.getMetaDescription());

    // Handle slug updates if changed
    if (updates.getSlug() != null && !updates.getSlug().equals(existing.getSlug())) {
      String safeSlug = slugService.sanitizeSlug(updates.getSlug());

      if (safeSlug.equals(existing.getSlug())) {
        return pageRepository.save(existing); // No change after sanitization
      }

      if (slugService.isSlugReserved(safeSlug)) {
        throw new IllegalArgumentException("Slug is reserved: " + safeSlug);
      }

      existing.setSlug(safeSlug);

      try {
        return pageRepository.save(existing);
      } catch (org.springframework.dao.DuplicateKeyException e) {
        throw new IllegalArgumentException("Slug is already taken: " + safeSlug);
      }
    }

    return pageRepository.save(existing);
  }

  public void deletePage(String userId, String pageId) {
    Page existing = pageRepository.findById(pageId)
        .orElseThrow(() -> new RuntimeException("Page not found"));

    if (!existing.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    pageRepository.delete(existing);
  }

  public Page getPageBySlug(String slug) {
    return pageRepository.findBySlug(slug)
        .orElseThrow(() -> new RuntimeException("Page not found"));
  }

  public Page getPageById(String pageId, String userId) {
    Page page = pageRepository.findById(pageId)
        .orElseThrow(() -> new RuntimeException("Page not found"));

    if (!page.getUserId().equals(userId)) {
      throw new RuntimeException("Unauthorized");
    }

    return page;
  }

  public void recordView(String pageId, String ip, String userAgent, String referer) {
    // Create visitor fingerprint from IP + User-Agent
    String visitorId = String.valueOf((ip + ":" + userAgent).hashCode());

    PageView view = new PageView(pageId, visitorId, ip, userAgent, referer);
    pageViewRepository.save(view);

    // Increment the denormalized views counter on the page
    pageRepository.findById(pageId).ifPresent(page -> {
      page.setViews(page.getViews() + 1);
      pageRepository.save(page);
    });
  }

  public Map<String, Object> getAnalytics(String pageId) {
    Map<String, Object> analytics = new LinkedHashMap<>();

    // Total views
    long totalViews = pageViewRepository.countByPageId(pageId);
    analytics.put("totalViews", totalViews);

    // Unique visitors (distinct visitorId)
    List<PageView> allViews = pageViewRepository.findByPageId(pageId);
    long uniqueVisitors = allViews.stream()
        .map(PageView::getVisitorId)
        .distinct()
        .count();
    analytics.put("uniqueVisitors", uniqueVisitors);

    // Daily views for last 30 days
    LocalDateTime thirtyDaysAgo = LocalDateTime.of(LocalDate.now().minusDays(29), LocalTime.MIN);
    List<PageView> recentViews = pageViewRepository.findByPageIdAndViewedAtBetween(
        pageId, thirtyDaysAgo, LocalDateTime.now());

    // Group by date
    Map<String, Long> dailyViews = new LinkedHashMap<>();
    for (int i = 29; i >= 0; i--) {
      LocalDate date = LocalDate.now().minusDays(i);
      dailyViews.put(date.toString(), 0L);
    }
    recentViews.forEach(v -> {
      if (v.getViewedAt() != null) {
        String dateKey = v.getViewedAt().toLocalDate().toString();
        dailyViews.computeIfPresent(dateKey, (k, count) -> count + 1);
      }
    });
    analytics.put("dailyViews", dailyViews);

    // This week vs last week
    LocalDateTime thisWeekStart = LocalDateTime.of(LocalDate.now().minusDays(6), LocalTime.MIN);
    LocalDateTime lastWeekStart = LocalDateTime.of(LocalDate.now().minusDays(13), LocalTime.MIN);
    long thisWeekViews = recentViews.stream()
        .filter(v -> v.getViewedAt() != null && v.getViewedAt().isAfter(thisWeekStart))
        .count();
    long lastWeekViews = recentViews.stream()
        .filter(v -> v.getViewedAt() != null && v.getViewedAt().isAfter(lastWeekStart)
            && v.getViewedAt().isBefore(thisWeekStart))
        .count();
    analytics.put("thisWeekViews", thisWeekViews);
    analytics.put("lastWeekViews", lastWeekViews);

    // Top referrers
    Map<String, Long> referrers = allViews.stream()
        .filter(v -> v.getReferer() != null && !v.getReferer().isEmpty())
        .collect(Collectors.groupingBy(
            v -> {
              try {
                java.net.URI uri = new java.net.URI(v.getReferer());
                return uri.getHost() != null ? uri.getHost() : v.getReferer();
              } catch (Exception e) {
                return v.getReferer();
              }
            },
            Collectors.counting()));

    // Sort by count descending, take top 5
    Map<String, Long> topReferrers = referrers.entrySet().stream()
        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
        .limit(5)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (a, b) -> a, LinkedHashMap::new));
    analytics.put("topReferrers", topReferrers);

    return analytics;
  }
}
