package com.urlshortener.service;

import com.urlshortener.dto.SlugCheckResponse;
import com.urlshortener.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class SlugService {

  private final PageRepository pageRepository;

  // Review #2: Use Set<String> for O(1) lookups instead of List<String> O(n).
  // Reserved words are pre-lowercased at startup — no .toLowerCase() on every
  // check.
  private final Set<String> reservedWords;

  // Review #1: Enforce first character must be a letter (no leading numbers).
  private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$");
  private static final int MAX_SLUG_LENGTH = 60;

  // Default reserved words — system routes and special slugs that should never be
  // used as page slugs.
  private static final Set<String> DEFAULT_RESERVED_WORDS = Set.of(
      "admin", "api", "app", "auth", "billing", "blog", "careers", "checkout",
      "connect", "contact", "dashboard", "docs", "download", "explore", "faq",
      "features", "feedback", "forgot-password", "health", "help", "home",
      "integrations", "internal", "invite", "jobs", "legal", "login", "logout",
      "onboarding", "pages", "partners", "plans", "pricing", "privacy",
      "profile", "register", "reset-password", "search", "security", "settings",
      "setup", "signup", "sitemap", "status", "subscribe", "support",
      "templates", "terms", "unsubscribe", "upgrade", "verify", "webhooks",
      "widget", "official", "verified", "staff", "team", "moderator", "mod",
      "null", "undefined", "test", "example", "demo", "sample");

  @Autowired
  public SlugService(PageRepository pageRepository) {
    this.pageRepository = pageRepository;
    this.reservedWords = DEFAULT_RESERVED_WORDS;
  }

  public String sanitizeSlug(String input) {
    if (input == null || input.isBlank())
      return "";

    // Lowercase first
    String slug = input.toLowerCase().trim();

    // Review #10: Strip URL prefixes if user pastes a full URL.
    // Server-side should never trust the client — defense in depth.
    slug = slug.replaceAll("^https?://[^/]+/?", "");

    // Remove special chars (keep only alphanumeric and hyphens)
    slug = slug.replaceAll("[^a-z0-9-]", "-");

    // Remove consecutive hyphens
    slug = slug.replaceAll("-+", "-");

    // Remove leading/trailing hyphens
    slug = slug.replaceAll("^-|-$", "");

    // Review #1: Strip leading digits — slugs must start with a letter.
    slug = slug.replaceAll("^[0-9]+(-?)", "");

    // Truncate to max length
    if (slug.length() > MAX_SLUG_LENGTH) {
      slug = slug.substring(0, MAX_SLUG_LENGTH);
      // Ensure truncation didn't leave a trailing hyphen
      slug = slug.replaceAll("-$", "");
    }

    return slug;
  }

  /**
   * Validates a slug against the canonical pattern.
   * Must start with a letter, contain only lowercase alphanumerics and hyphens.
   */
  public boolean isValidSlug(String slug) {
    return slug != null && !slug.isEmpty() && SLUG_PATTERN.matcher(slug).matches();
  }

  // Review #2: O(1) lookup via HashSet, input pre-lowercased.
  public boolean isSlugReserved(String slug) {
    return reservedWords.contains(slug.toLowerCase());
  }

  public boolean isSlugAvailable(String slug) {
    if (isSlugReserved(slug))
      return false;
    return !pageRepository.existsBySlug(slug);
  }

  // Review #3: Returns type-safe SlugCheckResponse instead of raw Map<String,
  // Object>.
  public SlugCheckResponse checkSlugAvailability(String slug, String excludePageId) {
    String sanitizedSlug = sanitizeSlug(slug);

    if (sanitizedSlug.isEmpty()) {
      return SlugCheckResponse.available(sanitizedSlug);
    }

    // Check if reserved
    if (isSlugReserved(sanitizedSlug)) {
      return SlugCheckResponse.reserved(sanitizedSlug);
    }

    // Review #4: Use existsBySlugAndIdNot for edit-mode check — avoids loading
    // the full Page document just to compare a single ID field.
    boolean taken;
    if (excludePageId != null && !excludePageId.isEmpty()) {
      taken = pageRepository.existsBySlugAndIdNot(sanitizedSlug, excludePageId);
    } else {
      taken = pageRepository.existsBySlug(sanitizedSlug);
    }

    if (taken) {
      return SlugCheckResponse.taken(sanitizedSlug, generateSuggestions(sanitizedSlug));
    }

    return SlugCheckResponse.available(sanitizedSlug);
  }

  private List<String> generateSuggestions(String baseSlug) {
    // Use LinkedHashSet to preserve insertion order (deterministic suggestions)
    Set<String> candidates = new LinkedHashSet<>();

    // Strategy 1: Numbered variants
    for (int i = 1; i <= 3; i++) {
      candidates.add(baseSlug + "-" + i);
    }

    // Strategy 2: Compact (remove hyphens)
    String compact = baseSlug.replace("-", "");
    if (!compact.equals(baseSlug) && compact.length() >= 3) {
      candidates.add(compact);
    }

    // Strategy 3: Abbreviation (first char + last word) e.g., s-johnson
    // Review #6: Guard against abbreviations shorter than 3 characters.
    String[] parts = baseSlug.split("-");
    if (parts.length > 1) {
      String abbrev1 = parts[0].charAt(0) + "-" + parts[parts.length - 1]; // s-johnson
      String abbrev2 = parts[0] + parts[parts.length - 1].charAt(0); // sarahj
      if (abbrev1.length() >= 3 && !abbrev1.equals(baseSlug)) {
        candidates.add(abbrev1);
      }
      if (abbrev2.length() >= 3) {
        candidates.add(abbrev2);
      }
    }

    // Strategy 4: Contextual suffixes
    String[] suffixes = { "links", "page", "bio", "me", "official", "hub" };
    for (String suffix : suffixes) {
      candidates.add(baseSlug + "-" + suffix);
    }

    // Strategy 5: Random short suffix
    // Review #9: UUID.randomUUID().substring(0,4) produces hex chars (a-f, 0-9),
    // which are all valid slug characters — no additional validation needed.
    for (int i = 0; i < 3; i++) {
      candidates.add(baseSlug + "-" + UUID.randomUUID().toString().substring(0, 4));
    }

    // Batch check availability — Review #5: consistently use List for repo calls
    List<String> candidateList = new ArrayList<>(candidates);
    Set<String> takenSlugs = pageRepository.findBySlugIn(candidateList).stream()
        .map(com.urlshortener.model.Page::getSlug)
        .collect(Collectors.toSet());

    List<String> available = new ArrayList<>();
    for (String candidate : candidateList) {
      if (available.size() >= 5)
        break;
      if (!takenSlugs.contains(candidate) && !isSlugReserved(candidate)) {
        available.add(candidate);
      }
    }

    // Review #7: Fallback — ONE additional batch only. Never loop more than twice
    // to prevent performance degradation on heavily contested slugs.
    if (available.size() < 5) {
      List<String> fallbackCandidates = new ArrayList<>();
      for (int i = 0; i < 10; i++) {
        // Review #9: Hex chars from UUID are valid slug characters (a-f, 0-9)
        fallbackCandidates.add(baseSlug + "-" + UUID.randomUUID().toString().substring(0, 6));
      }

      // Review #5: Consistently pass List to findBySlugIn
      Set<String> takenFallbackSlugs = pageRepository.findBySlugIn(fallbackCandidates).stream()
          .map(com.urlshortener.model.Page::getSlug)
          .collect(Collectors.toSet());

      for (String fallback : fallbackCandidates) {
        if (available.size() >= 5)
          break;
        if (!takenFallbackSlugs.contains(fallback) && !isSlugReserved(fallback)) {
          available.add(fallback);
        }
      }
    }

    return available.stream().limit(5).collect(Collectors.toList());
  }
}
