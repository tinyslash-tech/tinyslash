package com.urlshortener.controller;

import com.urlshortener.model.ClientAccess;
import com.urlshortener.model.User;
import com.urlshortener.service.ClientService;
import com.urlshortener.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/clients")
public class ClientController {

  @Autowired
  private ClientService clientService;

  @Autowired
  private UserService userService;

  private User getAuthenticatedUser(Authentication authentication) {
    String userId;
    Object principal = authentication.getPrincipal();
    if (principal == null) {
      throw new RuntimeException("User not authenticated");
    }

    if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
      userId = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
    } else {
      userId = principal.toString();
    }

    return userService.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  @PostMapping("/invite")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<?> inviteClient(@RequestBody InviteClientRequest request, Authentication authentication) {
    User currentUser = getAuthenticatedUser(authentication);

    // Ensure they have right to invite (e.g., they are not a client themselves)
    if (currentUser.getRoles().contains("ROLE_CLIENT")) {
      return ResponseEntity.status(403).body("Clients cannot invite other clients");
    }

    User invitedClient = clientService.inviteClient(
        currentUser.getId(),
        request.getEmail(),
        request.getFirstName(),
        request.getLastName(),
        request.getPageIds());

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Client invited successfully");
    response.put("clientId", invitedClient.getId());
    response.put("email", invitedClient.getEmail());

    return ResponseEntity.ok(response);
  }

  @GetMapping("/agency")
  @PreAuthorize("isAuthenticated()")
  public ResponseEntity<List<ClientAccess>> getAgencyClients(Authentication authentication) {
    User currentUser = getAuthenticatedUser(authentication);
    List<ClientAccess> clients = clientService.getClientsForAgency(currentUser.getId());
    return ResponseEntity.ok(clients);
  }

  @GetMapping("/me")
  @PreAuthorize("hasRole('CLIENT')")
  public ResponseEntity<ClientAccess> getMyClientAccess(Authentication authentication) {
    User currentUser = getAuthenticatedUser(authentication);
    ClientAccess access = clientService.getClientAccess(currentUser.getId());
    if (access == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(access);
  }

  // DTOs
  public static class InviteClientRequest {
    private String email;
    private String firstName;
    private String lastName;
    private List<String> pageIds;

    public String getEmail() {
      return email;
    }

    public void setEmail(String email) {
      this.email = email;
    }

    public String getFirstName() {
      return firstName;
    }

    public void setFirstName(String firstName) {
      this.firstName = firstName;
    }

    public String getLastName() {
      return lastName;
    }

    public void setLastName(String lastName) {
      this.lastName = lastName;
    }

    public List<String> getPageIds() {
      return pageIds;
    }

    public void setPageIds(List<String> pageIds) {
      this.pageIds = pageIds;
    }
  }
}
