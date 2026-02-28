package com.urlshortener.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.urlshortener.dto.AIGenerateRequest;
import com.urlshortener.dto.AIGenerateResponse;
import com.urlshortener.dto.AIFieldGenerateRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIPageService {

  private final WebClient webClient;
  private final ObjectMapper objectMapper;
  private final String openAiApiKey;

  public AIPageService(WebClient.Builder webClientBuilder,
      ObjectMapper objectMapper,
      @Value("${OPENAI_API_KEY:}") String openAiApiKey) {
    this.webClient = webClientBuilder.baseUrl("https://api.openai.com/v1").build();
    this.objectMapper = objectMapper;
    this.openAiApiKey = openAiApiKey;
  }

  @Cacheable(value = "aiPages", key = "#planTier + ':' + #request.category + ':' + T(org.apache.commons.codec.digest.DigestUtils).sha256Hex(#request.prompt)")
  public AIGenerateResponse generateFullPage(AIGenerateRequest request, String planTier) {
    validatePrompt(request.getPrompt());

    String systemPrompt = "You are an expert copywriter, SEO specialist, and UI designer. Output MUST be valid JSON matching this schema exactly:\n"
        +
        "{\n" +
        "  \"headline\": \"string (max 8 words)\",\n" +
        "  \"bio\": \"string (strictly maximum 155 characters. Do not exceed this limit under any circumstance)\",\n" +
        "  \"theme\": \"string (pick ONE exactly from: DEEP_SEA, SUNSET, FOREST, LAVENDER, MONOCHROME, NEON, MINIMAL_LIGHT, COFFEE, OCEAN, NATURE)\",\n"
        +
        "  \"metaTitle\": \"string (SEO title, max 60 chars)\",\n" +
        "  \"metaDescription\": \"string (SEO desc, max 160 chars)\",\n" +
        "  \"waDefaultMessage\": \"string (A friendly pre-filled WhatsApp message for prospects to send)\",\n" +
        "  \"socialLinks\": [\n" +
        "    { \"platform\": \"instagram|twitter|youtube|tiktok|linkedin\", \"url\": \"https://...\" }\n" +
        "  ],\n" +
        "  \"blocks\": [\n" +
        "    { \"type\": \"HEADER\", \"content\": { \"text\": \"string\", \"align\": \"center\" }, \"visible\": true, \"order\": 0 },\n"
        +
        "    { \"type\": \"LINK\", \"content\": { \"title\": \"string\", \"url\": \"#\", \"highlight\": boolean, \"animation\": \"pulse|bounce|wiggle|none\", \"overrideBgColor\": \"#HEX or rgba (optional)\", \"overrideTextColor\": \"#HEX (optional)\", \"overrideStrokeColor\": \"#HEX (optional)\", \"overrideCornerRadius\": \"sharp|rounded|pill|xl (optional)\", \"overrideShadow\": \"NONE|SM|MD|LG|GLOW (optional)\" }, \"visible\": true, \"order\": 1 },\n"
        +
        "    { \"type\": \"TEXT\", \"content\": { \"text\": \"string (paragraph)\" }, \"visible\": true, \"order\": 2 },\n"
        +
        "    { \"type\": \"IMAGE\", \"content\": { \"url\": \"https://images.unsplash.com/...\", \"alt\": \"string\" }, \"visible\": true, \"order\": 3 },\n"
        +
        "    { \"type\": \"VIDEO\", \"content\": { \"url\": \"https://youtube.com/...\" }, \"visible\": true, \"order\": 4 }\n"
        +
        "  ]\n" +
        "}\n" +
        "Instructions:\n" +
        "1. Generate 4-7 engaging blocks relevant to the user prompt. Mix LINK, HEADER, TEXT, IMAGE, and VIDEO blocks.\n"
        +
        "2. Include 2-4 appropriate social profiles in socialLinks.\n" +
        "3. Provide strong SEO metaTitle and metaDescription.\n" +
        "4. Provide a friendly waDefaultMessage.\n" +
        "5. For the most important 'Call to Action' LINK block, use `overrideBgColor`, `overrideTextColor` (e.g., #000000 and #FFFFFF), `overrideShadow` (e.g., 'GLOW'), and an `animation` (e.g., 'pulse' or 'wiggle') to make it stand out from the rest. Also, you can specify these override properties for any other block if it fits the design better.\n"
        +
        "6. DO NOT include markdown block formatting, just the raw JSON.";

    String userPrompt = "Category: " + request.getCategory() + "\nPrompt: " + request.getPrompt();

    String rawResponse = callOpenAI(systemPrompt, userPrompt, 1200); // Increased tokens for larger output
    return parseFullPageResponse(rawResponse, request.getCategory());
  }

  @Cacheable(value = "aiFields", key = "#planTier + ':' + #request.category + ':' + #request.fieldName + ':' + T(org.apache.commons.codec.digest.DigestUtils).sha256Hex(#request.prompt)")
  public String generateField(AIFieldGenerateRequest request, String planTier) {
    validatePrompt(request.getPrompt());

    String systemPrompt = "You are an expert copywriter. Generate content for a single field: " + request.getFieldName()
        + ".\n" +
        "Constraints:\n" +
        "- If headline: max 8 words.\n" +
        "- If bio: strictly maximum 155 characters.\n" +
        "- If links: output a single link title.\n" +
        "Do NOT include URLs. Only return the raw text, no quotes or JSON.";

    String userPrompt = "Category: " + request.getCategory() + "\nPrompt: " + request.getPrompt();

    try {
      String rawResponse = callOpenAI(systemPrompt, userPrompt, 100);
      return sanitizeContent(rawResponse).trim().replaceAll("^\"|\"$", "");
    } catch (Exception e) {
      return getCategoryFallback(request.getCategory(), request.getFieldName());
    }
  }

  private void validatePrompt(String prompt) {
    if (prompt == null || prompt.trim().isEmpty()) {
      throw new IllegalArgumentException("Prompt cannot be empty");
    }
    if (prompt.length() > 500) {
      throw new IllegalArgumentException("Prompt exceeds 500 characters limit");
    }
  }

  private String callOpenAI(String systemPrompt, String userPrompt, int maxTokens) {
    if (openAiApiKey == null || openAiApiKey.isEmpty() || openAiApiKey.equals("your_openai_api_key_here")) {
      throw new IllegalStateException("OpenAI API Key is not configured");
    }

    Map<String, Object> requestBody = new HashMap<>();
    requestBody.put("model", "gpt-4o-mini");
    requestBody.put("max_tokens", maxTokens);

    List<Map<String, String>> messages = new ArrayList<>();

    Map<String, String> systemMsg = new HashMap<>();
    systemMsg.put("role", "system");
    systemMsg.put("content", systemPrompt);
    messages.add(systemMsg);

    Map<String, String> userMsg = new HashMap<>();
    userMsg.put("role", "user");
    userMsg.put("content", userPrompt);
    messages.add(userMsg);

    requestBody.put("messages", messages);

    try {
      String response = webClient.post()
          .uri("/chat/completions")
          .header(HttpHeaders.AUTHORIZATION, "Bearer " + openAiApiKey)
          .contentType(MediaType.APPLICATION_JSON)
          .bodyValue(requestBody)
          .retrieve()
          .bodyToMono(String.class)
          .timeout(Duration.ofSeconds(8))
          .block();

      if (response == null || response.length() > 10000) {
        throw new RuntimeException("Unexpectedly long or empty response from AI");
      }

      JsonNode root = objectMapper.readTree(response);
      JsonNode messageNode = root.path("choices").path(0).path("message").path("content");
      if (messageNode.isMissingNode()) {
        throw new RuntimeException("Invalid response format from AI");
      }

      return messageNode.asText();
    } catch (Exception e) {
      // Log properly in production
      throw new RuntimeException("AI generation failed or timed out: " + e.getMessage(), e);
    }
  }

  private AIGenerateResponse parseFullPageResponse(String rawContent, String category) {
    try {
      // Strip markdown JSON wrapping if present
      rawContent = rawContent.trim();
      if (rawContent.startsWith("```json")) {
        rawContent = rawContent.substring(7);
      } else if (rawContent.startsWith("```")) {
        rawContent = rawContent.substring(3);
      }
      if (rawContent.endsWith("```")) {
        rawContent = rawContent.substring(0, rawContent.length() - 3);
      }

      AIGenerateResponse response = objectMapper.readValue(rawContent, AIGenerateResponse.class);

      // Sanitization
      response.setHeadline(sanitizeContent(response.getHeadline()));
      response.setBio(sanitizeBio(response.getBio()));
      response.setPrimaryCta(sanitizeContent(response.getPrimaryCta()));
      response.setSecondaryCta(sanitizeContent(response.getSecondaryCta()));

      String theme = sanitizeContent(response.getTheme());
      if (theme.isEmpty())
        theme = "MINIMAL_LIGHT";
      response.setTheme(theme);

      if (response.getLinkSuggestions() != null) {
        // Limit to 5
        List<String> sanitizedLinks = new ArrayList<>();
        for (int i = 0; i < Math.min(5, response.getLinkSuggestions().size()); i++) {
          sanitizedLinks.add(sanitizeContent(response.getLinkSuggestions().get(i)));
        }
        response.setLinkSuggestions(sanitizedLinks);
      }

      return response;
    } catch (Exception e) {
      return getFullPageFallback(category);
    }
  }

  private String sanitizeContent(String content) {
    if (content == null)
      return "";
    // Remove URLs to protect against toxic links
    content = content.replaceAll("https?://\\S+\\s?", "");
    return content.trim();
  }

  private String sanitizeBio(String bio) {
    String sanitized = sanitizeContent(bio);
    if (sanitized.length() > 155) {
      // Hard cut off at 155 chars to ensure it fits the UI/DB limit cleanly
      return sanitized.substring(0, 152).trim() + "...";
    }
    return sanitized;
  }

  private AIGenerateResponse getFullPageFallback(String category) {
    AIGenerateResponse fallback = new AIGenerateResponse();
    fallback.setHeadline("Welcome to my page");
    fallback.setBio("Check out my latest updates and projects below.");
    fallback.setPrimaryCta("Contact Me");
    fallback.setSecondaryCta("Learn More");
    fallback.setLinkSuggestions(List.of("My Portfolio", "Instagram", "Twitter", "Latest Video", "My Blog"));
    fallback.setTheme("MINIMAL_LIGHT");

    if (category != null) {
      String cat = category.toUpperCase();
      if (cat.contains("FITNESS") || cat.contains("YOGA")) {
        fallback.setHeadline("Fitness Coaching");
        fallback.setBio("Certified trainer helping you build strength and balance.");
        fallback.setPrimaryCta("Book a Session");
        fallback.setSecondaryCta("Workout Plans");
        fallback.setLinkSuggestions(
            List.of("1-on-1 Coaching", "Nutrition Guide", "YouTube Channel", "Instagram", "Testimonials"));
        fallback.setTheme("NATURE");
      } else if (cat.contains("REAL") && cat.contains("ESTATE")) {
        fallback.setHeadline("Real Estate Expert");
        fallback.setBio("Professional real estate consultant helping you find the right property.");
        fallback.setPrimaryCta("View Listings");
        fallback.setSecondaryCta("Contact Agent");
        fallback.setLinkSuggestions(
            List.of("Current Properties", "Schedule a Tour", "Market Updates", "Client Reviews", "About Me"));
        fallback.setTheme("OCEAN");
      }
    }
    return fallback;
  }

  private String getCategoryFallback(String category, String fieldName) {
    AIGenerateResponse fallbackObj = getFullPageFallback(category);
    if ("headline".equalsIgnoreCase(fieldName))
      return fallbackObj.getHeadline();
    if ("bio".equalsIgnoreCase(fieldName))
      return fallbackObj.getBio();
    if ("primaryCta".equalsIgnoreCase(fieldName))
      return fallbackObj.getPrimaryCta();
    if ("secondaryCta".equalsIgnoreCase(fieldName))
      return fallbackObj.getSecondaryCta();
    if ("links".equalsIgnoreCase(fieldName))
      return fallbackObj.getLinkSuggestions().get(0);
    return "";
  }
}
