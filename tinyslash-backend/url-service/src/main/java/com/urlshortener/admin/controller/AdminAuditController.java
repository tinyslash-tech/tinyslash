package com.urlshortener.admin.controller;

import com.urlshortener.admin.model.AuditEvent;
import com.urlshortener.admin.service.AuditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/audit")
@PreAuthorize("hasRole('ADMIN')")
@ConditionalOnProperty(name = "app.admin.enabled", havingValue = "true", matchIfMissing = false)
public class AdminAuditController {

  @Autowired
  private AuditService auditService;

  @GetMapping
  @PreAuthorize("hasAuthority('ADMIN_audit:read')")
  public ResponseEntity<?> getAuditLogs(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "timestamp") String sortBy,
      @RequestParam(defaultValue = "DESC") String sortOrder,
      @RequestParam(required = false) String actorId,
      @RequestParam(required = false) String actionType) {

    try {
      Sort sort = Sort.by(Sort.Direction.fromString(sortOrder), sortBy);
      Pageable pageable = PageRequest.of(page, size, sort);

      Page<AuditEvent> events;

      if (actorId != null && !actorId.isEmpty()) {
        events = auditService.findByActor(actorId, pageable);
      } else if (actionType != null && !actionType.isEmpty()) {
        events = auditService.findByActionType(actionType, pageable);
      } else {
        events = auditService.findAll(pageable);
      }

      Map<String, Object> response = new HashMap<>();
      response.put("content", events.getContent());
      response.put("totalElements", events.getTotalElements());
      response.put("totalPages", events.getTotalPages());
      response.put("currentPage", events.getNumber());
      response.put("pageSize", events.getSize());
      response.put("hasNext", events.hasNext());
      response.put("hasPrevious", events.hasPrevious());

      return ResponseEntity.ok(Map.of(
          "success", true,
          "data", response));

    } catch (Exception e) {
      return ResponseEntity.internalServerError().body(Map.of(
          "success", false,
          "message", "Failed to fetch audit logs: " + e.getMessage()));
    }
  }

  @GetMapping("/export")
  @PreAuthorize("hasAuthority('ADMIN_audit:export')")
  public ResponseEntity<?> exportAuditLogs() {
    // Simple CSV export implementation placeholder
    // In real world, this would generate a CSV/Excel file
    return ResponseEntity.ok()
        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=audit-logs.csv")
        .contentType(MediaType.TEXT_PLAIN)
        .body("Timestamp,Actor,Action,Entity,Description\n");
  }
}
