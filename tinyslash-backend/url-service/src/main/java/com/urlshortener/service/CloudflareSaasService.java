package com.urlshortener.service;

import com.urlshortener.model.Domain;
import com.urlshortener.repository.DomainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Cloudflare for SaaS - Custom Hostname SSL Management
 * FREE tier: 100 custom hostnames with automatic SSL
 * 
 * Documentation:
 * https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/
 */
@Service
public class CloudflareSaasService {

    private static final Logger logger = LoggerFactory.getLogger(CloudflareSaasService.class);
    private static final String CLOUDFLARE_API_BASE = "https://api.cloudflare.com/client/v4";

    @Value("${cloudflare.api.token}")
    private String apiToken;

    @Value("${cloudflare.zone.id}")
    private String zoneId;

    @Value("${cloudflare.saas.fallback-origin:tinyslash.com}")
    private String fallbackOrigin;

    @Autowired
    private DomainRepository domainRepository;

    private final WebClient webClient;

    public CloudflareSaasService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl(CLOUDFLARE_API_BASE)
                .build();
    }

    /**
     * Create custom hostname with automatic SSL provisioning
     * This is the main method to call when user adds a custom domain
     */
    public boolean createCustomHostname(Domain domain) {
        logger.info("🚀 Creating custom hostname for: {}", domain.getDomainName());

        try {
            // Build request body for Cloudflare API
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("hostname", domain.getDomainName());

            // SSL configuration - TXT validation (CANONICAL SOURCE OF TRUTH)
            Map<String, Object> sslConfig = new HashMap<>();
            sslConfig.put("method", "txt"); // TXT validation is non-negotiable
            sslConfig.put("type", "dv"); // Domain Validation certificate
            sslConfig.put("bundle_method", "ubiquitous"); // REQUIRED for reliable TXT generation

            // SSL settings
            Map<String, String> sslSettings = new HashMap<>();
            sslSettings.put("http2", "on");
            sslSettings.put("min_tls_version", "1.2");
            sslSettings.put("tls_1_3", "on");
            sslConfig.put("settings", sslSettings);

            requestBody.put("ssl", sslConfig);

            // Custom Origin Server (Explicitly Requested via Variable)
            requestBody.put("custom_origin_server", fallbackOrigin);

            // Log payload for debugging
            logger.info("📦 Cloudflare Payload: hostname={} origin={}", domain.getDomainName(), fallbackOrigin);

            // Sanitize input
            String cleanToken = (apiToken != null) ? apiToken.trim() : "";

            logger.info("🔑 Auth Debug: TokenLength={} ZoneID={}", cleanToken.length(), zoneId);
            if (cleanToken.length() > 4) {
                logger.info("   Token Prefix: {}...", cleanToken.substring(0, 4));
            }

            // Make API call to Cloudflare
            Map<String, Object> response = webClient.post()
                    .uri("/zones/{zoneId}/custom_hostnames", zoneId)
                    .header("Authorization", "Bearer " + cleanToken)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            // Parse response
            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                Map<String, Object> result = (Map<String, Object>) response.get("result");
                String customHostnameId = (String) result.get("id");
                String status = (String) result.get("status");

                // Save Cloudflare IDs (Essential for SaaS operations)
                domain.setCloudflareHostnameId(customHostnameId);
                domain.setCloudflareStatus(status);

                // --- ROBUST PARSING LOGIC (TXT IS CANONICAL) ---
                Map<String, Object> ssl = (Map<String, Object>) result.get("ssl");
                boolean sslRecordsFound = false;

                if (ssl != null) {
                    List<Map<String, Object>> validationRecords = (List<Map<String, Object>>) ssl
                            .get("validation_records");

                    if (validationRecords != null && !validationRecords.isEmpty()) {
                        // Iterate through records to find TXT (Primary) and CNAME (Optional)
                        for (Map<String, Object> record : validationRecords) {
                            String txtName = (String) record.get("txt_name");
                            String txtValue = (String) record.get("txt_value");
                            // Fallback for regional API differences
                            if (txtName == null)
                                txtName = (String) record.get("name");
                            if (txtValue == null)
                                txtValue = (String) record.get("value");
                            String cnameTarget = (String) record.get("cname_target"); // DCV Delegation

                            // ALWAYS valid source of truth
                            if (txtName != null && txtValue != null) {
                                domain.setSslValidationMethod("TXT");
                                domain.setSslTxtName(txtName);
                                domain.setSslTxtValue(txtValue);
                                sslRecordsFound = true;
                            }

                            // Optional accelerator (DCV)
                            if (cnameTarget != null) {
                                domain.setSslCnameTarget(cnameTarget);
                            }
                        }
                    }
                }

                // FALLBACK: If SSL records are missing (async propagation), poll for them
                if (!sslRecordsFound) {
                    logger.warn("⚠️ No SSL validation records in initial response. Starting polling mechanism...");

                    int attempts = 0;
                    int maxAttempts = 3; // Increased to 5 attempts (approx 12.5s) per user request

                    while (!sslRecordsFound && attempts < maxAttempts) {
                        attempts++;
                        try {
                            logger.info("⏳ Polling for SSL records (Attempt {}/{})", attempts, maxAttempts);
                            Thread.sleep(2500); // Wait 2.5s between checks

                            Map<String, Object> details = getCustomHostnameDetails(domain);
                            if (details != null) {
                                Map<String, Object> fetchedSsl = (Map<String, Object>) details.get("ssl");
                                if (fetchedSsl != null) {
                                    List<Map<String, Object>> fetchedRecords = (List<Map<String, Object>>) fetchedSsl
                                            .get("validation_records");
                                    if (fetchedRecords != null) {
                                        for (Map<String, Object> record : fetchedRecords) {
                                            String txtName = (String) record.get("txt_name");
                                            String txtValue = (String) record.get("txt_value");
                                            // Fallback
                                            if (txtName == null)
                                                txtName = (String) record.get("name");
                                            if (txtValue == null)
                                                txtValue = (String) record.get("value");
                                            String cnameTarget = (String) record.get("cname_target");

                                            // Update domain if we found the records
                                            if (txtName != null && txtValue != null) {
                                                domain.setSslValidationMethod("TXT");
                                                domain.setSslTxtName(txtName);
                                                domain.setSslTxtValue(txtValue);
                                                sslRecordsFound = true; // Break loop
                                                logger.info("✅ Recouped SSL TXT records via polling attempt {}",
                                                        attempts);
                                            }
                                            if (cnameTarget != null) {
                                                domain.setSslCnameTarget(cnameTarget);
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            break;
                        } catch (Exception ex) {
                            logger.error("❌ Error during SSL polling", ex);
                        }
                    }

                    if (!sslRecordsFound) {
                        logger.error("❌ Failed to retrieve SSL TXT records after {} attempts", maxAttempts);
                    }
                }

                // Legacy/Fallback Fields
                domain.setSslProvider("CLOUDFLARE_SAAS");
                domain.setSslStatus("PENDING");
                domain.setVerificationToken(customHostnameId); // Keeping for backward compat

                domainRepository.save(domain);

                logger.info("✅ Custom hostname created successfully!");
                logger.info("   Domain: {}", domain.getDomainName());
                logger.info("   ID: {}", customHostnameId);
                logger.info("   Status: {}", status);
                logger.info("   SSL TXT: {} -> {}", domain.getSslTxtName(), domain.getSslTxtValue());

                return true;
            } else {
                // Handle errors
                List<Map<String, Object>> errors = (List<Map<String, Object>>) response.get("errors");
                if (errors != null && !errors.isEmpty()) {
                    String errorMessage = (String) errors.get(0).get("message");

                    // --- IDEMPOTENCY HANDLING ---
                    // If hostname already exists, treat it as success and fetch details
                    if (errorMessage.toLowerCase().contains("already exists")
                            || errorMessage.toLowerCase().contains("duplicate")) {
                        logger.warn("⚠️ Hostname already exists in Cloudflare. Fetching existing details...");

                        // Fetch details to ensure local DB is in sync (Idempotency)
                        Map<String, Object> details = getCustomHostnameDetails(domain);
                        if (details != null) {
                            String existingId = (String) details.get("id");
                            String existingStatus = (String) details.get("status");

                            domain.setCloudflareHostnameId(existingId);
                            domain.setCloudflareStatus(existingStatus);

                            Map<String, Object> fetchedSsl = (Map<String, Object>) details.get("ssl");
                            if (fetchedSsl != null) {
                                List<Map<String, Object>> fetchedRecords = (List<Map<String, Object>>) fetchedSsl
                                        .get("validation_records");
                                if (fetchedRecords != null) {
                                    for (Map<String, Object> record : fetchedRecords) {
                                        String txtName = (String) record.get("txt_name");
                                        String txtValue = (String) record.get("txt_value");
                                        // Fallback
                                        if (txtName == null)
                                            txtName = (String) record.get("name");
                                        if (txtValue == null)
                                            txtValue = (String) record.get("value");
                                        String cnameTarget = (String) record.get("cname_target");

                                        if (txtName != null && txtValue != null) {
                                            domain.setSslValidationMethod("TXT");
                                            domain.setSslTxtName(txtName);
                                            domain.setSslTxtValue(txtValue);
                                        }
                                        if (cnameTarget != null) {
                                            domain.setSslCnameTarget(cnameTarget);
                                        }
                                    }
                                }
                            }
                            domainRepository.save(domain);
                            logger.info("✅ Recovered existing Cloudflare hostname details");
                            return true; // Return SUCCESS implies we recovered
                        }
                    }

                    logger.error("❌ Cloudflare API error: {}", errorMessage);
                    domain.setSslError(errorMessage);
                    domainRepository.save(domain);
                }
                return false;
            }

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            String errorBody = e.getResponseBodyAsString();
            logger.error("❌ Cloudflare API Error (Status {}): {}", e.getStatusCode(), errorBody);

            // --- IDEMPOTENCY HANDLING (Conflict/Duplicate) ---
            if (e.getStatusCode().value() == 409 || errorBody.toLowerCase().contains("already exists")
                    || errorBody.toLowerCase().contains("duplicate")) {
                logger.warn("⚠️ Hostname duplicate/exists (409). Fetching existing details...");

                // Fetch details to ensure local DB is in sync
                Map<String, Object> details = getCustomHostnameDetails(domain);
                if (details != null) {
                    String existingId = (String) details.get("id");
                    String existingStatus = (String) details.get("status");

                    domain.setCloudflareHostnameId(existingId);
                    domain.setCloudflareStatus(existingStatus);
                    domain.setSslError(null); // Clear any previous error

                    Map<String, Object> fetchedSsl = (Map<String, Object>) details.get("ssl");
                    if (fetchedSsl != null) {
                        List<Map<String, Object>> fetchedRecords = (List<Map<String, Object>>) fetchedSsl
                                .get("validation_records");
                        if (fetchedRecords != null) {
                            for (Map<String, Object> record : fetchedRecords) {
                                String txtName = (String) record.get("txt_name");
                                String txtValue = (String) record.get("txt_value");
                                // Fallback
                                if (txtName == null)
                                    txtName = (String) record.get("name");
                                if (txtValue == null)
                                    txtValue = (String) record.get("value");
                                String cnameTarget = (String) record.get("cname_target");
                                if (txtName != null && txtValue != null) {
                                    domain.setSslValidationMethod("TXT");
                                    domain.setSslTxtName(txtName);
                                    domain.setSslTxtValue(txtValue);
                                }
                                if (cnameTarget != null) {
                                    domain.setSslCnameTarget(cnameTarget);
                                }
                            }
                        }
                    }
                    domainRepository.save(domain);
                    logger.info("✅ Recovered existing Cloudflare hostname details (from 409)");
                    return true;
                }
            }

            String friendlyError = "Cloudflare error: " + e.getStatusCode();
            try {
                // Robust regex to find "message": "The specific error"
                java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"message\"\\s*:\\s*\"([^\"]+)\"");
                java.util.regex.Matcher matcher = pattern.matcher(errorBody);

                if (matcher.find()) {
                    friendlyError = "Cloudflare: " + matcher.group(1);
                } else {
                    // If we can't parse it, show the raw body (truncated) so we can debug
                    friendlyError = "Cloudflare: "
                            + (errorBody.length() > 100 ? errorBody.substring(0, 100) + "..." : errorBody);
                }
            } catch (Exception parseEx) {
                logger.warn("Failed to parse Cloudflare error body", parseEx);
                // Fallback to raw body
                friendlyError = "CF Error: " + (errorBody.length() > 50 ? errorBody.substring(0, 50) : errorBody);
            }

            domain.setSslError(friendlyError);
            domainRepository.save(domain);
            return false;
        } catch (Exception e) {
            logger.error("❌ Failed to create custom hostname for: {}", domain.getDomainName(), e);
            domain.setSslError("API error: " + e.getMessage());
            domainRepository.save(domain);
            return false;
        }
    }

    /**
     * Check SSL status for a custom hostname
     * Call this periodically to check if SSL is active
     */
    public String checkSslStatus(Domain domain) {
        logger.info("🔍 Checking SSL status for: {}", domain.getDomainName());

        try {
            // Get custom hostname details from Cloudflare
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/zones/{zoneId}/custom_hostnames")
                            .queryParam("hostname", domain.getDomainName())
                            .build(zoneId))
                    .header("Authorization", "Bearer " + apiToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("result");

                if (!results.isEmpty()) {
                    Map<String, Object> hostname = results.get(0);
                    Map<String, Object> ssl = (Map<String, Object>) hostname.get("ssl");

                    if (ssl != null) {
                        String status = (String) ssl.get("status");
                        String method = (String) ssl.get("method");
                        String type = (String) ssl.get("type");

                        logger.info("📊 SSL Status: {}", status);
                        logger.info("   Method: {}", method);
                        logger.info("   Type: {}", type);

                        // --- SELF-HEALING: Update TXT records if missing or refreshed ---
                        List<Map<String, Object>> validationRecords = (List<Map<String, Object>>) ssl
                                .get("validation_records");
                        if (validationRecords != null && !validationRecords.isEmpty()) {
                            for (Map<String, Object> record : validationRecords) {
                                String txtName = (String) record.get("txt_name");
                                String txtValue = (String) record.get("txt_value");
                                // Fallback
                                if (txtName == null)
                                    txtName = (String) record.get("name");
                                if (txtValue == null)
                                    txtValue = (String) record.get("value");
                                String cnameTarget = (String) record.get("cname_target");

                                if (txtName != null && txtValue != null) {
                                    domain.setSslValidationMethod("TXT");
                                    domain.setSslTxtName(txtName);
                                    domain.setSslTxtValue(txtValue);
                                    logger.info("🔄 Self-Healed SSL TXT records during status check");
                                }
                                if (cnameTarget != null) {
                                    domain.setSslCnameTarget(cnameTarget);
                                }
                            }
                        }

                        // Update domain with SSL status
                        if ("active".equals(status)) {
                            domain.setSslStatus("ACTIVE");
                            domain.setSslIssuedAt(LocalDateTime.now());
                            // Expiry managed by Cloudflare
                            domain.setSslError(null);
                            domainRepository.save(domain);
                            logger.info("✅ SSL certificate is ACTIVE for: {}", domain.getDomainName());
                        } else if ("pending_validation".equals(status)) {
                            domain.setSslStatus("PENDING");
                            domainRepository.save(domain);
                            logger.info("⏳ SSL certificate is pending validation");
                        } else if ("pending_issuance".equals(status)) {
                            domain.setSslStatus("PENDING");
                            domainRepository.save(domain);
                            logger.info("⏳ SSL certificate is being issued");
                        }

                        return status;
                    }
                }
            }

            return "unknown";

        } catch (Exception e) {
            logger.error("❌ Failed to check SSL status for: {}", domain.getDomainName(), e);
            return "error";
        }
    }

    /**
     * Get detailed information about a custom hostname
     */
    public Map<String, Object> getCustomHostnameDetails(Domain domain) {
        logger.info("📋 Getting custom hostname details for: {}", domain.getDomainName());

        try {
            Map<String, Object> response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/zones/{zoneId}/custom_hostnames")
                            .queryParam("hostname", domain.getDomainName())
                            .build(zoneId))
                    .header("Authorization", "Bearer " + apiToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("result");
                if (!results.isEmpty()) {
                    return results.get(0);
                }
            }

        } catch (Exception e) {
            logger.error("❌ Failed to get hostname details: {}", domain.getDomainName(), e);
        }

        return null;
    }

    /**
     * Delete custom hostname (when user removes domain)
     */
    public boolean deleteCustomHostname(Domain domain) {
        logger.info("🗑️ Deleting custom hostname: {}", domain.getDomainName());

        try {
            String customHostnameId = domain.getVerificationToken(); // We stored ID here

            if (customHostnameId == null || customHostnameId.isEmpty()) {
                logger.warn("⚠️ No custom hostname ID found for: {}", domain.getDomainName());
                return false;
            }

            Map<String, Object> response = webClient.delete()
                    .uri("/zones/{zoneId}/custom_hostnames/{id}", zoneId, customHostnameId)
                    .header("Authorization", "Bearer " + apiToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                logger.info("✅ Custom hostname deleted successfully: {}", domain.getDomainName());
                return true;
            }

            return false;

        } catch (Exception e) {
            logger.error("❌ Failed to delete custom hostname: {}", domain.getDomainName(), e);
            return false;
        }
    }

    /**
     * List all custom hostnames (for monitoring)
     */
    public List<Map<String, Object>> listAllCustomHostnames() {
        logger.info("📋 Listing all custom hostnames");

        try {
            Map<String, Object> response = webClient.get()
                    .uri("/zones/{zoneId}/custom_hostnames", zoneId)
                    .header("Authorization", "Bearer " + apiToken)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response != null && Boolean.TRUE.equals(response.get("success"))) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("result");
                logger.info("📊 Found {} custom hostnames", results.size());
                return results;
            }

        } catch (Exception e) {
            logger.error("❌ Failed to list custom hostnames", e);
        }

        return List.of();
    }

    /**
     * Check if we've reached the free tier limit (100 hostnames)
     */
    public boolean hasReachedLimit() {
        List<Map<String, Object>> hostnames = listAllCustomHostnames();
        boolean atLimit = hostnames.size() >= 100;

        if (atLimit) {
            logger.warn("⚠️ Reached Cloudflare free tier limit (100 hostnames)");
        }

        return atLimit;
    }

    /**
     * Get current usage statistics
     */
    public Map<String, Object> getUsageStats() {
        List<Map<String, Object>> hostnames = listAllCustomHostnames();

        long activeCount = hostnames.stream()
                .filter(h -> {
                    Map<String, Object> ssl = (Map<String, Object>) h.get("ssl");
                    return ssl != null && "active".equals(ssl.get("status"));
                })
                .count();

        long pendingCount = hostnames.stream()
                .filter(h -> {
                    Map<String, Object> ssl = (Map<String, Object>) h.get("ssl");
                    return ssl != null && ("pending_validation".equals(ssl.get("status"))
                            || "pending_issuance".equals(ssl.get("status")));
                })
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", hostnames.size());
        stats.put("active", activeCount);
        stats.put("pending", pendingCount);
        stats.put("limit", 100);
        stats.put("remaining", 100 - hostnames.size());
        stats.put("percentUsed", (hostnames.size() * 100.0) / 100);

        logger.info("📊 Usage: {}/{} hostnames ({} active, {} pending)",
                hostnames.size(), 100, activeCount, pendingCount);

        return stats;
    }
}
