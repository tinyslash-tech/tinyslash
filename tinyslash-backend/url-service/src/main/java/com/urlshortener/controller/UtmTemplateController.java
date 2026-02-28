package com.urlshortener.controller;

import com.urlshortener.dto.CreateUtmTemplateRequest;
import com.urlshortener.dto.UpdateUtmTemplateRequest;
import com.urlshortener.dto.UtmTemplateDto;
import com.urlshortener.service.TeamService;
import com.urlshortener.service.UtmTemplateService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/teams/{teamId}/utm-templates")
@CrossOrigin(origins = "*")
public class UtmTemplateController {

  private final UtmTemplateService utmTemplateService;
  private final TeamService teamService;
  private final com.urlshortener.service.SubscriptionService subscriptionService;

  public UtmTemplateController(UtmTemplateService utmTemplateService, TeamService teamService,
      com.urlshortener.service.SubscriptionService subscriptionService) {
    this.utmTemplateService = utmTemplateService;
    this.teamService = teamService;
    this.subscriptionService = subscriptionService;
  }

  private String getCurrentUserId(HttpServletRequest request) {
    com.urlshortener.model.User currentUser = (com.urlshortener.model.User) request.getAttribute("currentUser");
    if (currentUser != null) {
      return currentUser.getId();
    }

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof String) {
      return (String) authentication.getPrincipal();
    }

    return null;
  }

  private void verifyTeamMembership(String teamId, String userId) {
    // Treat personal workspace (where teamId == userId) as valid bypass
    if (teamId != null && teamId.equals(userId)) {
      if (!subscriptionService.hasPremiumAccess(userId)) {
        throw new RuntimeException("UTM Templates require a PRO or BUSINESS plan for personal workspaces.");
      }
      return;
    }
    teamService.getTeam(teamId, userId);
  }

  @PostMapping
  public ResponseEntity<Map<String, Object>> createTemplate(
      @PathVariable String teamId,
      @RequestBody CreateUtmTemplateRequest request,
      HttpServletRequest httpRequest) {
    try {
      String userId = getCurrentUserId(httpRequest);
      if (userId == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not authenticated"));
      }
      if (request.getName() == null || request.getName().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Template name is required"));
      }

      verifyTeamMembership(teamId, userId);
      UtmTemplateDto result = utmTemplateService.createTemplate(teamId, userId, request);

      return ResponseEntity.ok(Map.of(
          "success", true,
          "message", "Template created successfully",
          "template", result));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @GetMapping
  public ResponseEntity<Map<String, Object>> getTemplates(
      @PathVariable String teamId,
      HttpServletRequest httpRequest) {
    try {
      String userId = getCurrentUserId(httpRequest);
      if (userId == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not authenticated"));
      }

      verifyTeamMembership(teamId, userId);
      List<UtmTemplateDto> results = utmTemplateService.getTemplatesByTeam(teamId);

      return ResponseEntity.ok(Map.of(
          "success", true,
          "templates", results));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @PutMapping("/{templateId}")
  public ResponseEntity<Map<String, Object>> updateTemplate(
      @PathVariable String teamId,
      @PathVariable String templateId,
      @RequestBody UpdateUtmTemplateRequest request,
      HttpServletRequest httpRequest) {
    try {
      String userId = getCurrentUserId(httpRequest);
      if (userId == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not authenticated"));
      }
      if (request.getName() == null || request.getName().trim().isEmpty()) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Template name is required"));
      }

      verifyTeamMembership(teamId, userId);
      UtmTemplateDto result = utmTemplateService.updateTemplate(teamId, templateId, userId, request);

      return ResponseEntity.ok(Map.of(
          "success", true,
          "message", "Template updated successfully",
          "template", result));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @DeleteMapping("/{templateId}")
  public ResponseEntity<Map<String, Object>> deleteTemplate(
      @PathVariable String teamId,
      @PathVariable String templateId,
      HttpServletRequest httpRequest) {
    try {
      String userId = getCurrentUserId(httpRequest);
      if (userId == null) {
        return ResponseEntity.badRequest().body(Map.of("success", false, "message", "User not authenticated"));
      }

      verifyTeamMembership(teamId, userId);
      utmTemplateService.deleteTemplate(teamId, templateId, userId);

      return ResponseEntity.ok(Map.of(
          "success", true,
          "message", "Template deleted successfully"));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }
}
