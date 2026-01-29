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

  @Autowired
  private com.urlshortener.repository.QrCodeRepository qrCodeRepository;

  @GetMapping("/public/{shortCode}")
  public ResponseEntity<?> getPublicTrustInfo(@PathVariable String shortCode) {
    String userId = null;
    String displayDomain = "tinyslash.com";

    // 1. Try to resolve as ShortenedUrl
    java.util.Optional<com.urlshortener.model.ShortenedUrl> urlOpt = urlService.findByShortCodeIgnoreDomain(shortCode);

    if (urlOpt.isPresent()) {
      com.urlshortener.model.ShortenedUrl url = urlOpt.get();
      userId = url.getUserId();
      if (url.getDomain() != null) {
        displayDomain = url.getDomain();
      }
    } else {
      // 2. Try to resolve as QrCode
      java.util.Optional<com.urlshortener.model.QrCode> qrOpt = qrCodeRepository.findByShortCode(shortCode);
      if (qrOpt.isPresent()) {
        com.urlshortener.model.QrCode qr = qrOpt.get();
        userId = qr.getUserId();
        // QR codes don't strictly have a custom domain unless linked to a short link,
        // fallback to default
      }
    }

    if (userId == null) {
      return ResponseEntity.notFound().build();
    }

    // 3. Get Trust Info
    java.util.Optional<TrustVerification> trustOpt = service.getApprovedVerification(userId);

    if (trustOpt.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    TrustVerification trust = trustOpt.get();

    // 4. Construct Safe Public DTO
    java.util.Map<String, Object> response = new java.util.HashMap<>();
    response.put("brandName", trust.getBrandName());
    response.put("verified", true);
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
