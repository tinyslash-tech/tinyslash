package com.urlshortener.controller;

import com.urlshortener.model.Page;
import com.urlshortener.model.User;
import com.urlshortener.service.PageService;
import com.urlshortener.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PageController {

  @Autowired
  private PageService pageService;

  @Autowired
  private UserService userService;

  private User getAuthenticatedUser(Authentication authentication) {
    String userId;
    Object principal = authentication.getPrincipal();

    if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
      userId = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
    } else {
      userId = principal.toString();
    }

    return userService.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  @GetMapping
  public ResponseEntity<List<Page>> getUserPages(Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    return ResponseEntity.ok(pageService.getUserPages(user.getId()));
  }

  @PostMapping
  public ResponseEntity<Page> createPage(@RequestBody Page page, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    return ResponseEntity.ok(pageService.createPage(user, page));
  }

  @PutMapping("/{id}")
  public ResponseEntity<Page> updatePage(@PathVariable String id, @RequestBody Page page,
      Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    return ResponseEntity.ok(pageService.updatePage(user.getId(), id, page));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deletePage(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    pageService.deletePage(user.getId(), id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{id}")
  public ResponseEntity<Page> getPage(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    return ResponseEntity.ok(pageService.getPageById(id, user.getId()));
  }

  @Autowired
  private com.urlshortener.service.SlugService slugService;

  @GetMapping("/check-slug")
  public ResponseEntity<com.urlshortener.dto.SlugCheckResponse> checkSlugAvailability(
      @RequestParam String slug,
      @RequestParam(required = false) String pageId) {

    // Basic Rate Limiting (TODO: Move to filter/interceptor with Bucket4j)
    // For now, we rely on the service to process the request rapidly.

    return ResponseEntity.ok(slugService.checkSlugAvailability(slug, pageId));
  }

  @PostMapping("/upload-asset")
  public ResponseEntity<java.util.Map<String, String>> uploadAsset(
      @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
      Authentication authentication) {

    User user = getAuthenticatedUser(authentication);
    try {
      String assetUrl = pageService.uploadAsset(file, user.getId());
      return ResponseEntity.ok(java.util.Map.of("url", assetUrl));
    } catch (Exception e) {
      return ResponseEntity.internalServerError()
          .body(java.util.Map.of("error", "Failed to upload asset: " + e.getMessage()));
    }
  }
}
