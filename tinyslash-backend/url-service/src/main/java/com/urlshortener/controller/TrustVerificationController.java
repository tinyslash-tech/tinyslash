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

  // Temporary Admin Endpoint for Demo
  @PostMapping("/approve")
  public ResponseEntity<?> approve(@RequestParam String userId) {
    service.approveApplication(userId);
    return ResponseEntity.ok("Approved");
  }
}
