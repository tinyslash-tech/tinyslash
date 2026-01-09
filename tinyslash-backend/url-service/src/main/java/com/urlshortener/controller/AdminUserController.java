package com.urlshortener.controller;

import com.urlshortener.dto.response.ApiResponse;
import com.urlshortener.model.User;
import com.urlshortener.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
public class AdminUserController {

  @Autowired
  private UserService userService;

  @GetMapping
  public ResponseEntity<ApiResponse<Page<User>>> getAllUsers(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      @RequestParam(defaultValue = "createdAt") String sortBy,
      @RequestParam(defaultValue = "desc") String direction,
      @RequestParam(required = false) String search) {

    Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
    Pageable pageable = PageRequest.of(page, size, sort);

    Page<User> users;
    if (search != null && !search.isEmpty()) {
      users = userService.searchUsers(search, pageable);
    } else {
      users = userService.findAllUsers(pageable);
    }

    return ResponseEntity.ok(ApiResponse.success(users, "Users retrieved successfully"));
  }

  @PutMapping("/{id}/roles")
  public ResponseEntity<ApiResponse<User>> updateUserRoles(
      @PathVariable String id,
      @RequestBody Map<String, Set<String>> rolesRequest) {

    Set<String> roles = rolesRequest.get("roles");
    userService.updateUserRoles(id, roles);
    User updatedUser = userService.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

    return ResponseEntity.ok(ApiResponse.success(updatedUser, "User roles updated successfully"));
  }

  @PutMapping("/{id}/suspend")
  public ResponseEntity<ApiResponse<String>> suspendUser(@PathVariable String id,
      @RequestBody Map<String, String> body) {
    String reason = body.getOrDefault("reason", "Admin action");
    userService.suspendUser(id, reason);
    return ResponseEntity.ok(ApiResponse.success(null, "User suspended successfully"));
  }

  @PutMapping("/{id}/reactivate")
  public ResponseEntity<ApiResponse<String>> reactivateUser(@PathVariable String id) {
    userService.reactivateUser(id);
    return ResponseEntity.ok(ApiResponse.success(null, "User reactivated successfully"));
  }

  @GetMapping("/{id}")
  public ResponseEntity<ApiResponse<User>> getUserById(@PathVariable String id) {
    return userService.findById(id)
        .map(user -> ResponseEntity.ok(ApiResponse.success(user, "User retrieved successfully")))
        .orElse(ResponseEntity.notFound().build());
  }
}
