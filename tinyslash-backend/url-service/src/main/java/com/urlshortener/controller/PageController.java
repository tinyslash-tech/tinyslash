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
}
