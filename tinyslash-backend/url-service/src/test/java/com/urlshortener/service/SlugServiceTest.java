package com.urlshortener.service;

import com.urlshortener.dto.SlugCheckResponse;
import com.urlshortener.repository.PageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class SlugServiceTest {

  @Mock
  private PageRepository pageRepository;

  @InjectMocks
  private SlugService slugService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    // Inject reserved words as a HashSet (matching constructor logic)
    Set<String> reserved = new HashSet<>(Arrays.asList("admin", "login", "api", "dashboard"));
    ReflectionTestUtils.setField(slugService, "reservedWords", reserved);
  }

  // ─── sanitizeSlug tests ──────────────────────────────────────────

  @Test
  void testSanitizeSlug_basic() {
    assertEquals("hello-world", slugService.sanitizeSlug("Hello World"));
    assertEquals("user-page", slugService.sanitizeSlug("User  Page"));
    assertEquals("cool-stuff", slugService.sanitizeSlug("Cool_Stuff!"));
    assertEquals("test-123", slugService.sanitizeSlug("Test-123"));
    assertEquals("a-b", slugService.sanitizeSlug("-a----b-"));
  }

  @Test
  void testSanitizeSlug_stripsLeadingNumbers() {
    // Review #1: Slugs must start with a letter
    assertEquals("hello", slugService.sanitizeSlug("123hello"));
    assertEquals("abc", slugService.sanitizeSlug("99abc"));
    // All digits should result in empty
    assertEquals("", slugService.sanitizeSlug("12345"));
  }

  @Test
  void testSanitizeSlug_maxLength() {
    String longInput = "a" + "b".repeat(100);
    String result = slugService.sanitizeSlug(longInput);
    assertTrue(result.length() <= 60);
    assertFalse(result.endsWith("-"));
  }

  @Test
  void testSanitizeSlug_stripsUrlPrefixes() {
    // Review #10: Server-side URL prefix stripping
    assertEquals("my-slug", slugService.sanitizeSlug("https://mysite.com/my-slug"));
    assertEquals("cool-page", slugService.sanitizeSlug("http://example.org/cool-page"));
    assertEquals("path", slugService.sanitizeSlug("https://x.com/path"));
  }

  @Test
  void testSanitizeSlug_nullAndEmpty() {
    assertEquals("", slugService.sanitizeSlug(null));
    assertEquals("", slugService.sanitizeSlug(""));
    assertEquals("", slugService.sanitizeSlug("   "));
  }

  // ─── isSlugReserved tests ────────────────────────────────────────

  @Test
  void testIsSlugReserved() {
    assertTrue(slugService.isSlugReserved("admin"));
    assertTrue(slugService.isSlugReserved("API")); // Case insensitive
    assertTrue(slugService.isSlugReserved("Login")); // Case insensitive
    assertFalse(slugService.isSlugReserved("my-page"));
    assertFalse(slugService.isSlugReserved("cool-site"));
  }

  // ─── isValidSlug tests ───────────────────────────────────────────

  @Test
  void testIsValidSlug() {
    assertTrue(slugService.isValidSlug("hello-world"));
    assertTrue(slugService.isValidSlug("mypage"));
    assertTrue(slugService.isValidSlug("a1b2c3"));
    assertFalse(slugService.isValidSlug("123start")); // No leading numbers
    assertFalse(slugService.isValidSlug("-bad")); // No leading hyphens
    assertFalse(slugService.isValidSlug("bad-")); // No trailing hyphens
    assertFalse(slugService.isValidSlug("BAD")); // Must be lowercase
    assertFalse(slugService.isValidSlug(""));
    assertFalse(slugService.isValidSlug(null));
  }

  // ─── checkSlugAvailability tests ─────────────────────────────────

  @Test
  void testCheckSlug_available() {
    when(pageRepository.existsBySlug("new-page")).thenReturn(false);

    SlugCheckResponse result = slugService.checkSlugAvailability("new-page", null);
    assertTrue(result.isAvailable());
    assertFalse(result.isReserved());
    assertEquals("new-page", result.getSlug());
    assertTrue(result.getSuggestions().isEmpty());
  }

  @Test
  void testCheckSlug_reserved() {
    SlugCheckResponse result = slugService.checkSlugAvailability("admin", null);
    assertFalse(result.isAvailable());
    assertTrue(result.isReserved());
    assertTrue(result.getSuggestions().isEmpty());
  }

  @Test
  void testCheckSlug_taken_hasSuggestions() {
    when(pageRepository.existsBySlug("taken")).thenReturn(true);
    // Mock batch check — return empty list (all candidates available)
    when(pageRepository.findBySlugIn(any())).thenReturn(Collections.emptyList());

    SlugCheckResponse result = slugService.checkSlugAvailability("taken", null);
    assertFalse(result.isAvailable());
    assertFalse(result.isReserved());
    assertNotNull(result.getSuggestions());
    assertFalse(result.getSuggestions().isEmpty());
    assertTrue(result.getSuggestions().size() <= 5);
  }

  @Test
  void testCheckSlug_editMode_ownSlugAvailable() {
    // Review #4: Uses existsBySlugAndIdNot for edit-mode
    String myPageId = "123";
    when(pageRepository.existsBySlugAndIdNot("my-page", myPageId)).thenReturn(false);

    SlugCheckResponse result = slugService.checkSlugAvailability("my-page", myPageId);
    assertTrue(result.isAvailable(), "Own slug should be available in edit mode");
  }

  @Test
  void testCheckSlug_editMode_takenByOther() {
    String myPageId = "123";
    when(pageRepository.existsBySlugAndIdNot("my-page", myPageId)).thenReturn(true);
    when(pageRepository.findBySlugIn(any())).thenReturn(Collections.emptyList());

    SlugCheckResponse result = slugService.checkSlugAvailability("my-page", myPageId);
    assertFalse(result.isAvailable(), "Slug taken by another page should not be available");
  }

  @Test
  void testCheckSlug_sanitizesInput() {
    // "Hello World" sanitizes to "hello-world"
    when(pageRepository.existsBySlug("hello-world")).thenReturn(false);

    SlugCheckResponse result = slugService.checkSlugAvailability("Hello World", null);
    assertEquals("hello-world", result.getSlug());
    assertTrue(result.isAvailable());
  }
}
