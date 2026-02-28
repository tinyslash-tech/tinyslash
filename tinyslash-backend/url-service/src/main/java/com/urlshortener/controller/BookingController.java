package com.urlshortener.controller;

import com.urlshortener.model.CreatorSchedule;
import com.urlshortener.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/booking")
@CrossOrigin(origins = "*")
public class BookingController {

  private static final Logger logger = LoggerFactory.getLogger(BookingController.class);

  @Autowired
  private BookingService bookingService;

  @GetMapping("/schedule")
  public ResponseEntity<?> getMySchedule(HttpServletRequest request) {
    String userId = getCurrentUserId(request);
    if (userId == null) {
      return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
    }
    try {
      CreatorSchedule schedule = bookingService.getCreatorSchedule(userId);
      return ResponseEntity.ok(Map.of("success", true, "schedule", schedule));
    } catch (Exception e) {
      logger.error("Failed to fetch schedule for user {}", userId, e);
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @PostMapping("/schedule")
  public ResponseEntity<?> updateSchedule(HttpServletRequest request,
      @RequestBody CreatorSchedule schedule) {
    String userId = getCurrentUserId(request);
    if (userId == null) {
      return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
    }
    try {
      CreatorSchedule updated = bookingService.saveCreatorSchedule(userId, schedule);
      return ResponseEntity.ok(Map.of("success", true, "schedule", updated));
    } catch (Exception e) {
      logger.error("Failed to update schedule for user {}", userId, e);
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @GetMapping("/public/slots")
  public ResponseEntity<?> getPublicSlots(
      @RequestParam String creatorId,
      @RequestParam String date,
      @RequestParam int duration) {

    try {
      List<String> validSlots = bookingService.getAvailableSlots(creatorId, date, duration);
      return ResponseEntity.ok(Map.of("success", true, "slots", validSlots));
    } catch (Exception e) {
      logger.error("Failed to fetch public slots for creator {} on date {}", creatorId, date, e);
      return ResponseEntity.badRequest().body(Map.of("success", false, "slots", List.of()));
    }
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
}
