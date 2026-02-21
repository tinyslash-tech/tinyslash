package com.urlshortener.controller;

import com.urlshortener.model.TrustVerification;
import com.urlshortener.service.TrustVerificationService;
import com.urlshortener.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/trust")
@CrossOrigin(origins = "*")
public class TrustVerificationController {

  @Autowired
  private TrustVerificationService service;

  @Autowired
  private StorageService storageService;

  @Autowired
  private com.urlshortener.service.UrlShorteningService urlService;

  @Autowired
  private com.urlshortener.repository.QrCodeRepository qrCodeRepository;

  @Value("${app.backend.url:https://urlshortner-mrrl.onrender.com}")
  private String backendUrl;

  private static final long MAX_DOC_SIZE = 10 * 1024 * 1024; // 10 MB
  private static final String[] ALLOWED_DOC_TYPES = {
      "application/pdf", "image/jpeg", "image/png", "image/webp"
  };
  private static final String[] ALLOWED_DOC_TYPES_NAMES = {
      "gst", "pan", "domain_receipt", "incorporation_cert"
  };

  // -------------------------------------------------------------------
  // 1. Upload a single verification document to R2
  // -------------------------------------------------------------------
  @PostMapping("/upload-doc")
  public ResponseEntity<Map<String, Object>> uploadDoc(
      @RequestParam String userId,
      @RequestParam String docType, // gst | pan | domain_receipt | incorporation_cert
      @RequestParam("file") MultipartFile file) {

    Map<String, Object> response = new HashMap<>();
    try {
      // Validate size
      if (file.isEmpty() || file.getSize() > MAX_DOC_SIZE) {
        response.put("success", false);
        response.put("message", "File is empty or exceeds 10 MB limit");
        return ResponseEntity.badRequest().body(response);
      }

      // Validate type
      String ct = file.getContentType() != null ? file.getContentType() : "";
      boolean allowed = false;
      for (String type : ALLOWED_DOC_TYPES) {
        if (type.equals(ct)) {
          allowed = true;
          break;
        }
      }
      if (!allowed) {
        response.put("success", false);
        response.put("message", "Only PDF, JPG, PNG files are allowed");
        return ResponseEntity.badRequest().body(response);
      }

      // Validate docType
      boolean validDocType = false;
      for (String t : ALLOWED_DOC_TYPES_NAMES) {
        if (t.equals(docType)) {
          validDocType = true;
          break;
        }
      }
      if (!validDocType) {
        response.put("success", false);
        response.put("message", "Invalid docType");
        return ResponseEntity.badRequest().body(response);
      }

      // Build storage key: trust/{userId}/{docType}_{timestamp}.{ext}
      String ext = ct.contains("pdf") ? "pdf"
          : ct.contains("png") ? "png"
              : ct.contains("webp") ? "webp"
                  : "jpg";
      String key = "trust/" + userId + "/" + docType + "_" + Instant.now().toEpochMilli() + "." + ext;

      // Upload via StorageService — same abstraction used by file uploads
      storageService.uploadFile(file, key);

      // Get public URL (R2 public domain) or fall back to backend serve URL
      String publicUrl = storageService.getPublicUrl(key);
      if (publicUrl == null) {
        publicUrl = backendUrl.replaceAll("/+$", "") + "/api/v1/trust/doc/" + userId + "/" + docType;
      }

      response.put("success", true);
      response.put("url", publicUrl);
      response.put("docType", docType);
      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Upload failed: " + e.getMessage());
      return ResponseEntity.internalServerError().body(response);
    }
  }

  // -------------------------------------------------------------------
  // 2. Submit verified application
  // -------------------------------------------------------------------
  @PostMapping("/apply")
  public ResponseEntity<?> apply(@RequestParam String userId, @RequestBody TrustVerification application) {
    try {
      return ResponseEntity.ok(service.submitApplication(userId, application));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  // -------------------------------------------------------------------
  // 3. Get current verification status
  // -------------------------------------------------------------------
  @GetMapping("/status")
  public ResponseEntity<?> getStatus(@RequestParam String userId) {
    return ResponseEntity.ok(service.getStatus(userId).orElse(null));
  }

  // -------------------------------------------------------------------
  // 4. Public trust info used by the redirect interstitial page
  // -------------------------------------------------------------------
  @GetMapping("/public/{shortCode}")
  public ResponseEntity<?> getPublicTrustInfo(@PathVariable String shortCode) {
    String userId = null;
    String displayDomain = "tinyslash.com";

    java.util.Optional<com.urlshortener.model.ShortenedUrl> urlOpt = urlService.findByShortCodeIgnoreDomain(shortCode);
    if (urlOpt.isPresent()) {
      com.urlshortener.model.ShortenedUrl url = urlOpt.get();
      userId = url.getUserId();
      if (url.getDomain() != null)
        displayDomain = url.getDomain();
    } else {
      java.util.Optional<com.urlshortener.model.QrCode> qrOpt = qrCodeRepository.findByShortCode(shortCode);
      if (qrOpt.isPresent())
        userId = qrOpt.get().getUserId();
    }

    if (userId == null)
      return ResponseEntity.notFound().build();

    java.util.Optional<TrustVerification> trustOpt = service.getApprovedVerification(userId);
    if (trustOpt.isEmpty())
      return ResponseEntity.notFound().build();

    TrustVerification trust = trustOpt.get();
    Map<String, Object> res = new java.util.HashMap<>();
    res.put("brandName", trust.getBrandName());
    res.put("verified", true);
    res.put("domain", displayDomain);
    return ResponseEntity.ok(res);
  }

  // -------------------------------------------------------------------
  // 5. Admin approve endpoint
  // -------------------------------------------------------------------
  @PostMapping("/approve")
  public ResponseEntity<?> approve(@RequestParam String userId) {
    service.approveApplication(userId);
    return ResponseEntity.ok("Approved");
  }
}
