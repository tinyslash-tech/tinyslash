package com.urlshortener.dto;

import java.util.Collections;
import java.util.List;

/**
 * Response DTO for the slug availability check endpoint.
 * Provides compile-time type safety instead of raw Map<String, Object>.
 */
public class SlugCheckResponse {

  private final String slug;
  private final boolean available;
  private final boolean reserved;
  private final List<String> suggestions;

  private SlugCheckResponse(String slug, boolean available, boolean reserved, List<String> suggestions) {
    this.slug = slug;
    this.available = available;
    this.reserved = reserved;
    this.suggestions = suggestions != null ? suggestions : Collections.emptyList();
  }

  public static SlugCheckResponse available(String slug) {
    return new SlugCheckResponse(slug, true, false, Collections.emptyList());
  }

  public static SlugCheckResponse reserved(String slug) {
    return new SlugCheckResponse(slug, false, true, Collections.emptyList());
  }

  public static SlugCheckResponse taken(String slug, List<String> suggestions) {
    return new SlugCheckResponse(slug, false, false, suggestions);
  }

  public String getSlug() {
    return slug;
  }

  public boolean isAvailable() {
    return available;
  }

  public boolean isReserved() {
    return reserved;
  }

  public List<String> getSuggestions() {
    return suggestions;
  }
}
