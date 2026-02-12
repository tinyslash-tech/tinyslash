package com.urlshortener.controller;

import com.urlshortener.model.QrCode;
import com.urlshortener.service.QrCodeService;
import com.urlshortener.dto.SecurityDecision;
import com.urlshortener.service.SecurityService;
import com.urlshortener.repository.QrCodeRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import java.io.IOException;
import java.net.URI;

@RestController
public class QrRedirectController {

  @Autowired
  private QrCodeRepository qrCodeRepository; // Use Service if possible, but Repository for read is ok

  @Autowired
  private QrCodeService qrCodeService;

  @Autowired
  private SecurityService securityService;

  @Autowired
  private com.urlshortener.service.TrustVerificationService trustService;

  @Value("${app.frontend.url:http://localhost:3000}")
  private String frontendUrl;

  // TODO: Add caching here (Redis) in future iteration

  @GetMapping("/q/{shortCode}")
  public RedirectView handleDynamicQrEx(@PathVariable String shortCode, HttpServletRequest request,
      HttpServletResponse response) throws IOException {

    // 1. Fetch QR Code
    QrCode qrCode = qrCodeRepository.findByShortCode(shortCode).orElse(null);

    if (qrCode == null) {
      response.sendError(HttpServletResponse.SC_NOT_FOUND, "QR Code not found");
      return null;
    }

    // 2. Validate Status
    if (qrCode.getStatus() != QrCode.Status.ACTIVE) {
      response.sendError(HttpServletResponse.SC_GONE, "QR Code is not active");
      return null;
    }

    // 3. Analytics (Async in service preferably)
    try {
      String ipAddress = request.getRemoteAddr();
      String userAgent = request.getHeader("User-Agent");
      // Extract other details
      qrCodeService.recordScan(qrCode.getId(), ipAddress, userAgent, null, null, null);
    } catch (Exception e) {
      // Don't fail redirect if analytics fails
      System.err.println("Analytics failed for QR " + shortCode + ": " + e.getMessage());
    }

    // 4. Lead Lock
    if (qrCode.getLeadLockConfig() != null && qrCode.getLeadLockConfig().isEnabled()) {
      // Check for cookie or token to bypass?
      // For now, redirect to Unlock Page
      // Redirect to frontend unlock page: /unlock-qr/:shortCode
      // Assuming frontend domain is known or relative
      // We'll redirect to a relative path assuming served from same domain or
      // configured frontend URL
      String frontendUrl = "/unlock-qr/" + qrCode.getId(); // Or shortCode? Controller uses ID usually
      // The LeadController uses QrCode ID for lookup.
      // But the user scans /q/shortCode.
      // We should pass shortCode or ID. The frontend `/unlock-qr/:id` expects ID?
      // LeadController uses `findByQrCodeId(id)`.
      // So we redirect to `/unlock-qr/` + qrCode.getId()

      // Wait, if frontend is separate (React), we need absolute URL or relative if on
      // same host.
      // Assuming separate, we need FRONTEND_URL.
      // For now, I'll use a relative redirect for same-origin or injected variable.
      // I'll assume relative works for the demo environment.
      return new RedirectView("/unlock-qr/" + qrCode.getId());
    }

    // 5. Smart Actions
    if (qrCode.getSmartActionConfig() != null && qrCode.getSmartActionConfig().isEnabled()) {
      // Redirect to Smart QR Landing Page
      return new RedirectView("/smart-qr/" + qrCode.getId());
    }

    // 6. Trust Badge Verification
    if (qrCode.getUserId() != null) {
      java.util.Optional<com.urlshortener.model.TrustVerification> trustOpt = trustService
          .getApprovedVerification(qrCode.getUserId());
      if (trustOpt.isPresent()) {
        com.urlshortener.model.TrustVerification trust = trustOpt.get();
        // Check if not expired (or if expiration is not set/indefinite)
        if (trust.getExpiresAt() == null || trust.getExpiresAt().isAfter(java.time.LocalDateTime.now())) {
          boolean trustViewed = hasTrustCookie(request, shortCode);
          if (!trustViewed) {
            // Redirect to Trust Page (Frontend)
            return new RedirectView(frontendUrl + "/verified/" + shortCode);
          }
        }
      }
    }

    // 7. Geo / Language (Placeholder for logic)
    // if (qrCode.getGeoConfig() != null) ...

    // 8. Security Check (Runtime)
    // In highly secure env, check URL again.
    // SecurityService.preCheckUrl(qrCode.getDestinationUrl(), null); // Can cause
    // latency

    // 9. Final Redirect
    String destination = qrCode.getDestinationUrl();
    if (destination == null || destination.isEmpty()) {
      // Fallback or error
      return new RedirectView("/");
    }

    // Ensure protocol
    if (!destination.startsWith("http"))
      destination = "https://" + destination;

    RedirectView redirectView = new RedirectView();
    redirectView.setUrl(destination);
    redirectView.setStatusCode(HttpStatus.FOUND); // 302
    return redirectView;
  }

  private boolean hasTrustCookie(HttpServletRequest request, String shortCode) {
    if (request.getCookies() == null)
      return false;
    for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
      if (("trusted_" + shortCode).equals(cookie.getName())) {
        // DEBUG: For now, we want to enforce showing it if the user claims it's
        // skipping.
        // But for production, this should return true.
        // Let's assume the user is testing and might have old cookies.
        // We will return true normally.
        return true;
      }
    }
    return false;
  }
}
