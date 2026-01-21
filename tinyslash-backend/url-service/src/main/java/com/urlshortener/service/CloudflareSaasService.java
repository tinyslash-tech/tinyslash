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

            // SSL configuration - HTTP validation (easiest for users)
            Map<String, Object> sslConfig = new HashMap<>();
            sslConfig.put("method", "http"); // HTTP-01 validation (no DNS TXT record needed)
            sslConfig.put("type", "dv"); // Domain Validation certificate
            sslConfig.put("wildcard", false); // No wildcard for free tier

            // SSL settings
            Map<String, String> sslSettings = new HashMap<>();
            sslSettings.put("http2", "on");
            sslSettings.put("min_tls_version", "1.2");
            sslSettings.put("tls_1_3", "on");
            sslSettings.put("ciphers", "default");
            sslConfig.put("settings", sslSettings);

            requestBody.put("ssl", sslConfig);

            // Make API call to Cloudflare
            Map<String, Object> response = webClient.post()
                    .uri("/zones/{zoneId}/custom_hostnames", zoneId)
                    .header("Authorization", "Bearer " + apiToken)
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

                // Save Cloudflare custom hostname ID to domain
                domain.setSslProvider("CLOUDFLARE_SAAS");
                domain.setSslStatus("PENDING");
                domain.setVerificationToken(customHostnameId); // Store ID for future reference
                domainRepository.save(domain);

                logger.info("✅ Custom hostname created successfully!");
                logger.info("   Domain: {}", domain.getDomainName());
                logger.info("   Hostname ID: {}", customHostnameId);
                logger.info("   Status: {}", status);

                return true;
            } else {
                // Handle errors
                List<Map<String, Object>> errors = (List<Map<String, Object>>) response.get("errors");
                if (errors != null && !errors.isEmpty()) {
                    String errorMessage = (String) errors.get(0).get("message");
                    logger.error("❌ Cloudflare API error: {}", errorMessage);
                    domain.setSslError(errorMessage);
                    domainRepository.save(domain);
                }
                return false;
            }

        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            String errorBody = e.getResponseBodyAsString();
            logger.error("❌ Cloudflare API Error (Status {}): {}", e.getStatusCode(), errorBody);

            // Try to parse the error message from JSON body
            String friendlyError = "Cloudflare error: " + e.getStatusCode();
            try {
                // quick and dirty regex or object mapper if available, but Map is easier if we
                // could parse the body.
                // Since errorBody is String, we can't cast to Map directly without
                // ObjectMapper.
                // Assuming standard Cloudflare error structure:
                // {"success":false,"errors":[{"code":1000,"message":"Invalid..."}]}
                if (errorBody.contains("\"message\":\"")) {
                    int start = errorBody.indexOf("\"message\":\"") + 11;
                    int end = errorBody.indexOf("\"", start);
                    if (end > start) {
                        friendlyError = errorBody.substring(start, end);
                    }
                }
            } catch (Exception parseEx) {
                logger.warn("Failed to parse Cloudflare error body", parseEx);
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

                        // Update domain with SSL status
                        if ("active".equals(status)) {
                            domain.setSslStatus("ACTIVE");
                            domain.setSslIssuedAt(LocalDateTime.now());
                            domain.setSslExpiresAt(LocalDateTime.now().plusMonths(3));
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
