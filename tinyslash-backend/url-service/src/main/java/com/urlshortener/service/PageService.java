package com.urlshortener.service;

import com.urlshortener.model.Page;
import com.urlshortener.model.PageBlock;
import com.urlshortener.model.PageTheme;
import com.urlshortener.model.User;
import com.urlshortener.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PageService {

  private final PageRepository pageRepository;
  private final StorageService storageService;

  @Autowired
  private SlugService slugService;

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
    existing.setPublished(updates.isPublished());

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

  // Add public view increment logic here later
}
