package com.urlshortener.controller;

import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.service.PixelFiringService;
import com.urlshortener.service.UrlShorteningService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.io.IOException;
import java.util.Optional;

@Controller
public class ShortLinkRedirectController {

  @Autowired
  private UrlShorteningService urlShorteningService;

  @Autowired
  private PixelFiringService pixelFiringService;

  @Value("${app.frontend.url:https://tinyslash.com}")
  private String frontendUrl;

  @GetMapping("/{shortCode}")
  public void handleShortLink(
      @PathVariable String shortCode,
      HttpServletRequest request,
      HttpServletResponse response,
      @RequestHeader(value = "User-Agent", required = false) String userAgent,
      @RequestHeader(value = "Referer", required = false) String referer) throws IOException {

    // 1. Lookup URL (Fast Cache)
    // We use a pragmatic approach: if it looks like a static asset or API, ignore
    // But Spring routing should handle that before hitting this generic catch-all

    Optional<ShortenedUrl> urlOpt = urlShorteningService.getByShortCode(shortCode);

    if (urlOpt.isEmpty()) {
      // Not found in our DB -> Pass to Frontend (Handles 404s, standard routes not
      // listed in FrontendRedirectController)
      response.sendRedirect(frontendUrl + "/" + shortCode);
      return;
    }

    ShortenedUrl url = urlOpt.get();

    // 2. Check Active/Expired
    if (!url.isActive() || (url.getExpiresAt() != null && url.getExpiresAt().isBefore(java.time.LocalDateTime.now()))) {
      // Let frontend show the error page
      response.sendRedirect(frontendUrl + "/redirect/" + shortCode);
      return;
    }

    // 3. Check for Password Protection OR Verified Badge (Trust)
    // If either is enabled, we MUST show the intermediate page
    boolean isPasswordProtected = url.isPasswordProtected();
    boolean isVerifiedPage = url.getTrustBadgeConfig() != null && url.getTrustBadgeConfig().isRequested();

    if (isPasswordProtected || isVerifiedPage) {
      // Redirect to Frontend Intermediate Page
      // usage: /verified/{shortCode} or /redirect/{shortCode}
      // The frontend router handles these.
      String targetPath = isVerifiedPage ? "/verified/" + shortCode : "/redirect/" + shortCode;
      response.sendRedirect(frontendUrl + targetPath);
      return;
    }

    // 4. INSTANT REDIRECT (Server-Side)
    // Fire Pixels Async
    if (url.getPixelIds() != null && !url.getPixelIds().isEmpty()) {
      try {
        com.urlshortener.dto.PixelRequestContext context = com.urlshortener.dto.PixelRequestContext.builder()
            .linkId(url.getId())
            .shortCode(url.getShortCode())
            .originalUrl(url.getOriginalUrl())
            .userId(url.getUserId())
            .ipAddress(getClientIp(request))
            .userAgent(userAgent != null ? userAgent : "unknown")
            .referrer(referer)
            .clickTime(java.time.Instant.now())
            .eventId(java.util.UUID.randomUUID().toString())
            .build();

        // Note: Cookies like _fbc, _fbp are on the client domain.
        // In a server-side redirect on a different domain (tinyslash.com vs brand.com),
        // we might not have them.
        // But if the link is on the same domain or if we strictly use server-side
        // matching (IP/UA), it works.
        // We extract what we can.

        pixelFiringService.fireAsync(url.getId(), url.getShortCode(), url.getPixelIds(), context);

      } catch (Exception e) {
        // Ignore pixel errors, do not block redirect
      }
    }

    // Record Click Async (Fire and Forget)
    // UrlShorteningService.incrementClicks is fast but synchronous DB/Cache update.
    // Ideally this should be async too, but for <50ms, cache update is usually
    // fine.
    // We call it here.
    urlShorteningService.incrementClicks(shortCode, url.getDomain());

    // 5. Perform 302 Redirect
    response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
    response.setHeader("Location", url.getOriginalUrl());
  }

  private String getClientIp(HttpServletRequest request) {
    String xfHeader = request.getHeader("X-Forwarded-For");
    if (xfHeader == null) {
      return request.getRemoteAddr();
    }
    return xfHeader.split(",")[0];
  }
}
