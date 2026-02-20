package com.urlshortener.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.view.RedirectView;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;

/**
 * Controller to redirect all non-API frontend routes to the actual frontend URL
 * This prevents users from seeing the backend URL when they refresh the page
 */
@Controller
public class FrontendRedirectController {

    @org.springframework.beans.factory.annotation.Value("${app.frontend.url:https://tinyslash.com}")
    private String frontendUrl;

    /**
     * Redirect /dashboard and all its sub-routes to frontend
     */
    @GetMapping({
            "/dashboard",
            "/dashboard/**",
            "/pricing",
            "/profile",
            "/account-settings",
            "/qr-generator",
            "/domains",
            "/analytics/**",
            "/redirect/**",
            "/invite/**",
            "/contact",
            "/about",
            "/shipping-policy",
            "/terms",
            "/cancellation-refund",
            "/privacy",
            "/verified/**",
            "/unlock/**",
            "/link-checker",

            "/careers",
            "/careers/**",
            "/solutions/**",
            "/short-links",
            "/qr-codes",
            "/file-to-link",
            "/pages",
            "/faq",
            "/blog",
            "/blog/**",
            "/p/**",
            "/file/**"
    })
    public RedirectView redirectToFrontend(HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        String queryString = request.getQueryString();

        // Build the full frontend URL with path and query params
        String targetUrl = frontendUrl + requestUri;
        if (queryString != null && !queryString.isEmpty()) {
            targetUrl += "?" + queryString;
        }

        // Prevent infinite redirects (simple check)
        if (targetUrl.equals(request.getRequestURL().toString())) {
            System.err.println("⚠️ Loop detected! Request URL matches Target URL: " + targetUrl);
            // Verify if we can just return 404 or some error to break loop
            // For now, let's append a param to indicate redirect? Or just return
        }

        System.out.println("🔄 Redirecting backend URL to frontend: " + requestUri + " → " + targetUrl);

        RedirectView redirectView = new RedirectView();
        redirectView.setUrl(targetUrl);
        redirectView.setStatusCode(HttpStatus.FOUND); // 302 redirect (temporary, not cached)
        return redirectView;
    }
}
