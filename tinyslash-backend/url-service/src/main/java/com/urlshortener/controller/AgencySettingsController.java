package com.urlshortener.controller;

import com.urlshortener.model.User;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/agency/settings")
@CrossOrigin(origins = "*")
public class AgencySettingsController {

  @Autowired
  private UserRepository userRepository;

  @GetMapping("/{userId}")
  @PreAuthorize("hasAnyRole('AGENCY', 'ADMIN')")
  public ResponseEntity<Map<String, Object>> getAgencySettings(@PathVariable String userId) {
    Map<String, Object> response = new HashMap<>();

    try {
      Optional<User> userOpt = userRepository.findById(userId);
      if (userOpt.isEmpty()) {
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.badRequest().body(response);
      }

      User user = userOpt.get();

      Map<String, Object> settings = new HashMap<>();
      settings.put("agencyLogoUrl", user.getAgencyLogoUrl());
      settings.put("agencyBrandColor", user.getAgencyBrandColor());
      settings.put("agencyCustomDomain", user.getAgencyCustomDomain());
      settings.put("agencySupportEmail", user.getAgencySupportEmail());

      response.put("success", true);
      response.put("data", settings);

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "An error occurred fetching agency settings: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @GetMapping("/public/domain/{domain}")
  public ResponseEntity<Map<String, Object>> getPublicAgencySettingsByDomain(@PathVariable String domain) {
    Map<String, Object> response = new HashMap<>();

    try {
      Optional<User> userOpt = userRepository.findByAgencyCustomDomain(domain);
      if (userOpt.isEmpty()) {
        response.put("success", false);
        response.put("message", "Domain not recognized");
        return ResponseEntity.notFound().build();
      }

      User user = userOpt.get();

      Map<String, Object> settings = new HashMap<>();
      settings.put("agencyLogoUrl", user.getAgencyLogoUrl());
      settings.put("agencyBrandColor", user.getAgencyBrandColor());
      settings.put("agencyCustomDomain", user.getAgencyCustomDomain());
      settings.put("agencySupportEmail", user.getAgencySupportEmail());

      response.put("success", true);
      response.put("data", settings);

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "An error occurred fetching agency settings for domain: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @PutMapping("/{userId}")
  @PreAuthorize("hasAnyRole('AGENCY', 'ADMIN')")
  public ResponseEntity<Map<String, Object>> updateAgencySettings(
      @PathVariable String userId,
      @RequestBody Map<String, String> payload) {

    Map<String, Object> response = new HashMap<>();

    try {
      Optional<User> userOpt = userRepository.findById(userId);
      if (userOpt.isEmpty()) {
        response.put("success", false);
        response.put("message", "User not found");
        return ResponseEntity.badRequest().body(response);
      }

      User user = userOpt.get();

      if (payload.containsKey("agencyLogoUrl")) {
        user.setAgencyLogoUrl(payload.get("agencyLogoUrl"));
      }
      if (payload.containsKey("agencyBrandColor")) {
        user.setAgencyBrandColor(payload.get("agencyBrandColor"));
      }
      if (payload.containsKey("agencyCustomDomain")) {
        user.setAgencyCustomDomain(payload.get("agencyCustomDomain"));
      }
      if (payload.containsKey("agencySupportEmail")) {
        user.setAgencySupportEmail(payload.get("agencySupportEmail"));
      }

      user.setUpdatedAt(LocalDateTime.now());
      userRepository.save(user);

      response.put("success", true);
      response.put("message", "Agency settings updated successfully");

      Map<String, Object> updatedSettings = new HashMap<>();
      updatedSettings.put("agencyLogoUrl", user.getAgencyLogoUrl());
      updatedSettings.put("agencyBrandColor", user.getAgencyBrandColor());
      updatedSettings.put("agencyCustomDomain", user.getAgencyCustomDomain());
      updatedSettings.put("agencySupportEmail", user.getAgencySupportEmail());

      response.put("data", updatedSettings);

      return ResponseEntity.ok(response);

    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to update agency settings: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }
}
