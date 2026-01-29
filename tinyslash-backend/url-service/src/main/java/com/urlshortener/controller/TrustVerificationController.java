package com.urlshortener.controller;

import com.urlshortener.model.TrustVerification;
import com.urlshortener.service.TrustVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/trust")
@CrossOrigin(origins = "*")
public class TrustVerificationController {

  @Autowired
  private TrustVerificationService service;

  @PostMapping("/apply")
  public ResponseEntity<?> apply(@RequestParam String userId, @RequestBody TrustVerification application) {
    try {
      return ResponseEntity.ok(service.submitApplication(userId, application));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("/status")
  public ResponseEntity<?> getStatus(@RequestParam String userId) {
    return ResponseEntity.ok(service.getStatus(userId).orElse(null));
  }

  @Autowired
  private com.urlshortener.service.UrlShorteningService urlService;

  @GetMapping("/public/{shortCode}")
  public ResponseEntity<?> getPublicTrustInfo(@PathVariable String shortCode) {
    // 1. Resolve URL
    // Note: We use the permissive lookup here because the redirection logic already
    // validated it
    // But for security, we should ideally check domain too. For now, shortCode
    // uniqueness (Feistel) is assumed.
    java.util.Optional<com.urlshortener.model.ShortenedUrl> urlOpt = urlService.findByShortCodeIgnoreDomain(shortCode);

    if (urlOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    com.urlshortener.model.ShortenedUrl url = urlOpt.get();

    // 2. Get Trust Info
    if (url.getUserId() == null) {
      return ResponseEntity.notFound().build();
    }

    java.util.Optional<TrustVerification> trustOpt = service.getApprovedVerification(url.getUserId());

    if (trustOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    TrustVerification trust = trustOpt.get();

    // 3. Construct Safe Public DTO
    java.util.Map<String, Object> response = new java.util.HashMap<>();
    response.put("brandName", trust.getBrandName());
    response.put("verified", true);
    // Use the domain from the URL or fallback
    String displayDomain = url.getDomain() != null ? url.getDomain() : "tinyslash.com";
    response.put("domain", displayDomain);

    return ResponseEntity.ok(response);
  }

  // Temporary Admin Endpoint for Demo
  @PostMapping("/approve")
  public ResponseEntity<?> approve(@RequestParam String userId) {
    service.approveApplication(userId);
    return ResponseEntity.ok("Approved");
  }
}
