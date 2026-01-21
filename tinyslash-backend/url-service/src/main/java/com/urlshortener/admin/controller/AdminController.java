package com.urlshortener.admin.controller;

import com.urlshortener.admin.model.AdminUser;
import com.urlshortener.admin.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin/admins")
@CrossOrigin(origins = "*")
public class AdminController {

  @Autowired
  private AdminUserService adminUserService;

  @GetMapping
  @PreAuthorize("hasAuthority('ADMIN_employees:read')")
  public ResponseEntity<?> getAdmins(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size,
      @RequestParam(defaultValue = "createdAt") String sortBy,
      @RequestParam(defaultValue = "DESC") String sortOrder,
      @RequestParam(required = false) String search) {

    try {
      Sort.Direction direction = Sort.Direction.fromString(sortOrder);
      Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

      Page<AdminUser> admins;

      if (search != null && !search.trim().isEmpty()) {
        admins = adminUserService.searchByNameOrEmail(search, pageable);
      } else {
        admins = adminUserService.findAll(pageable);
      }

      System.out
          .println("AdminController: Found " + admins.getTotalElements() + " admin users from admin_users collection");

      Map<String, Object> response = new HashMap<>();
      response.put("content", admins.getContent());
      response.put("currentPage", admins.getNumber());
      response.put("totalItems", admins.getTotalElements());
      response.put("totalPages", admins.getTotalPages());
      response.put("pageSize", admins.getSize());
      response.put("hasNext", admins.hasNext());
      response.put("hasPrevious", admins.hasPrevious());

      return ResponseEntity.ok(Map.of(
          "success", true,
          "data", response));

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.internalServerError().body(Map.of(
          "success", false,
          "message", "Error fetching admins: " + e.getMessage()));
    }
  }
}
