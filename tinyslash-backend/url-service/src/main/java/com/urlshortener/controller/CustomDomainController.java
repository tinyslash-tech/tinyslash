package com.urlshortener.controller;

import com.urlshortener.model.Domain;
import com.urlshortener.repository.DomainRepository;
import com.urlshortener.service.CloudflareSaasService;
import com.urlshortener.service.DomainVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/domains")
public class CustomDomainController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(CustomDomainController.class);

    @Autowired
    private DomainRepository domainRepository;

    @Autowired
    private com.urlshortener.service.CloudflareSaasService cloudflareService;

    @Autowired
    private DomainVerificationService verificationService;

    @Value("${app.domain.proxy-target:tinyslash.com}")
    private String proxyTarget;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addCustomDomain(
            @RequestBody Map<String, Object> request,
            org.springframework.security.core.Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        // 1. Log entry
        logger.info("➡️ [CustomDomainController] Received add domain request");
        logger.info("   Payload: {}", request);

        try {
            // 2. Check Authentication
            if (authentication == null) {
                logger.warn("⚠️ [CustomDomainController] Authentication object is null");
                response.put("success", false);
                response.put("message", "Authentication required");
                return ResponseEntity.status(401).body(response);
            }

            String userId = authentication.getName();
            logger.info("   User ID: {}", userId);
            logger.info("   Authorities: {}", authentication.getAuthorities());

            // 3. Extract Domain
            String domain = (String) request.get("domainName");
            if (domain == null || domain.trim().isEmpty()) {
                domain = (String) request.get("domain"); // Fallback
            }

            logger.info("   Extracted Domain: '{}'", domain);

            if (domain == null || domain.trim().isEmpty()) {
                logger.warn("⚠️ [CustomDomainController] Domain name is empty/null");
                response.put("success", false);
                response.put("message", "Domain is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Normalize
            domain = domain.toLowerCase().trim();

            // 4. Validate Format
            boolean isValid = verificationService.isValidDomain(domain);
            logger.info("   Format Evaluation: {}", isValid ? "VALID" : "INVALID");

            if (!isValid) {
                response.put("success", false);
                response.put("message", "Invalid domain format. Use format like 'go.example.com'");
                return ResponseEntity.badRequest().body(response);
            }

            // 5. Check Duplicates
            boolean exists = domainRepository.existsByDomainName(domain);
            logger.info("   Duplicate Check: {}", exists ? "EXISTS" : "NEW");

            if (exists) {
                response.put("success", false);
                response.put("message", "Domain '" + domain + "' is already registered.");
                return ResponseEntity.badRequest().body(response);
            }

            // 6. Create Entity (EAGER CREATION FLOW)
            String verificationToken = UUID.randomUUID().toString();
            Domain customDomain = new Domain(domain, "USER", userId, verificationToken);
            customDomain.setStatus(Domain.DomainStatus.PENDING);
            customDomain.setCnameTarget(proxyTarget); // tinyslash.com

            logger.info("   Saving Entity: {}", customDomain);
            domainRepository.save(customDomain);

            // 7. Call Cloudflare API Immediately (Eager Provisioning)
            logger.info("🚀 Initiating Cloudflare Custom Hostname Creation...");
            boolean cfSuccess = cloudflareService.createCustomHostname(customDomain);

            if (cfSuccess) {
                // Determine valid SSL records available
                String sslTxtName = customDomain.getSslTxtName();
                String sslTxtValue = customDomain.getSslTxtValue();
                String sslCnameTarget = customDomain.getSslCnameTarget();

                // Return detailed instructions
                Map<String, Object> dnsInstructions = new HashMap<>();

                // 1. Routing Record (CNAME -> tinyslash.com)
                Map<String, String> routingRecord = new HashMap<>();
                routingRecord.put("type", "CNAME");
                routingRecord.put("name", verificationService.extractSubdomain(domain));
                routingRecord.put("target", proxyTarget);
                routingRecord.put("ttl", "Auto or 3600");
                dnsInstructions.put("routing", routingRecord);

                // 2. SSL Verification Record (TXT is Canonical)
                if (sslTxtName != null && sslTxtValue != null) {
                    Map<String, String> sslRecord = new HashMap<>();
                    sslRecord.put("type", "TXT");
                    sslRecord.put("name", sslTxtName);
                    sslRecord.put("value", sslTxtValue); // Frontend: Copy this!
                    dnsInstructions.put("ssl", sslRecord);
                }

                // 3. Optional Accelerator (DCV CNAME)
                if (sslCnameTarget != null) {
                    Map<String, String> dcvRecord = new HashMap<>();
                    dcvRecord.put("type", "CNAME");
                    dcvRecord.put("name", sslTxtName); // Usually same name as TXT
                    dcvRecord.put("target", sslCnameTarget);
                    dnsInstructions.put("sslAccelerator", dcvRecord);
                }

                logger.info("✅ [CustomDomainController] Domain provisioned successfully");

                response.put("success", true);
                response.put("message", "Domain added and provisioning started");
                response.put("domain", customDomain);
                response.put("status", "pending_verification");
                response.put("dnsInstructions", dnsInstructions);
                response.put("verificationUrl", "/api/v1/domains/verify?domainId=" + customDomain.getId());

                return ResponseEntity.ok(response);

            } else {
                logger.warn("⚠️ Domain added but Cloudflare provisioning failed/pending");

                // Still return success because the domain is saved in our DB
                // Frontend needs to show "Routing" instructions and a "Retry SSL" button

                Map<String, Object> dnsInstructions = new HashMap<>();

                // 1. Routing Record (Always known)
                Map<String, String> routingRecord = new HashMap<>();
                routingRecord.put("type", "CNAME");
                routingRecord.put("name", verificationService.extractSubdomain(domain));
                routingRecord.put("target", proxyTarget);
                routingRecord.put("ttl", "Auto or 3600");
                dnsInstructions.put("routing", routingRecord);

                response.put("success", true);
                response.put("message", "Domain reserved. SSL provisioning is pending or requires retry.");
                response.put("domain", customDomain);
                response.put("status", "pending_ssl"); // distinct status for frontend
                response.put("dnsInstructions", dnsInstructions);
                response.put("sslProvisioningFailed", true);

                return ResponseEntity.ok(response);
            }

        } catch (org.springframework.dao.DuplicateKeyException e) {
            logger.error("❌ [CustomDomainController] Duplicate key error", e);
            response.put("success", false);
            response.put("message", "Domain already exists (database constraint)");
            return ResponseEntity.status(409).body(response);
        } catch (Exception e) {
            logger.error("❌ [CustomDomainController] Unexpected error", e);
            response.put("success", false);
            String errorMsg = e.getMessage() != null ? e.getMessage() : "Unknown application error";
            response.put("message", "Error adding domain: " + errorMsg);
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/my")
    public ResponseEntity<Map<String, Object>> getMyDomains(
            @RequestParam(required = false) String ownerType,
            @RequestParam(required = false) String ownerId,
            org.springframework.security.core.Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authentication == null) {
                response.put("success", false);
                response.put("message", "Authentication required");
                return ResponseEntity.status(401).body(response);
            }

            String currentUserId = authentication.getName();

            // Default to user's personal domains if not specified
            if (ownerType == null) {
                ownerType = "USER";
                ownerId = currentUserId;
            } else if ("USER".equals(ownerType) && (ownerId == null || ownerId.isEmpty())) {
                ownerId = currentUserId;
            }
            // Add security check: ensure user can only access their own domains or team
            // domains they belong to
            if ("USER".equals(ownerType) && !ownerId.equals(currentUserId)) {
                response.put("success", false);
                response.put("message", "Unauthorized access to other user's domains");
                return ResponseEntity.status(403).body(response);
            }

            List<Domain> domains = domainRepository.findByOwnerIdAndOwnerType(ownerId, ownerType);

            // Using the same simple map logic as before, or could use DTO
            List<Map<String, Object>> domainList = domains.stream().map(d -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", d.getId());
                map.put("domainName", d.getDomainName()); // Frontend expects domainName
                map.put("status", d.getStatus());
                map.put("sslStatus", d.getSslStatus());
                map.put("isVerified", d.isVerified());
                map.put("createdAt", d.getCreatedAt());
                map.put("verificationToken", d.getVerificationToken());
                map.put("cnameTarget", d.getCnameTarget());
                map.put("verificationError", d.getVerificationError());
                return map;
            }).collect(Collectors.toList());

            response.put("success", true);
            response.put("domains", domainList);
            response.put("count", domainList.size());
            response.put("userId", currentUserId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error listing domains: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/verified")
    public ResponseEntity<Map<String, Object>> getVerifiedDomains(
            org.springframework.security.core.Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authentication == null) {
                response.put("success", false);
                response.put("message", "Authentication required");
                return ResponseEntity.status(401).body(response);
            }

            String currentUserId = authentication.getName();

            // Fetch only verified domains for the user or their team (future: team support)
            List<Domain> domains = domainRepository.findByOwnerIdAndOwnerType(currentUserId, "USER");

            List<Map<String, Object>> verifiedList = domains.stream()
                    .filter(Domain::isVerified)
                    .map(d -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", d.getId());
                        map.put("domainName", d.getDomainName());
                        map.put("status", d.getStatus());
                        map.put("sslStatus", d.getSslStatus());
                        return map;
                    })
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("domains", verifiedList);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching verified domains: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDomain(
            @RequestParam String domainId,
            org.springframework.security.core.Authentication authentication) {

        Map<String, Object> response = new HashMap<>();

        try {
            if (authentication == null) {
                response.put("success", false);
                response.put("message", "Authentication required");
                return ResponseEntity.status(401).body(response);
            }

            // Get domain from database
            Optional<Domain> domainOpt = domainRepository.findById(domainId);

            if (domainOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Domain not found");
                return ResponseEntity.status(404).body(response);
            }

            Domain customDomain = domainOpt.get();
            String domainName = customDomain.getDomainName();

            // Check ownership
            if (!customDomain.getOwnerId().equals(authentication.getName())) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(403).body(response);
            }

            customDomain.setLastVerificationAttempt(LocalDateTime.now());

            // Step 1: Verify DNS
            boolean dnsValid = verificationService.verifyDNS(domainName);

            if (!dnsValid) {
                customDomain.setStatus(Domain.DomainStatus.PENDING);
                customDomain.setVerificationError("DNS not configured correctly");
                customDomain.incrementVerificationAttempts();
                domainRepository.save(customDomain);

                response.put("success", false);
                response.put("message", "DNS not configured correctly");
                response.put("domain", customDomain);
                response.put("verified", false); // Frontend looks for this
                response.put("status", "dns_pending");

                Map<String, Object> troubleshooting = new HashMap<>();
                troubleshooting.put("step1",
                        "Add CNAME record: " + verificationService.extractSubdomain(domainName) + " -> " + proxyTarget);
                troubleshooting.put("step2", "Wait propagation");
                response.put("troubleshooting", troubleshooting);

                return ResponseEntity.ok(response);
            }

            // Step 2: Add to Cloudflare (SaaS Custom Hostname)
            System.out.println("🚀 Adding domain to Cloudflare Custom Hostnames: " + domainName);
            // Use CloudflareSaasService to provision SSL
            boolean addedToCloudflare = cloudflareService.createCustomHostname(customDomain);

            if (addedToCloudflare) {
                // Success! Domain is verified and status update handled in service, but we
                // Success! Domain is verified
                customDomain.markAsVerified();

                // Force an immediate status check to capture "ACTIVE" state if ready
                // This fixes the issue where DB says PENDING but Cloudflare is ACTIVE
                String currentSslStatus = cloudflareService.checkSslStatus(customDomain);

                // Save updated domain state
                domainRepository.save(customDomain);

                System.out.println("✅ Domain verified and activated: " + domainName);

                response.put("success", true);
                response.put("message", "Domain verified successfully! SSL provisioning started.");
                response.put("domain", customDomain);
                response.put("verified", true);
                response.put("status", "verified");
                response.put("sslStatus", customDomain.getSslStatus());

            } else {
                // Cloudflare API failed
                customDomain.setStatus(Domain.DomainStatus.ERROR);
                // Error message set in service
                customDomain.incrementVerificationAttempts();
                domainRepository.save(customDomain);

                response.put("success", false);
                response.put("message", "DNS verified but failed to provision SSL. " + customDomain.getSslError());
                response.put("domain", customDomain);
                response.put("status", "cloudflare_failed");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Verification failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // Deprecated/Legacy method - kept but renamed or could be removed if we are
    // sure no one uses it
    // Original /list endpoint logic is now in /my
    public ResponseEntity<Map<String, Object>> listDomainsLegacy(@RequestParam String userId) {
        return null; // Stub
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteDomain(@PathVariable String id,
            org.springframework.security.core.Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (authentication == null) {
                return ResponseEntity.status(401).build();
            }

            String userId = authentication.getName();

            // Try to find by ID first
            Optional<Domain> domainOpt = domainRepository.findById(id);

            // Fallback: If not UUID, maybe it's the old domain name call (backward
            // compatibility attempt or just fail)
            // But we strongly prefer ID now.
            if (domainOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Domain not found");
                return ResponseEntity.notFound().build();
            }

            Domain customDomain = domainOpt.get();

            // Check if user owns domain
            if (!customDomain.getOwnerId().equals(userId)) {
                response.put("success", false);
                response.put("message", "Unauthorized");
                return ResponseEntity.status(403).body(response);
            }

            // Remove from Cloudflare if verified
            if (customDomain.isVerified()) {
                cloudflareService.deleteCustomHostname(customDomain);
            }

            // Delete from database
            domainRepository.delete(customDomain);

            System.out.println("✅ Domain deleted: " + customDomain.getDomainName());

            response.put("success", true);
            response.put("message", "Domain deleted successfully");
            response.put("domain", customDomain.getDomainName());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error deleting domain: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/status/{domain}")
    public ResponseEntity<Map<String, Object>> getDomainStatus(@PathVariable String domain) {
        Map<String, Object> response = new HashMap<>();

        try {
            Optional<Domain> domainOpt = domainRepository.findByDomainName(domain);

            if (domainOpt.isEmpty()) {
                response.put("success", false);
                response.put("message", "Domain not found");
                return ResponseEntity.notFound().build();
            }

            Domain customDomain = domainOpt.get();

            response.put("success", true);
            response.put("domain", customDomain.getDomainName());
            response.put("status", customDomain.getStatus());
            response.put("sslStatus", customDomain.getSslStatus());
            response.put("isVerified", customDomain.isVerified());
            response.put("createdAt", customDomain.getCreatedAt());
            response.put("lastVerificationAttempt", customDomain.getLastVerificationAttempt());
            response.put("verificationError", customDomain.getVerificationError());
            response.put("cnameTarget", customDomain.getCnameTarget());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error getting domain status: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @Autowired
    private com.urlshortener.service.DomainService domainService;

    @GetMapping("/admin/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllDomainsForAdmin() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Domain> domains = domainService.getAllDomains();

            List<Map<String, Object>> domainList = domains.stream().map(domain -> {
                Map<String, Object> domainMap = new HashMap<>();
                domainMap.put("id", domain.getId());
                domainMap.put("domain", domain.getDomainName());
                domainMap.put("ownerId", domain.getOwnerId());
                domainMap.put("ownerType", domain.getOwnerType());
                domainMap.put("status", domain.getStatus());
                domainMap.put("sslStatus", domain.getSslStatus());
                domainMap.put("isVerified", domain.isVerified());
                domainMap.put("created", domain.getCreatedAt());
                domainMap.put("lastChecked", domain.getLastVerificationAttempt());
                domainMap.put("usage", Map.of("links", 0, "clicks", 0, "bandwidth", "0 GB")); // Placeholders
                return domainMap;
            }).collect(Collectors.toList());

            response.put("success", true);
            response.put("domains", domainList);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error fetching all domains: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}