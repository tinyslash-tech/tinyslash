package com.urlshortener.controller;

import com.urlshortener.service.ResourceUsageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/resources")
public class ResourceController {

  @Autowired
  private ResourceUsageService resourceUsageService;

  @GetMapping("/admin/usage")
  // @PreAuthorize("hasRole('ADMIN')") - Uncomment when security is active
  public ResponseEntity<Map<String, Object>> getResourceUsage() {
    return ResponseEntity.ok(resourceUsageService.getGlobalResourceUsage());
  }
}
