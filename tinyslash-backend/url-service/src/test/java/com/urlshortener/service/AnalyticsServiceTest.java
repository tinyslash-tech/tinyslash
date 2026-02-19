package com.urlshortener.service;

import com.urlshortener.model.ClickAnalytics;
import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.repository.ClickAnalyticsRepository;
import com.urlshortener.repository.ShortenedUrlRepository;
import com.urlshortener.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AnalyticsService Tests")
class AnalyticsServiceTest {

  @Mock
  private ClickAnalyticsRepository clickAnalyticsRepository;
  @Mock
  private ShortenedUrlRepository shortenedUrlRepository;
  @Mock
  private UserRepository userRepository;
  @Mock
  private CacheService cacheService;

  @InjectMocks
  private AnalyticsService analyticsService;

  private ShortenedUrl mockUrl;

  @BeforeEach
  void setUp() {
    mockUrl = new ShortenedUrl();
    mockUrl.setShortCode("abc123");
    mockUrl.setOriginalUrl("https://google.com");
    mockUrl.setUserId("user-1");
    mockUrl.setDomain("tinyslash.com");
  }

  @Test
  @DisplayName("recordClick - should throw when URL not found")
  void recordClick_UrlNotFound_ShouldThrow() {
    when(shortenedUrlRepository.findByShortCodeAndDomain(anyString(), anyString()))
        .thenReturn(Optional.empty());

    assertThrows(RuntimeException.class, () -> analyticsService.recordClick(
        "tinyslash.com", "abc123",
        "127.0.0.1", "Mozilla/5.0", "https://google.com",
        "IN", "KA", "Bangalore",
        "DESKTOP", "Chrome", "Windows"));
  }

  @Test
  @DisplayName("recordClick - should save click analytics when URL found")
  void recordClick_ValidUrl_ShouldSaveAndReturn() {
    when(shortenedUrlRepository.findByShortCodeAndDomain("abc123", "tinyslash.com"))
        .thenReturn(Optional.of(mockUrl));
    when(clickAnalyticsRepository.findByShortCodeAndClickedAtBetween(anyString(), any(), any()))
        .thenReturn(Collections.emptyList());
    ClickAnalytics savedAnalytics = new ClickAnalytics("abc123", "user-1", "127.0.0.1", "Chrome");
    when(clickAnalyticsRepository.save(any(ClickAnalytics.class))).thenReturn(savedAnalytics);
    doNothing().when(cacheService).invalidateUrlAnalytics(anyString(), anyString());

    ClickAnalytics result = analyticsService.recordClick(
        "tinyslash.com", "abc123",
        "127.0.0.1", "Chrome", "https://google.com",
        "IN", "KA", "Bangalore",
        "DESKTOP", "Chrome", "Windows");

    assertNotNull(result);
    verify(clickAnalyticsRepository, times(1)).save(any(ClickAnalytics.class));
  }

  @Test
  @DisplayName("recordClick - unique click detection: same IP in 24h should NOT be unique")
  void recordClick_SameIpIn24h_ShouldNotBeUnique() {
    ClickAnalytics previousClick = new ClickAnalytics("abc123", "user-1", "127.0.0.1", "Chrome");
    when(shortenedUrlRepository.findByShortCodeAndDomain("abc123", "tinyslash.com"))
        .thenReturn(Optional.of(mockUrl));
    when(clickAnalyticsRepository.findByShortCodeAndClickedAtBetween(anyString(), any(), any()))
        .thenReturn(List.of(previousClick));
    when(clickAnalyticsRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    doNothing().when(cacheService).invalidateUrlAnalytics(anyString(), anyString());

    ClickAnalytics result = analyticsService.recordClick(
        "tinyslash.com", "abc123",
        "127.0.0.1", "Chrome", null,
        "IN", null, null,
        "DESKTOP", "Chrome", "Linux");

    assertFalse(result.isUniqueClick(), "Should not be unique — same IP within 24h");
  }

  @Test
  @DisplayName("getUrlAnalytics - should throw when URL not found")
  void getUrlAnalytics_UrlNotFound_ShouldThrow() {
    when(shortenedUrlRepository.findByShortCode("xyz")).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> analyticsService.getUrlAnalytics("xyz", "user-1"));
  }

  @Test
  @DisplayName("getUrlAnalytics - should throw when user is not the owner")
  void getUrlAnalytics_UnauthorizedUser_ShouldThrow() {
    when(shortenedUrlRepository.findByShortCode("abc123")).thenReturn(Optional.of(mockUrl));
    assertThrows(RuntimeException.class, () -> analyticsService.getUrlAnalytics("abc123", "other-user"));
  }

  @Test
  @DisplayName("getUserAnalytics - should aggregate click metrics correctly")
  void getUserAnalytics_ValidUser_ShouldReturnAggregatedData() {
    when(shortenedUrlRepository.findByUserId("user-1")).thenReturn(List.of(mockUrl));
    when(clickAnalyticsRepository.findByUserIdAndClickedAtBetween(anyString(), any(), any()))
        .thenReturn(Collections.emptyList());

    var result = analyticsService.getUserAnalytics("user-1");

    assertNotNull(result);
    assertEquals(1, result.get("totalUrls"));
    assertEquals(0, result.get("totalClicks"));
  }

  @Test
  @DisplayName("determineReferrerType - should classify referrer domains correctly")
  void recordClick_ReferrerDomains_ClassifiedCorrectly() {
    when(shortenedUrlRepository.findByShortCodeAndDomain(anyString(), anyString()))
        .thenReturn(Optional.of(mockUrl));
    when(clickAnalyticsRepository.findByShortCodeAndClickedAtBetween(anyString(), any(), any()))
        .thenReturn(Collections.emptyList());
    when(clickAnalyticsRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    doNothing().when(cacheService).invalidateUrlAnalytics(anyString(), anyString());

    ClickAnalytics result = analyticsService.recordClick(
        "tinyslash.com", "abc123",
        "1.2.3.4", "Chrome", "https://google.com/search?q=test",
        null, null, null, "DESKTOP", "Chrome", "Linux");

    // Referrer type should be "SEARCH" for google.com
    assertEquals("SEARCH", result.getReferrerType());
  }
}
