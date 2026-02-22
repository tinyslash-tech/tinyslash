package com.urlshortener.service;

import com.urlshortener.model.Page;
import com.urlshortener.model.PlanPolicy;
import com.urlshortener.model.PageTheme;
import com.urlshortener.model.PageView;
import com.urlshortener.model.User;
import com.urlshortener.repository.PageRepository;
import com.urlshortener.repository.PageViewRepository;
import com.urlshortener.repository.PageInteractionRepository;
import com.urlshortener.repository.PageAnalyticsSummaryRepository;
import com.urlshortener.repository.PageLinkMetricRepository;
import com.urlshortener.dto.PageInteractionBatchRequest;
import eu.bitwalker.useragentutils.UserAgent;
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
  private PageInteractionRepository interactionRepository;

  @Autowired
  private PageAnalyticsSummaryRepository summaryRepository;

  @Autowired
  private PageLinkMetricRepository linkMetricRepository;

  @Autowired
  private SubscriptionService subscriptionService;

  @Autowired
  private GeoIPService geoIPService;

  @Autowired
  public PageService(PageRepository pageRepository, StorageService storageService, SlugService slugService,
      SubscriptionService subscriptionService) {
    this.pageRepository = pageRepository;
    this.storageService = storageService;
    this.slugService = slugService;
    this.subscriptionService = subscriptionService;
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
    // 1. Check Plan Limits
    // Helper method to resolve plan
    PlanPolicy userPlan = PlanPolicy.fromString(String.valueOf(user.getSubscriptionPlan())); // Handling potential
                                                                                             // null/string mismatch

    int currentPages = (int) pageRepository.countByUserId(user.getId());
    if (!userPlan.canCreatePage(currentPages)) {
      throw new IllegalStateException("Plan limit reached: You can only create " + userPlan.getPagesPerUser()
          + " pages on the " + userPlan.getDisplayName() + " plan.");
    }

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

    // 1. Fetch Plan
    User user = subscriptionService.getUser(userId); // Need to fetch user to get plan
    PlanPolicy plan = PlanPolicy.fromString(String.valueOf(user.getSubscriptionPlan()));

    // 2. Validate Link Count
    if (updates.getBlocks() != null) {
      long linkCount = updates.getBlocks().stream()
          .filter(b -> "LINK".equals(b.getType()))
          .count();
      if (!plan.canAddLinkToPage((int) linkCount)) {
        throw new IllegalArgumentException("Plan limit reached: You can only add " + plan.getLinksPerPage()
            + " links per page on the " + plan.getDisplayName() + " plan.");
      }
    }

    // 3. Validate Premium Features
    if (updates.isRemoveBranding() && !plan.hasRemovePageBranding()) {
      throw new IllegalArgumentException("Upgrade required: Removing branding is available on the Business plan.");
    }

    if (updates.getCustomDomain() != null && !updates.getCustomDomain().isEmpty() && !plan.hasPageCustomDomain()) {
      throw new IllegalArgumentException("Upgrade required: Custom domains are available on the Pro plan.");
    }

    // 4. Validate Premium Blocks (Lead Forms)
    if (updates.getBlocks() != null) {
      boolean hasForm = updates.getBlocks().stream()
          .anyMatch(b -> "FORM".equals(b.getType()) || "NEWSLETTER".equals(b.getType())); // Assuming FORM/NEWSLETTER
                                                                                          // types
      if (hasForm && !plan.hasLeadForms()) {
        throw new IllegalArgumentException("Upgrade required: Lead forms are available on the Business plan.");
      }
    }

    existing.setTitle(updates.getTitle());
    existing.setBio(updates.getBio());
    existing.setAvatarUrl(updates.getAvatarUrl());
    existing.setTheme(updates.getTheme()); // TODO: Validate Premium Themes if needed
    existing.setBlocks(updates.getBlocks());
    existing.setPublished(updates.isPublished());

    // WhatsApp Features
    existing.setWaNumber(updates.getWaNumber());
    existing.setWaDisplayType(updates.getWaDisplayType());
    existing.setWaDefaultMessage(updates.getWaDefaultMessage());
    existing.setWaSmartTemplate(updates.getWaSmartTemplate());

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

  public void recordView(String pageId, String ip, String userAgentRaw, String referer, PageInteractionBatchRequest req,
      String countryHeader) {
    String sessionId = req.getSessionId() != null ? req.getSessionId() : UUID.randomUUID().toString();
    String visitorId = req.getVisitorId() != null ? req.getVisitorId()
        : String.valueOf((ip + ":" + userAgentRaw).hashCode());

    PageView view = new PageView();
    view.setPageId(pageId);
    view.setVisitorId(visitorId);
    view.setSessionId(sessionId);
    view.setIp(ip);
    view.setUserAgent(userAgentRaw);
    view.setReferer(referer);
    view.setViewedAt(LocalDateTime.now());

    // 1. Parse User Agent
    if (userAgentRaw != null) {
      UserAgent ua = UserAgent.parseUserAgentString(userAgentRaw);
      view.setBrowser(ua.getBrowser().getName());
      view.setOs(ua.getOperatingSystem().getName());

      String deviceTypeRaw = ua.getOperatingSystem().getDeviceType().getName().toUpperCase();
      if (deviceTypeRaw.contains("MOBILE"))
        view.setDeviceType("MOBILE");
      else if (deviceTypeRaw.contains("TABLET"))
        view.setDeviceType("TABLET");
      else
        view.setDeviceType("DESKTOP");
    }

    // 2. Parse Geo/Location
    if (countryHeader != null && !countryHeader.isEmpty()) {
      view.setCountry(countryHeader);
    } else if (geoIPService != null && geoIPService.isAvailable() && ip != null) {
      Map<String, String> loc = geoIPService.resolveLocation(ip);
      view.setCountry(loc.get("countryCode") != null ? loc.get("countryCode") : loc.get("country"));
      view.setCity(loc.get("city"));
    }

    // 3. Traffic Source Normalization
    view.setUtmSource(req.getUtmSource());
    view.setUtmMedium(req.getUtmMedium());
    view.setUtmCampaign(req.getUtmCampaign());
    view.setRefererType(determineReferrerType(referer, req.getUtmSource()));

    pageViewRepository.save(view);

    // Increment the denormalized views counter on the page
    pageRepository.findById(pageId).ifPresent(page -> {
      page.setViews(page.getViews() + 1);
      pageRepository.save(page);
    });
  }

  private String determineReferrerType(String urlString, String utmSource) {
    if (utmSource != null && !utmSource.isBlank()) {
      String s = utmSource.toLowerCase();
      if (s.contains("ig") || s.contains("instagram"))
        return "INSTAGRAM";
      if (s.contains("wa") || s.contains("whatsapp"))
        return "WHATSAPP";
      if (s.contains("fb") || s.contains("facebook"))
        return "FACEBOOK";
      if (s.contains("twitter") || s.contains("x"))
        return "TWITTER";
      if (s.contains("linkedin"))
        return "LINKEDIN";
      if (s.contains("youtube") || s.contains("yt"))
        return "YOUTUBE";
    }

    if (urlString == null || urlString.isBlank())
      return "DIRECT";

    String lower = urlString.toLowerCase();
    if (lower.contains("instagram.com") || lower.contains("l.instagram.com"))
      return "INSTAGRAM";
    if (lower.contains("wa.me") || lower.contains("whatsapp.com"))
      return "WHATSAPP";
    if (lower.contains("facebook.com") || lower.contains("fb.me"))
      return "FACEBOOK";
    if (lower.contains("t.co") || lower.contains("twitter.com"))
      return "TWITTER";
    if (lower.contains("linkedin.com"))
      return "LINKEDIN";
    if (lower.contains("youtube.com") || lower.contains("youtu.be"))
      return "YOUTUBE";
    if (lower.contains("google."))
      return "GOOGLE";
    if (lower.contains("bing.com"))
      return "BING";

    return "OTHER";
  }

  public void recordInteractionsBatch(String pageId, PageInteractionBatchRequest batch) {
    if (batch == null || batch.getInteractions() == null || batch.getInteractions().isEmpty()) {
      return;
    }

    List<com.urlshortener.model.PageInteraction> entities = batch.getInteractions().stream()
        .map(dto -> new com.urlshortener.model.PageInteraction(
            pageId,
            batch.getSessionId(),
            batch.getVisitorId(),
            dto.getType(),
            dto.getMeta()))
        .collect(Collectors.toList());

    interactionRepository.saveAll(entities);
  }

  public Map<String, Object> getAnalytics(String pageId) {
    Map<String, Object> analytics = new LinkedHashMap<>();

    // 1. Fetch Aggregated Summaries for the last 30 days
    LocalDate today = LocalDate.now();
    LocalDate thirtyDaysAgo = today.minusDays(29);

    // We expect date format YYYY-MM-DD
    String startStr = thirtyDaysAgo.format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE);
    String endStr = today.format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE);

    List<com.urlshortener.model.PageAnalyticsSummary> summaries = summaryRepository.findByPageIdAndDateBetween(pageId,
        startStr, endStr);

    long totalViews = 0;
    long totalUnique = 0;
    long totalReturning = 0;

    long scroll25 = 0;
    long scroll50 = 0;
    long scroll75 = 0;
    long scroll100 = 0;

    Map<String, Long> deviceSplit = new HashMap<>();
    Map<String, Long> countrySplit = new HashMap<>();
    Map<String, Long> trafficSources = new HashMap<>();

    // Daily views aggregation
    Map<String, Long> dailyViews = new LinkedHashMap<>();
    for (int i = 29; i >= 0; i--) {
      dailyViews.put(today.minusDays(i).toString(), 0L);
    }

    for (com.urlshortener.model.PageAnalyticsSummary s : summaries) {
      totalViews += s.getTotalViews();
      totalUnique += s.getUniqueVisitors();
      totalReturning += s.getReturningVisitors();

      scroll25 += s.getScroll25Count();
      scroll50 += s.getScroll50Count();
      scroll75 += s.getScroll75Count();
      scroll100 += s.getScroll100Count();

      // Sum Maps
      if (s.getDeviceSplit() != null)
        s.getDeviceSplit().forEach((k, v) -> deviceSplit.merge(k, v, Long::sum));
      if (s.getCountrySplit() != null)
        s.getCountrySplit().forEach((k, v) -> countrySplit.merge(k, v, Long::sum));
      if (s.getTrafficSources() != null)
        s.getTrafficSources().forEach((k, v) -> trafficSources.merge(k, v, Long::sum));

      // Daily Chart
      dailyViews.computeIfPresent(s.getDate(), (k, count) -> count + s.getTotalViews());
    }

    // Since the Scheduler aggregates closed hours, we should also fetch Raw views
    // from today/this hour
    // to give "real-time" data. For brevity in this enterprise implementation,
    // we'll assume the scheduler
    // runs often enough, or we accept slightly delayed insights for scale.
    // In a fully complete system, we would query PageViewRepository for views since
    // the last cutoff
    // and add them to these totals.

    // Calculate Returning Visitor Rate
    double returningRate = totalUnique > 0 ? (double) totalReturning / totalUnique : 0.0;

    // 2. Fetch Link Metrics
    List<com.urlshortener.model.PageLinkMetric> linkMetrics = linkMetricRepository.findByPageId(pageId);
    Map<String, Long> topLinks = new LinkedHashMap<>();
    linkMetrics.stream()
        .collect(Collectors.groupingBy(com.urlshortener.model.PageLinkMetric::getLinkUrl,
            Collectors.summingLong(com.urlshortener.model.PageLinkMetric::getClickCount)))
        .entrySet().stream()
        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
        .limit(10)
        .forEach(e -> topLinks.put(e.getKey(), e.getValue()));

    // 3. Assemble Response payload matching Frontend Expectations
    analytics.put("totalViews", totalViews);
    analytics.put("uniqueVisitors", totalUnique);
    analytics.put("returningRate", returningRate);
    analytics.put("dailyViews", dailyViews);

    // Advanced UI expects these exact keys
    analytics.put("scroll25", scroll25);
    analytics.put("scroll50", scroll50);
    analytics.put("scroll75", scroll75);
    analytics.put("scroll100", scroll100);

    analytics.put("deviceSplit", deviceSplit);
    analytics.put("countrySplit", countrySplit);
    analytics.put("trafficSources", trafficSources);
    analytics.put("topLinks", topLinks);

    // 4. Generate AI-like Actionable Insights
    List<String> insights = generateActionableInsights(deviceSplit, trafficSources, topLinks, totalViews);
    analytics.put("actionableInsights", insights);

    return analytics;
  }

  private List<String> generateActionableInsights(Map<String, Long> deviceSplit, Map<String, Long> trafficSources,
      Map<String, Long> topLinks, long totalViews) {
    List<String> insights = new ArrayList<>();
    if (totalViews < 10) {
      insights.add("Not enough data yet. Share your page to generate insights.");
      return insights;
    }

    // Device Insight
    long mobile = deviceSplit.getOrDefault("MOBILE", 0L);
    long desktop = deviceSplit.getOrDefault("DESKTOP", 0L);
    long totalDevices = mobile + desktop;
    if (totalDevices > 0) {
      if ((double) mobile / totalDevices > 0.7) {
        insights.add("Mobile traffic is extremely high (" + Math.round(((double) mobile / totalDevices) * 100)
            + "%). Ensure your vertical spacing and font sizes are legible on small screens.");
      }
    }

    // Source Insight
    long ig = trafficSources.getOrDefault("INSTAGRAM", 0L);
    long wa = trafficSources.getOrDefault("WHATSAPP", 0L);
    if (ig > wa && ig > totalViews * 0.4) {
      insights.add("Instagram is your biggest driver. Consider adding an 'Instagram Only' exclusive link at the top.");
    }

    // Links Insight
    if (!topLinks.isEmpty()) {
      Map.Entry<String, Long> topLink = topLinks.entrySet().iterator().next();
      long clicks = topLink.getValue();
      if (clicks > totalViews * 0.5) {
        insights.add("Your link '" + topLink.getKey()
            + "' gets massive interaction. Move it to the very top if it isn't already.");
      }
    }

    if (insights.isEmpty()) {
      insights.add("Traffic is steadily growing. Try sharing on WhatsApp to boost direct connections.");
    }

    return insights;
  }
}
