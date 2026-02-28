package com.urlshortener.controller;

import com.urlshortener.model.PageDraft;
import com.urlshortener.model.User;
import com.urlshortener.model.ClientAccess;
import com.urlshortener.service.PageDraftService;
import com.urlshortener.service.UserService;
import com.urlshortener.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/pages/{id}/draft")
public class PageDraftController {

  @Autowired
  private PageDraftService pageDraftService;

  @Autowired
  private UserService userService;

  @Autowired
  private ClientService clientService;

  private User getAuthenticatedUser(Authentication authentication) {
    String userId;
    Object principal = authentication.getPrincipal();

    if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
      userId = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
    } else {
      userId = principal.toString();
    }

    return userService.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  /**
   * Save a draft for a page. Agency/Owner only.
   */
  @PostMapping
  @PreAuthorize("hasRole('AGENCY') or hasRole('BUSINESS') or hasRole('PRO') or hasRole('FREE')")
  public ResponseEntity<PageDraft> saveDraft(@PathVariable String id, @RequestBody PageDraft draft,
      Authentication authentication) {
    User user = getAuthenticatedUser(authentication);

    // In a real app, verify `user` owns `id` or has agency rights over it.

    PageDraft savedDraft = pageDraftService.saveDraft(id, user.getId(), draft);
    return ResponseEntity.ok(savedDraft);
  }

  /**
   * Submit the current DRAFT for client review. Agency/Owner only.
   */
  @PostMapping("/submit")
  @PreAuthorize("hasRole('AGENCY') or hasRole('BUSINESS') or hasRole('PRO') or hasRole('FREE')")
  public ResponseEntity<PageDraft> submitDraft(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    // Verify ownership/rights here

    PageDraft submittedDraft = pageDraftService.submitDraftForApproval(id);
    return ResponseEntity.ok(submittedDraft);
  }

  /**
   * Get the active draft (DRAFT or PENDING). For Agency/Owner loading the
   * builder.
   */
  @GetMapping
  @PreAuthorize("hasRole('AGENCY') or hasRole('BUSINESS') or hasRole('PRO') or hasRole('FREE')")
  public ResponseEntity<PageDraft> getActiveDraft(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);
    // Verify ownership/rights here

    Optional<PageDraft> draft = pageDraftService.getActiveDraft(id);
    return draft.map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  /**
   * Get the PENDING draft for a client to review. Requires ROLE_CLIENT.
   */
  @GetMapping("/review")
  @PreAuthorize("hasRole('CLIENT') or hasRole('AGENCY')")
  public ResponseEntity<PageDraft> getDraftForReview(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);

    if (user.getRoles().contains("ROLE_CLIENT")) {
      ClientAccess access = clientService.getClientAccess(user.getId());
      if (access == null || !access.getAllowedPageIds().contains(id)) {
        return ResponseEntity.status(403).build();
      }
    }

    Optional<PageDraft> draft = pageDraftService.getPendingDraft(id);
    return draft.map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }

  /**
   * Client approves the draft, merging it to live.
   */
  @PostMapping("/approve")
  @PreAuthorize("hasRole('CLIENT') or hasRole('AGENCY')")
  public ResponseEntity<PageDraft> approveDraft(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);

    if (user.getRoles().contains("ROLE_CLIENT")) {
      ClientAccess access = clientService.getClientAccess(user.getId());
      if (access == null || !access.getAllowedPageIds().contains(id)) {
        return ResponseEntity.status(403).build();
      }
    }

    PageDraft approvedDraft = pageDraftService.approveDraft(id, user.getId());
    return ResponseEntity.ok(approvedDraft);
  }

  /**
   * Client rejects the draft.
   */
  @PostMapping("/reject")
  @PreAuthorize("hasRole('CLIENT') or hasRole('AGENCY')")
  public ResponseEntity<PageDraft> rejectDraft(@PathVariable String id, Authentication authentication) {
    User user = getAuthenticatedUser(authentication);

    if (user.getRoles().contains("ROLE_CLIENT")) {
      ClientAccess access = clientService.getClientAccess(user.getId());
      if (access == null || !access.getAllowedPageIds().contains(id)) {
        return ResponseEntity.status(403).build();
      }
    }

    PageDraft rejectedDraft = pageDraftService.rejectDraft(id);
    return ResponseEntity.ok(rejectedDraft);
  }
}
