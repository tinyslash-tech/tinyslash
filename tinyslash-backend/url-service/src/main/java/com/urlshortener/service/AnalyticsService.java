package com.urlshortener.service;

import com.urlshortener.model.ClickAnalytics;
import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.repository.ClickAnalyticsRepository;
import com.urlshortener.repository.ShortenedUrlRepository;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsService.class);

    @Autowired(required = false)
    private ClickAnalyticsRepository clickAnalyticsRepository;

    @Autowired(required = false)
    private ShortenedUrlRepository shortenedUrlRepository;

    @Autowired(required = false)
    private UserRepository userRepository;

    @Autowired(required = false)
    private CacheService cacheService;

    @CacheEvict(value = { "urlAnalytics", "userAnalytics", "clickCounts",
            "realtimeAnalytics" }, key = "#shortCode", beforeInvocation = false)
    public ClickAnalytics recordClick(String domain, String shortCode, String ipAddress, String userAgent,
            String referrer, String country, String region, String city,
            String deviceType, String browser, String os) {

        // Check if repositories are available
        if (shortenedUrlRepository == null || clickAnalyticsRepository == null) {
            logger.warn("Analytics repositories not available - running in simple mode");
            return null;
        }

        // Get the shortened URL using Strict Lookup
        Optional<ShortenedUrl> urlOpt = shortenedUrlRepository.findByShortCodeAndDomain(shortCode, domain);
        if (urlOpt.isEmpty()) {
            throw new RuntimeException("Short URL not found for domain: " + domain);
        }

        ShortenedUrl shortenedUrl = urlOpt.get();

        // Create analytics record
        ClickAnalytics analytics = new ClickAnalytics(shortCode, shortenedUrl.getUserId(), ipAddress, userAgent);

        // Set geographic data
        analytics.setCountry(country);
        analytics.setRegion(region);
        analytics.setCity(city);

        // Set device data
        analytics.setDeviceType(deviceType);
        analytics.setBrowser(browser);
        analytics.setOperatingSystem(os);
        analytics.setMobile("MOBILE".equals(deviceType));

        // Set referrer data
        analytics.setReferrer(referrer);
        if (referrer != null && !referrer.isEmpty()) {
            try {
                java.net.URL url = new java.net.URL(referrer);
                analytics.setReferrerDomain(url.getHost());
                analytics.setReferrerType(determineReferrerType(url.getHost()));
            } catch (Exception e) {
                analytics.setReferrerType("DIRECT");
            }
        } else {
            analytics.setReferrerType("DIRECT");
        }

        // Copy UTM fields from parent ShortenedUrl to click record
        if (shortenedUrl.getUtmSource() != null) {
            analytics.setUtmSource(shortenedUrl.getUtmSource());
        }
        if (shortenedUrl.getUtmMedium() != null) {
            analytics.setUtmMedium(shortenedUrl.getUtmMedium());
        }
        if (shortenedUrl.getUtmCampaign() != null) {
            analytics.setUtmCampaign(shortenedUrl.getUtmCampaign());
        }

        // Check if this is a unique click (same IP in last 24 hours)
        LocalDateTime yesterday = LocalDateTime.now().minus(1, ChronoUnit.DAYS);
        List<ClickAnalytics> recentClicks = clickAnalyticsRepository
                .findByShortCodeAndClickedAtBetween(shortCode, yesterday, LocalDateTime.now());

        boolean isUnique = recentClicks.stream()
                .noneMatch(click -> ipAddress.equals(click.getIpAddress()));
        analytics.setUniqueClick(isUnique);

        // Save analytics
        ClickAnalytics saved = clickAnalyticsRepository.save(analytics);

        // Update URL statistics
        updateUrlStatistics(shortenedUrl, analytics);

        // Invalidate relevant caches
        cacheService.invalidateUrlAnalytics(shortCode, shortenedUrl.getUserId());

        logger.debug("Recorded click for URL: {} from IP: {}", shortCode, ipAddress);

        return saved;
    }

    @Cacheable(value = "urlAnalytics", key = "#shortCode + ':' + #userId")
    public Map<String, Object> getUrlAnalytics(String shortCode, String userId) {
        // Verify ownership
        Optional<ShortenedUrl> urlOpt = shortenedUrlRepository.findByShortCode(shortCode);
        if (urlOpt.isEmpty()) {
            throw new RuntimeException("Short URL not found");
        }

        ShortenedUrl url = urlOpt.get();
        if (!url.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized to view analytics");
        }

        Map<String, Object> analytics = new HashMap<>();

        // URL info
        analytics.put("originalUrl", url.getOriginalUrl());
        analytics.put("shortUrl", url.getShortUrl());
        analytics.put("createdAt", url.getCreatedAt());

        // Basic statistics
        analytics.put("totalClicks", url.getTotalClicks());
        analytics.put("uniqueClicks", url.getUniqueClicks());
        analytics.put("todayClicks", url.getTodayClicks());
        analytics.put("thisWeekClicks", url.getThisWeekClicks());
        analytics.put("thisMonthClicks", url.getThisMonthClicks());

        // Geographic data
        analytics.put("clicksByCountry", url.getClicksByCountry());
        analytics.put("clicksByRegion", url.getClicksByRegion());
        analytics.put("clicksByCity", url.getClicksByCity());

        // Device data
        analytics.put("clicksByDevice", url.getClicksByDevice());
        analytics.put("clicksByBrowser", url.getClicksByBrowser());
        analytics.put("clicksByOS", url.getClicksByOS());

        // Referrer data
        analytics.put("clicksByReferrer", url.getClicksByReferrer());

        // UTM data
        analytics.put("clicksByUtmSource", url.getClicksByUtmSource());
        analytics.put("clicksByUtmMedium", url.getClicksByUtmMedium());
        analytics.put("clicksByUtmCampaign", url.getClicksByUtmCampaign());

        // Time-based data
        analytics.put("clicksByHour", url.getClicksByHour());
        analytics.put("clicksByDay", url.getClicksByDay());

        // Recent activity
        LocalDateTime last7Days = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        List<ClickAnalytics> recentClicks = clickAnalyticsRepository
                .findByShortCodeAndClickedAtBetween(shortCode, last7Days, LocalDateTime.now());

        Map<String, Long> dailyClicks = recentClicks.stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickedAt().toLocalDate().toString(),
                        Collectors.counting()));

        analytics.put("last7DaysClicks", dailyClicks);

        logger.debug("Retrieved analytics for URL: {} (user: {})", shortCode, userId);

        return analytics;
    }

    @Cacheable(value = "userAnalytics", key = "#userId")
    public Map<String, Object> getUserAnalytics(String userId) {
        // Get user's URLs
        List<ShortenedUrl> userUrls = shortenedUrlRepository.findByUserId(userId);

        Map<String, Object> analytics = new HashMap<>();

        // Overall statistics
        int totalUrls = userUrls.size();
        int totalClicks = userUrls.stream().mapToInt(ShortenedUrl::getTotalClicks).sum();
        int totalUniqueClicks = userUrls.stream().mapToInt(ShortenedUrl::getUniqueClicks).sum();

        analytics.put("totalUrls", totalUrls);
        analytics.put("totalClicks", totalClicks);
        analytics.put("totalUniqueClicks", totalUniqueClicks);

        // Top performing URLs
        List<Map<String, Object>> topUrls = userUrls.stream()
                .sorted((a, b) -> Integer.compare(b.getTotalClicks(), a.getTotalClicks()))
                .limit(10)
                .map(url -> {
                    Map<String, Object> urlData = new HashMap<>();
                    urlData.put("shortCode", url.getShortCode());
                    urlData.put("originalUrl", url.getOriginalUrl());
                    urlData.put("title", url.getTitle());
                    urlData.put("totalClicks", url.getTotalClicks());
                    urlData.put("createdAt", url.getCreatedAt());
                    return urlData;
                })
                .collect(Collectors.toList());

        analytics.put("topUrls", topUrls);

        // Aggregate geographic data
        Map<String, Integer> allCountries = new HashMap<>();
        Map<String, Integer> allRegions = new HashMap<>();
        Map<String, Integer> allCities = new HashMap<>();
        Map<String, Integer> allDevices = new HashMap<>();
        Map<String, Integer> allBrowsers = new HashMap<>();

        for (ShortenedUrl url : userUrls) {
            url.getClicksByCountry().forEach((country, count) -> allCountries.merge(country, count, Integer::sum));
            url.getClicksByRegion().forEach((region, count) -> allRegions.merge(region, count, Integer::sum));
            url.getClicksByCity().forEach((city, count) -> allCities.merge(city, count, Integer::sum));
            url.getClicksByDevice().forEach((device, count) -> allDevices.merge(device, count, Integer::sum));
            url.getClicksByBrowser().forEach((browser, count) -> allBrowsers.merge(browser, count, Integer::sum));
        }

        analytics.put("clicksByCountry", allCountries);
        analytics.put("clicksByRegion", allRegions);
        analytics.put("clicksByCity", allCities);
        analytics.put("clicksByDevice", allDevices);
        analytics.put("clicksByBrowser", allBrowsers);

        // Campaign tracking: aggregate clicks by utmCampaign
        Map<String, Integer> clicksByCampaign = new HashMap<>();
        for (ShortenedUrl url : userUrls) {
            if (url.getUtmCampaign() != null && !url.getUtmCampaign().isEmpty()) {
                clicksByCampaign.merge(url.getUtmCampaign(), url.getTotalClicks(), Integer::sum);
            }
        }
        analytics.put("clicksByCampaign", clicksByCampaign);

        // Campaign details: list of campaigns with source/medium info
        List<Map<String, Object>> campaignDetails = userUrls.stream()
                .filter(url -> url.getUtmCampaign() != null && !url.getUtmCampaign().isEmpty())
                .collect(Collectors.groupingBy(ShortenedUrl::getUtmCampaign))
                .entrySet().stream()
                .map(entry -> {
                    Map<String, Object> campaign = new HashMap<>();
                    campaign.put("campaign", entry.getKey());
                    campaign.put("totalClicks", entry.getValue().stream().mapToInt(ShortenedUrl::getTotalClicks).sum());
                    campaign.put("totalLinks", entry.getValue().size());
                    // Get source from first link in group
                    campaign.put("source", entry.getValue().get(0).getUtmSource());
                    campaign.put("medium", entry.getValue().get(0).getUtmMedium());
                    return campaign;
                })
                .sorted((a, b) -> Integer.compare((int) b.get("totalClicks"), (int) a.get("totalClicks")))
                .collect(Collectors.toList());
        analytics.put("campaignDetails", campaignDetails);

        // Recent activity (last 30 days)
        LocalDateTime last30Days = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        List<ClickAnalytics> recentClicks = clickAnalyticsRepository
                .findByUserIdAndClickedAtBetween(userId, last30Days, LocalDateTime.now());

        Map<String, Long> dailyActivity = recentClicks.stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickedAt().toLocalDate().toString(),
                        Collectors.counting()));

        analytics.put("last30DaysActivity", dailyActivity);

        logger.debug("Retrieved user analytics for user: {}", userId);

        return analytics;
    }

    @Cacheable(value = "realtimeAnalytics", key = "#userId")
    public Map<String, Object> getRealtimeAnalytics(String userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime hourStart = now.truncatedTo(ChronoUnit.HOURS);

        // Get today's clicks for user
        List<ClickAnalytics> todayClicks = clickAnalyticsRepository
                .findByUserIdAndClickedAtBetween(userId, todayStart, now);

        // Get this hour's clicks
        List<ClickAnalytics> thisHourClicks = clickAnalyticsRepository
                .findByUserIdAndClickedAtBetween(userId, hourStart, now);

        Map<String, Object> realtime = new HashMap<>();
        realtime.put("clicksToday", todayClicks.size());
        realtime.put("clicksThisHour", thisHourClicks.size());
        realtime.put("uniqueClicksToday", todayClicks.stream()
                .collect(Collectors.groupingBy(ClickAnalytics::getIpAddress))
                .size());

        // Recent clicks (last 10)
        List<ClickAnalytics> recentClicks = clickAnalyticsRepository
                .findByUserId(userId)
                .stream()
                .sorted((a, b) -> b.getClickedAt().compareTo(a.getClickedAt()))
                .limit(10)
                .collect(Collectors.toList());

        List<Map<String, Object>> recentActivity = recentClicks.stream()
                .map(click -> {
                    Map<String, Object> activity = new HashMap<>();
                    activity.put("shortCode", click.getShortCode());
                    activity.put("country", click.getCountry());
                    activity.put("deviceType", click.getDeviceType());
                    activity.put("browser", click.getBrowser());
                    activity.put("clickedAt", click.getClickedAt());
                    return activity;
                })
                .collect(Collectors.toList());

        realtime.put("recentActivity", recentActivity);
        realtime.put("timestamp", now);

        logger.debug("Retrieved realtime analytics for user: {}", userId);

        return realtime;
    }

    /**
     * Get system-wide analytics for Admin Dashboard
     */
    @Cacheable(value = "systemAnalytics", key = "'admin'")
    public Map<String, Object> getSystemAnalytics() {
        if (shortenedUrlRepository == null || clickAnalyticsRepository == null) {
            return new HashMap<>();
        }

        Map<String, Object> analytics = new HashMap<>();

        // Overall Counters
        long totalUsers = (userRepository != null) ? userRepository.count() : 0;
        long activeLinks = shortenedUrlRepository.count();
        long totalClicks = clickAnalyticsRepository.count();

        // Calculate monthly revenue (placeholder - would need subscription data)
        double monthlyRevenue = 0.0;

        analytics.put("totalUsers", totalUsers);
        analytics.put("activeLinks", activeLinks);
        analytics.put("totalClicks", totalClicks);
        analytics.put("monthlyRevenue", monthlyRevenue);

        // Top Performing Links (Global)
        // Since we don't have a direct repository method for top URLs global,
        // we can fetch a batch or rely on the `top 10` by clicks if we had an index.
        // For now, let's just get top 10 from all URLs (might be slow if millions of
        // URLs, fine for demo)
        List<Map<String, Object>> topUrls = shortenedUrlRepository.findAll().stream()
                .sorted((a, b) -> Integer.compare(b.getTotalClicks(), a.getTotalClicks()))
                .limit(10)
                .map(url -> {
                    Map<String, Object> urlData = new HashMap<>();
                    urlData.put("shortCode", url.getShortCode());
                    urlData.put("originalUrl", url.getOriginalUrl());
                    urlData.put("totalClicks", url.getTotalClicks());
                    return urlData;
                })
                .collect(Collectors.toList());
        analytics.put("topUrls", topUrls);

        // Aggregations using Repository Methods
        analytics.put("topCountries", formatAggregationResult(clickAnalyticsRepository.getTopCountriesSystemWide()));
        analytics.put("topDevices", formatAggregationResult(clickAnalyticsRepository.getTopDevicesSystemWide()));
        analytics.put("topBrowsers", formatAggregationResult(clickAnalyticsRepository.getTopBrowsersSystemWide()));

        // Daily Clicks System Wide (Last 30 Days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Object> dailyClicksRaw = clickAnalyticsRepository.getDailyClicksSystemWide(thirtyDaysAgo);
        Map<String, Long> dailyClicks = new TreeMap<>(); // Sorted map

        // Populate dailyClicks map
        for (Object result : dailyClicksRaw) {
            if (result instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) result;
                String date = (String) map.get("_id");
                Number count = (Number) map.get("count");
                dailyClicks.put(date, count.longValue());
            }
        }

        analytics.put("clicksOverTime", dailyClicks);

        return analytics;
    }

    private Map<String, Long> formatAggregationResult(List<Object> results) {
        Map<String, Long> formatted = new HashMap<>();
        for (Object result : results) {
            if (result instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) result;
                String key = (String) map.get("_id");
                Number count = (Number) map.get("count");
                if (key != null) {
                    formatted.put(key, count.longValue());
                }
            }
        }
        return formatted;
    }

    private void updateUrlStatistics(ShortenedUrl url, ClickAnalytics analytics) {
        // Update basic counters
        url.setTotalClicks(url.getTotalClicks() + 1);
        if (analytics.isUniqueClick()) {
            url.setUniqueClicks(url.getUniqueClicks() + 1);
        }

        // Update time-based counters
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = now.toLocalDate().atStartOfDay();
        LocalDateTime weekStart = now.minus(7, ChronoUnit.DAYS);
        LocalDateTime monthStart = now.minus(30, ChronoUnit.DAYS);

        if (analytics.getClickedAt().isAfter(todayStart)) {
            url.setTodayClicks(url.getTodayClicks() + 1);
        }
        if (analytics.getClickedAt().isAfter(weekStart)) {
            url.setThisWeekClicks(url.getThisWeekClicks() + 1);
        }
        if (analytics.getClickedAt().isAfter(monthStart)) {
            url.setThisMonthClicks(url.getThisMonthClicks() + 1);
        }

        // Update geographic data
        if (analytics.getCountry() != null) {
            url.getClicksByCountry().merge(analytics.getCountry(), 1, Integer::sum);
        }
        if (analytics.getRegion() != null) {
            url.getClicksByRegion().merge(analytics.getRegion(), 1, Integer::sum);
        }
        if (analytics.getCity() != null) {
            url.getClicksByCity().merge(analytics.getCity(), 1, Integer::sum);
        }

        // Update device data
        if (analytics.getDeviceType() != null) {
            url.getClicksByDevice().merge(analytics.getDeviceType(), 1, Integer::sum);
        }
        if (analytics.getBrowser() != null) {
            url.getClicksByBrowser().merge(analytics.getBrowser(), 1, Integer::sum);
        }
        if (analytics.getOperatingSystem() != null) {
            url.getClicksByOS().merge(analytics.getOperatingSystem(), 1, Integer::sum);
        }

        // Update referrer data
        if (analytics.getReferrerDomain() != null) {
            url.getClicksByReferrer().merge(analytics.getReferrerDomain(), 1, Integer::sum);
        }

        // Update UTM data
        if (analytics.getUtmSource() != null) {
            url.getClicksByUtmSource().merge(analytics.getUtmSource(), 1, Integer::sum);
        }
        if (analytics.getUtmMedium() != null) {
            url.getClicksByUtmMedium().merge(analytics.getUtmMedium(), 1, Integer::sum);
        }
        if (analytics.getUtmCampaign() != null) {
            url.getClicksByUtmCampaign().merge(analytics.getUtmCampaign(), 1, Integer::sum);
        }

        // Update time-based data
        String hourKey = String.valueOf(now.getHour());
        String dayKey = now.getDayOfWeek().toString();

        url.getClicksByHour().merge(hourKey, 1, Integer::sum);
        url.getClicksByDay().merge(dayKey, 1, Integer::sum);

        url.setLastClickedAt(now);
        url.setUpdatedAt(now);

        shortenedUrlRepository.save(url);
    }

    private String determineReferrerType(String domain) {
        if (domain == null)
            return "DIRECT";

        domain = domain.toLowerCase();

        if (domain.contains("google") || domain.contains("bing") || domain.contains("yahoo")) {
            return "SEARCH";
        } else if (domain.contains("facebook") || domain.contains("twitter") ||
                domain.contains("linkedin") || domain.contains("instagram")) {
            return "SOCIAL";
        } else if (domain.contains("gmail") || domain.contains("outlook") ||
                domain.contains("mail")) {
            return "EMAIL";
        } else {
            return "WEBSITE";
        }
    }
}