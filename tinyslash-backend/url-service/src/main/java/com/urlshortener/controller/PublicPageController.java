package com.urlshortener.controller;

import com.urlshortener.model.Page;
import com.urlshortener.service.PageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/pages")
public class PublicPageController {

  @Autowired
  private PageService pageService;

  @GetMapping("/{slug}")
  public ResponseEntity<Page> getPageBySlug(@PathVariable String slug) {
    // In a real app, this should check 'published' status
    // and handle internal vs custom domain logic
    return ResponseEntity.ok(pageService.getPageBySlug(slug));
  }
}
