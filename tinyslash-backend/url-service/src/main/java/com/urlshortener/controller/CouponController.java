package com.urlshortener.controller;

import com.urlshortener.model.Coupon;
import com.urlshortener.service.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

  @Autowired
  private CouponService couponService;

  @GetMapping("/admin/all")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> getAllCoupons() {
    Map<String, Object> response = new HashMap<>();
    try {
      List<Coupon> coupons = couponService.getAllCoupons();
      response.put("success", true);
      response.put("data", coupons);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to fetch coupons: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @PostMapping("/admin/create")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> createCoupon(@RequestBody Coupon coupon) {
    Map<String, Object> response = new HashMap<>();
    try {
      Coupon createdCoupon = couponService.createCoupon(coupon);
      response.put("success", true);
      response.put("data", createdCoupon);
      response.put("message", "Coupon created successfully");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to create coupon: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @PutMapping("/admin/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> updateCoupon(@PathVariable String id, @RequestBody Coupon coupon) {
    Map<String, Object> response = new HashMap<>();
    try {
      Coupon updatedCoupon = couponService.updateCoupon(id, coupon);
      response.put("success", true);
      response.put("data", updatedCoupon);
      response.put("message", "Coupon updated successfully");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to update coupon: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }

  @DeleteMapping("/admin/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Map<String, Object>> deleteCoupon(@PathVariable String id) {
    Map<String, Object> response = new HashMap<>();
    try {
      couponService.deleteCoupon(id);
      response.put("success", true);
      response.put("message", "Coupon deleted successfully");
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      response.put("success", false);
      response.put("message", "Failed to delete coupon: " + e.getMessage());
      return ResponseEntity.status(500).body(response);
    }
  }
}
