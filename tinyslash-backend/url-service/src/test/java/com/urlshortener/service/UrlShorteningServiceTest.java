package com.urlshortener.service;

import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.model.User;
import com.urlshortener.repository.ShortenedUrlRepository;
import com.urlshortener.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UrlShorteningService Tests")
class UrlShorteningServiceTest {

  @Mock
  private ShortenedUrlRepository shortenedUrlRepository;
  @Mock
  private UserRepository userRepository;
  @Mock
  private CacheService cacheService;
  @Mock
  private SubscriptionService subscriptionService;
  @Mock
  private SequenceGeneratorService sequenceGenerator;
  @Mock
  private FeistelCipher feistelCipher;
  @Mock
  private Base62Encoder base62Encoder;
  @Mock
  private SecurityService securityService;

  @InjectMocks
  private UrlShorteningService urlShorteningService;

  @BeforeEach
  void setUp() {
    // Inject the @Value field — in real app Spring injects this
    ReflectionTestUtils.setField(urlShorteningService, "shortUrlDomain", "https://tinyslash.com");
  }

  // ===== isAliasAvailable — reserved words =====

  @Test
  @DisplayName("isAliasAvailable - null alias → always unavailable")
  void isAliasAvailable_NullAlias_ShouldBeFalse() {
    assertFalse(urlShorteningService.isAliasAvailable("tinyslash.com", null));
  }

  @Test
  @DisplayName("isAliasAvailable - blank alias → always unavailable")
  void isAliasAvailable_BlankAlias_ShouldBeFalse() {
    assertFalse(urlShorteningService.isAliasAvailable("tinyslash.com", " "));
  }

  @Test
  @DisplayName("isAliasAvailable - reserved word 'admin' on default domain → unavailable")
  void isAliasAvailable_ReservedWord_DefaultDomain_ShouldBeFalse() {
    // No DB call needed — reserved check happens first
    boolean result = urlShorteningService.isAliasAvailable("tinyslash.com", "admin");
    assertFalse(result, "'admin' is a reserved word on default domain and should be unavailable");
    // Should NOT hit the DB for reserved words
    verify(shortenedUrlRepository, never()).findByShortCodeAndDomain("admin", "tinyslash.com");
  }

  @Test
  @DisplayName("isAliasAvailable - reserved word on CUSTOM domain → check DB (not reserved)")
  void isAliasAvailable_ReservedWord_CustomDomain_ShouldCheckDb() {
    // On a custom domain, reserved words are NOT blocked — availability depends on
    // DB
    when(shortenedUrlRepository.findByShortCodeAndDomain("admin", "custom.com"))
        .thenReturn(Optional.empty());
    boolean result = urlShorteningService.isAliasAvailable("custom.com", "admin");
    assertTrue(result, "Reserved words are only blocked on the DEFAULT TinySlash domain");
  }

  // ===== isAliasAvailable — DB state =====

  @Test
  @DisplayName("isAliasAvailable - alias not in DB → available")
  void isAliasAvailable_FreshAlias_ShouldBeTrue() {
    when(shortenedUrlRepository.findByShortCodeAndDomain("newlink", "tinyslash.com"))
        .thenReturn(Optional.empty());
    assertTrue(urlShorteningService.isAliasAvailable("tinyslash.com", "newlink"));
  }

  @Test
  @DisplayName("isAliasAvailable - active URL exists → unavailable")
  void isAliasAvailable_ActiveUrl_ShouldBeFalse() {
    ShortenedUrl activeUrl = new ShortenedUrl();
    activeUrl.setShortCode("popular");
    activeUrl.setDeleted(false);
    when(shortenedUrlRepository.findByShortCodeAndDomain("popular", "tinyslash.com"))
        .thenReturn(Optional.of(activeUrl));
    assertFalse(urlShorteningService.isAliasAvailable("tinyslash.com", "popular"),
        "Active URL should block alias reuse");
  }

  @Test
  @DisplayName("isAliasAvailable - soft-deleted URL still in DB → unavailable (in cooldown)")
  void isAliasAvailable_SoftDeletedUrl_ShouldBeFalse() {
    // Implementation: findByShortCodeAndDomain returns the soft-deleted record
    // (still in DB)
    // So Optional is NOT empty → returns false (record exists)
    ShortenedUrl softDeleted = new ShortenedUrl();
    softDeleted.setShortCode("mysale");
    softDeleted.setDeleted(true);
    softDeleted.setDeletedAt(LocalDateTime.now().minusDays(3));
    when(shortenedUrlRepository.findByShortCodeAndDomain("mysale", "tinyslash.com"))
        .thenReturn(Optional.of(softDeleted));
    assertFalse(urlShorteningService.isAliasAvailable("tinyslash.com", "mysale"),
        "Soft-deleted URL still in DB means alias is in cooldown and should be unavailable");
  }

  @Test
  @DisplayName("isAliasAvailable - alias removed from DB after cooldown → available")
  void isAliasAvailable_CooldownExpiredAndRemoved_ShouldBeTrue() {
    // After the 7-day cooldown, the record is cleaned up and no longer in DB
    when(shortenedUrlRepository.findByShortCodeAndDomain("oldalias", "tinyslash.com"))
        .thenReturn(Optional.empty());
    assertTrue(urlShorteningService.isAliasAvailable("tinyslash.com", "oldalias"),
        "Once the record is removed from DB, alias should be available again");
  }
}
