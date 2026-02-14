package com.urlshortener.controller;

import com.urlshortener.dto.LeadCaptureRequest;
import com.urlshortener.dto.LeadVerifyRequest;
import com.urlshortener.model.Lead;
import com.urlshortener.service.LeadService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leads")
@CrossOrigin(origins = "*") // Adjust for production
public class LeadController {

  @Autowired
  private LeadService leadService;

  @PostMapping("/unlock/{shortCode}/init")
  public ResponseEntity<?> initiateUnlock(@PathVariable String shortCode, @RequestBody LeadCaptureRequest request) {
    try {
      leadService.initiateUnlock(shortCode, request);
      return ResponseEntity.ok(Map.of("message", "OTP Sent successfully", "status", "success"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/unlock/{shortCode}/verify")
  public ResponseEntity<?> verifyUnlock(@PathVariable String shortCode,
      @RequestBody LeadVerifyRequest request,
      HttpServletRequest httpRequest) {
    try {
      String ip = httpRequest.getRemoteAddr(); // Use shared utility in real world
      String userAgent = httpRequest.getHeader("User-Agent");

      String redirectUrl = leadService.verifyUnlock(shortCode, request, ip, userAgent);

      // Return Token for Cookie setting in frontend + Redirect URL
      return ResponseEntity.ok(Map.of(
          "status", "verified",
          "redirectUrl", redirectUrl,
          "token", "unlocked_" + shortCode // Simple token for demo
      ));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/unlock-qr/{qrCodeId}/init")
  public ResponseEntity<?> initiateQrUnlock(@PathVariable String qrCodeId, @RequestBody LeadCaptureRequest request) {
    try {
      leadService.initiateQrUnlock(qrCodeId, request);
      return ResponseEntity.ok(Map.of("message", "OTP Sent successfully", "status", "success"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @PostMapping("/unlock-qr/{qrCodeId}/verify")
  public ResponseEntity<?> verifyQrUnlock(@PathVariable String qrCodeId,
      @RequestBody LeadVerifyRequest request,
      HttpServletRequest httpRequest) {
    try {
      String ip = httpRequest.getRemoteAddr();
      String userAgent = httpRequest.getHeader("User-Agent");

      String redirectUrl = leadService.verifyQrUnlock(qrCodeId, request, ip, userAgent);

      return ResponseEntity.ok(Map.of(
          "status", "verified",
          "redirectUrl", redirectUrl,
          "token", "unlocked_qr_" + qrCodeId));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  @GetMapping
  public ResponseEntity<List<Lead>> getLeads(@RequestParam String userId,
      @RequestParam(required = false) String linkId,
      @RequestParam(required = false) String qrCodeId,
      @RequestParam(required = false) String pageId) {
    // Validation: Ensure userId matches authenticated user
    if (pageId != null && !pageId.isEmpty()) {
      return ResponseEntity.ok(leadService.getLeadsForPage(pageId));
    }
    if (linkId != null && !linkId.isEmpty()) {
      return ResponseEntity.ok(leadService.getLeadsForLink(linkId));
    }
    if (qrCodeId != null && !qrCodeId.isEmpty()) {
      return ResponseEntity.ok(leadService.getLeadsForQrCode(qrCodeId));
    }
    // Check for pageId param? The method signature doesn't have it yet, need to add
    // it.
    // Wait, I can't easily change method signature in replace_file without
    // replacing the whole block.
    // I will replace the whole method and add the new endpoint.
    return ResponseEntity.ok(leadService.getLeadsForUser(userId));
  }

  @PostMapping("/page/{pageId}")
  public ResponseEntity<?> submitPageLead(@PathVariable String pageId,
      @RequestBody Map<String, String> data,
      @RequestParam String ownerId, // Should be verified or fetched from Page
      HttpServletRequest request) {
    try {
      String ip = request.getRemoteAddr();
      String userAgent = request.getHeader("User-Agent");
      leadService.savePageLead(pageId, ownerId, data, ip, userAgent);
      return ResponseEntity.ok(Map.of("status", "success"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }
}
