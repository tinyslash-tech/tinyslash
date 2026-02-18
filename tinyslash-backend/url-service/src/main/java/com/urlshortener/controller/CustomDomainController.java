package com.urlshortener.controller;

import com.urlshortener.dto.DomainRequest;
import com.urlshortener.dto.DomainResponse;
import com.urlshortener.model.Domain;
import com.urlshortener.service.DomainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/domains")
public class CustomDomainController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomDomainController.class);

    @Autowired
    private DomainService domainService;

    @Value("${app.domain.proxy-target:tinyslash.com}")
    private String proxyTarget;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addCustomDomain(
            @RequestBody Map<String, Object> requestFunc, // Keeping Map for flexibility, but could use DTO directly
            org.springframework.security.core.Authentication authentication) {

        Map<String, Object> response = new HashMap<>();
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body(Map.of("success", false, "message", "Authentication required"));
            }
            String userId = authentication.getName();

            // Extract from Map to DTO
            String domainName = (String) requestFunc.getOrDefault("domainName", requestFunc.get("domain"));

            DomainRequest request = new DomainRequest();
            request.setDomainName(domainName);
            request.setOwnerType("USER"); // Default to USER for now
            request.setOwnerId(userId);

            // Call Service (Handles Lock, Abuse, Creation, Audit)
            DomainResponse domainResponse = domainService.reserveDomain(request, userId);

            response.put("success", true);
            response.put("message", "Domain reserved successfully. Please verify ownership.");
            response.put("domain", domainResponse);
            response.put("status", domainResponse.getStatus());
            // Add instructions for Frontend Wizard
            response.put("dnsInstructions", getDnsInstructions(domainResponse));

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            logger.error("Error adding domain", e);
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error: " + e.getMessage()));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDomain(
            @RequestParam String domainId,
            org.springframework.security.core.Authentication authentication) {

        try {
            if (authentication == null)
                return ResponseEntity.status(401).build();

            // Call Service (Handles TXT Check, DNS Check, SSL Provisioning, Audit)
            DomainResponse domainResponse = domainService.verifyDomain(domainId, authentication.getName());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);

            boolean isVerified = "VERIFIED".equalsIgnoreCase(domainResponse.getStatus());
            response.put("verified", isVerified);
            response.put("message",
                    isVerified ? "Domain verified successfully!" : "Verification failed. Check errors.");
            response.put("domain", domainResponse);

            if (!isVerified) {
                response.put("verificationError", domainResponse.getVerificationError());
                response.put("troubleshooting", Map.of(
                        "txt",
                        "Ensure TXT record tinyslash-verify=" + domainResponse.getVerificationToken() + " exists.",
                        "cname", "Ensure CNAME points to " + proxyTarget));
            }

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDomain(
            @PathVariable String id,
            org.springframework.security.core.Authentication authentication) {
        try {
            if (authentication == null)
                return ResponseEntity.status(401).build();

            // 10/10 Enterprise: Soft Delete
            domainService.softDeleteDomain(id, authentication.getName());

            return ResponseEntity.ok(Map.of("success", true, "message", "Domain scheduled for deletion."));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyDomains(
            @RequestParam(required = false) String ownerType,
            @RequestParam(required = false) String ownerId,
            org.springframework.security.core.Authentication authentication) {

        if (authentication == null)
            return ResponseEntity.status(401).build();
        String currentUserId = authentication.getName();

        if (ownerType == null)
            ownerType = "USER";
        if (ownerId == null)
            ownerId = currentUserId;

        if ("USER".equals(ownerType) && !ownerId.equals(currentUserId)) {
            return ResponseEntity.status(403).build();
        }

        List<DomainResponse> domains = domainService.getDomainsByOwner(ownerId, ownerType);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "domains", domains,
                "count", domains.size()));
    }

    @GetMapping("/detect-provider")
    public ResponseEntity<Map<String, Object>> detectProvider(@RequestParam String domain) {
        // 10/10 Enterprise: Auto-detect DNS Provider
        String provider = domainService.detectDnsProvider(domain);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("provider", provider);

        // Return tailored instructions based on provider
        Map<String, String> instructions = new HashMap<>();
        switch (provider) {
            case "CLOUDFLARE":
                instructions.put("step1", "Log in to Cloudflare Dashboard.");
                instructions.put("step2", "Go to DNS Settings for " + domain + ".");
                instructions.put("step3", "Add a CNAME record (@ or subdomain) pointing to " + proxyTarget + ".");
                instructions.put("step4",
                        "Ensure Proxy Status is set to 'DNS Only' (Grey Cloud) for initial verification.");
                break;
            case "GODADDY":
                instructions.put("step1", "Log in to GoDaddy Domain Manager.");
                instructions.put("step2", "Select " + domain + " and go to DNS Management.");
                instructions.put("step3", "Add a CNAME record.");
                break;
            default:
                instructions.put("step1", "Log in to your DNS Provider.");
                instructions.put("step2", "Go to DNS Management / Name Server settings.");
        }
        response.put("instructions", instructions);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{domain}") // Logic moved to Service if needed, or keep simple repo call
    public ResponseEntity<Map<String, Object>> getDomainStatus(@PathVariable String domain,
            org.springframework.security.core.Authentication auth) {
        // Ideally use ID, but for backward compat/public check
        return ResponseEntity.ok(Map.of("message", "Use GET /my for status"));
    }

    // --- Helpers ---

    private Map<String, Object> getDnsInstructions(DomainResponse domain) {
        Map<String, Object> instructions = new HashMap<>();

        // 1. TXT Verification (Security)
        Map<String, String> txtRecord = new HashMap<>();
        txtRecord.put("type", "TXT");
        txtRecord.put("name", "@");
        txtRecord.put("value", "tinyslash-verify=" + domain.getVerificationToken());
        instructions.put("verification", txtRecord);

        // 2. CNAME Routing
        Map<String, String> cnameRecord = new HashMap<>();
        cnameRecord.put("type", "CNAME");
        cnameRecord.put("name", extractSubdomain(domain.getDomainName()));
        cnameRecord.put("target", proxyTarget);
        instructions.put("routing", cnameRecord);

        return instructions;
    }

    private String extractSubdomain(String domain) {
        if (domain == null)
            return "@";
        String[] parts = domain.split("\\.");
        if (parts.length > 2) {
            return parts[0];
        }
        return "@"; // Root domain
    }
}