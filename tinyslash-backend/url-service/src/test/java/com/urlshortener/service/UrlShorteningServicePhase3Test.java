package com.urlshortener.service;

import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.model.User;
import com.urlshortener.repository.ShortenedUrlRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.service.UrlShorteningService;
import com.urlshortener.service.SubscriptionService;
import com.urlshortener.service.CacheService;
import com.urlshortener.service.SequenceGeneratorService;
import com.urlshortener.service.SecurityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UrlShorteningServicePhase3Test {

  @Mock
  private ShortenedUrlRepository shortenedUrlRepository;

  @Mock
  private UserRepository userRepository;

  @Mock
  private SubscriptionService subscriptionService;

  @Mock
  private CacheService cacheService;

  @Mock
  private SequenceGeneratorService sequenceGenerator;

  @Mock
  private SecurityService securityService;

  @InjectMocks
  private UrlShorteningService urlShorteningService;

  private final String userId = "user123";
  private final String customDomain = "custom.com";
  private final String defaultDomain = "tinyslash.com";

  @BeforeEach
  void setUp() {
    ReflectionTestUtils.setField(urlShorteningService, "shortUrlDomain", "https://" + defaultDomain);

    // Mock successful security check
    // Mock successful security check
    com.urlshortener.dto.SecurityDecision safeDecision = com.urlshortener.dto.SecurityDecision.allow(0, null);
    lenient().when(securityService.preCheckUrl(anyString(), any())).thenReturn(safeDecision);

    // Mock subscription allows
    lenient().when(subscriptionService.canCreateUrl(anyString())).thenReturn(true);
    lenient().when(subscriptionService.canUseCustomAlias(anyString())).thenReturn(true);
    lenient().when(userRepository.findById(anyString())).thenReturn(Optional.of(new User()));
  }

  @Test
  void createShortUrl_CustomDomain_Success() {
    ShortenedUrl template = new ShortenedUrl();
    template.setOriginalUrl("https://example.com");
    template.setUserId(userId);
    template.setCustomAlias("sale"); // Normalized to "sale"
    template.setDomain(customDomain);

    when(shortenedUrlRepository.save(any(ShortenedUrl.class))).thenAnswer(i -> i.getArguments()[0]);

    ShortenedUrl result = urlShorteningService.createShortUrl(template);

    assertNotNull(result);
    assertEquals("sale", result.getShortCode());
    assertEquals(customDomain, result.getDomain());
    verify(shortenedUrlRepository, times(1)).save(any(ShortenedUrl.class));
  }

  @Test
  void createShortUrl_DuplicateAlias_ThrowsException() {
    ShortenedUrl template = new ShortenedUrl();
    template.setOriginalUrl("https://example.com");
    template.setUserId(userId);
    template.setCustomAlias("sale");
    template.setDomain(customDomain);

    // Mock DuplicateKeyException on save
    when(shortenedUrlRepository.save(any(ShortenedUrl.class))).thenThrow(new DuplicateKeyException("Duplicate key"));

    Exception exception = assertThrows(RuntimeException.class, () -> {
      urlShorteningService.createShortUrl(template);
    });

    assertTrue(exception.getMessage().contains("already taken"));
  }

  @Test
  void deleteUrl_CustomDomain_HardDelete() {
    ShortenedUrl url = new ShortenedUrl();
    url.setShortCode("sale");
    url.setDomain(customDomain);
    url.setUserId(userId);

    when(shortenedUrlRepository.findByShortCodeAndUserId("sale", userId)).thenReturn(List.of(url));

    urlShorteningService.deleteUrl("sale", userId);

    verify(shortenedUrlRepository, times(1)).delete(url); // Hard delete
    verify(shortenedUrlRepository, never()).save(any(ShortenedUrl.class)); // No soft delete save
  }

  @Test
  void deleteUrl_DefaultDomain_SoftDelete() {
    ShortenedUrl url = new ShortenedUrl();
    url.setShortCode("sale");
    url.setDomain(defaultDomain); // Default domain
    url.setUserId(userId);

    when(shortenedUrlRepository.findByShortCodeAndUserId("sale", userId)).thenReturn(List.of(url));

    urlShorteningService.deleteUrl("sale", userId);

    verify(shortenedUrlRepository, never()).delete(url); // No hard delete
    verify(shortenedUrlRepository, times(1)).save(argThat(savedUrl -> savedUrl.isDeleted() == true &&
        savedUrl.getDeletedAt() != null &&
        savedUrl.isActive() == false)); // Soft delete verify
  }

  @Test
  void isAliasAvailable_ChecksForReservedWords() {
    boolean available = urlShorteningService.isAliasAvailable(defaultDomain, "admin");
    assertFalse(available, "Reserved word 'admin' should not be available on default domain");

    available = urlShorteningService.isAliasAvailable(customDomain, "admin");
    // Mock DB returning empty
    lenient().when(shortenedUrlRepository.findByShortCodeAndDomain("admin", customDomain)).thenReturn(Optional.empty());
    assertTrue(available, "Reserved word 'admin' SHOULD be available on custom domain");
  }

  @Test
  void isAliasAvailable_ChecksDatabase() {
    when(shortenedUrlRepository.findByShortCodeAndDomain("taken", defaultDomain))
        .thenReturn(Optional.of(new ShortenedUrl()));

    boolean available = urlShorteningService.isAliasAvailable(defaultDomain, "taken");
    assertFalse(available);
  }
}
