package com.urlshortener.controller;

import com.urlshortener.model.CustomerOrder;
import com.urlshortener.model.Booking;
import com.urlshortener.model.ClientAccess;
import com.urlshortener.model.User;
import com.urlshortener.repository.CustomerOrderRepository;
import com.urlshortener.repository.BookingRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.service.ClientService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/business")
@CrossOrigin(origins = "*")
public class BusinessController {

  @Autowired
  private CustomerOrderRepository customerOrderRepository;

  @Autowired
  private BookingRepository bookingRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private ClientService clientService;

  @GetMapping("/orders")
  public ResponseEntity<?> getOrders(HttpServletRequest request,
      @RequestParam(required = false) String pageId) {
    User currentUser = getCurrentUser(request);
    if (currentUser == null) {
      return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
    }

    try {
      List<CustomerOrder> orders;

      // Handle CLIENT role
      if (currentUser.getRoles().contains("ROLE_CLIENT")) {
        ClientAccess access = clientService.getClientAccess(currentUser.getId());
        if (access == null || access.getAllowedPageIds().isEmpty()) {
          return ResponseEntity.ok(Map.of("success", true, "data", List.of())); // No access
        }

        // If a specific page is requested
        if (pageId != null && !pageId.isEmpty()) {
          if (!access.getAllowedPageIds().contains(pageId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Forbidden page access"));
          }
          orders = customerOrderRepository.findByCreatorIdAndPageIdOrderByCreatedAtDesc(access.getAgencyUserId(),
              pageId);
        } else {
          // Return orders for all their allowed pages
          orders = customerOrderRepository.findByCreatorIdAndPageIdInOrderByCreatedAtDesc(access.getAgencyUserId(),
              access.getAllowedPageIds());
        }
      } else {
        // Standard flow for AGENCY/CREATOR
        if (pageId != null && !pageId.isEmpty()) {
          orders = customerOrderRepository.findByCreatorIdAndPageIdOrderByCreatedAtDesc(currentUser.getId(), pageId);
        } else {
          orders = customerOrderRepository.findByCreatorIdOrderByCreatedAtDesc(currentUser.getId());
        }
      }

      return ResponseEntity.ok(Map.of("success", true, "data", orders));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @GetMapping("/bookings")
  public ResponseEntity<?> getBookings(HttpServletRequest request,
      @RequestParam(required = false) String pageId) {
    User currentUser = getCurrentUser(request);
    if (currentUser == null) {
      return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
    }

    try {
      List<Booking> bookings;

      // Handle CLIENT role
      if (currentUser.getRoles().contains("ROLE_CLIENT")) {
        ClientAccess access = clientService.getClientAccess(currentUser.getId());
        if (access == null || access.getAllowedPageIds().isEmpty()) {
          return ResponseEntity.ok(Map.of("success", true, "data", List.of())); // No access
        }

        // If a specific page is requested
        if (pageId != null && !pageId.isEmpty()) {
          if (!access.getAllowedPageIds().contains(pageId)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Forbidden page access"));
          }
          bookings = bookingRepository.findByCreatorIdAndPageIdOrderByCreatedAtDesc(access.getAgencyUserId(), pageId);
        } else {
          // Return bookings for all their allowed pages
          bookings = bookingRepository.findByCreatorIdAndPageIdInOrderByCreatedAtDesc(access.getAgencyUserId(),
              access.getAllowedPageIds());
        }
      } else {
        // Standard flow for AGENCY/CREATOR
        if (pageId != null && !pageId.isEmpty()) {
          bookings = bookingRepository.findByCreatorIdAndPageIdOrderByCreatedAtDesc(currentUser.getId(), pageId);
        } else {
          bookings = bookingRepository.findByCreatorIdOrderByCreatedAtDesc(currentUser.getId());
        }
      }

      return ResponseEntity.ok(Map.of("success", true, "data", bookings));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  @GetMapping("/payouts")
  public ResponseEntity<?> getPayouts(HttpServletRequest request) {
    User currentUser = getCurrentUser(request);
    if (currentUser == null) {
      return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
    }

    try {
      List<CustomerOrder> paidOrders = List.of();

      // Handle CLIENT role
      if (currentUser.getRoles().contains("ROLE_CLIENT")) {
        ClientAccess access = clientService.getClientAccess(currentUser.getId());
        if (access != null && !access.getAllowedPageIds().isEmpty()) {
          List<CustomerOrder> clientOrders = customerOrderRepository
              .findByCreatorIdAndPageIdInOrderByCreatedAtDesc(access.getAgencyUserId(), access.getAllowedPageIds());
          paidOrders = clientOrders.stream().filter(o -> "PAID".equals(o.getStatus())).toList();
        }
      } else {
        // Standard flow
        paidOrders = customerOrderRepository.findByCreatorIdAndStatus(currentUser.getId(), "PAID");
      }

      long totalRevenuePaise = paidOrders.stream().mapToLong(CustomerOrder::getAmount).sum();

      Map<String, Object> ledger = new HashMap<>();
      ledger.put("totalRevenuePaise", totalRevenuePaise);
      ledger.put("totalTransactions", paidOrders.size());
      ledger.put("availableBalance", totalRevenuePaise); // Simulated

      return ResponseEntity.ok(Map.of("success", true, "data", ledger));
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
    }
  }

  private User getCurrentUser(HttpServletRequest request) {
    User currentUser = (User) request.getAttribute("currentUser");
    if (currentUser != null) {
      return currentUser;
    }

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof String) {
      String userId = (String) authentication.getPrincipal();
      Optional<User> userOpt = userRepository.findById(userId);
      return userOpt.orElse(null);
    }

    return null;
  }
}
