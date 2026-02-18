package com.urlshortener.controller;

import com.urlshortener.model.Page;
import com.urlshortener.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/public/pages")
public class PublicPageController {

  @Autowired
  private PageService pageService;

  @GetMapping("/{slug}")
  public ResponseEntity<Page> getPageBySlug(@PathVariable String slug) {
    return ResponseEntity.ok(pageService.getPageBySlug(slug));
  }

  @PostMapping("/{pageId}/view")
  public ResponseEntity<Void> recordView(
      @PathVariable String pageId,
      HttpServletRequest request) {

    String ip = request.getHeader("X-Forwarded-For");
    if (ip == null || ip.isEmpty()) {
      ip = request.getRemoteAddr();
    }
    String userAgent = request.getHeader("User-Agent");
    String referer = request.getHeader("Referer");

    pageService.recordView(pageId, ip, userAgent, referer);
    return ResponseEntity.ok().build();
  }
}
