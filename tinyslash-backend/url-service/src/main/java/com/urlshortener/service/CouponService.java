package com.urlshortener.service;

import com.urlshortener.model.Coupon;
import com.urlshortener.repository.CouponRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CouponService {

  @Autowired
  private CouponRepository couponRepository;

  public List<Coupon> getAllCoupons() {
    return couponRepository.findAll();
  }

  public Optional<Coupon> getCouponById(String id) {
    return couponRepository.findById(id);
  }

  public Optional<Coupon> getCouponByCode(String code) {
    return couponRepository.findByCode(code);
  }

  public Coupon createCoupon(Coupon coupon) {
    if (couponRepository.existsByCode(coupon.getCode())) {
      throw new RuntimeException("Coupon code already exists: " + coupon.getCode());
    }
    coupon.setCreatedAt(LocalDateTime.now());
    coupon.setUpdatedAt(LocalDateTime.now());
    return couponRepository.save(coupon);
  }

  public Coupon updateCoupon(String id, Coupon couponDetails) {
    Optional<Coupon> couponOpt = couponRepository.findById(id);
    if (couponOpt.isEmpty()) {
      throw new RuntimeException("Coupon not found with id: " + id);
    }

    Coupon coupon = couponOpt.get();

    // Update fields if provided
    if (couponDetails.getDescription() != null)
      coupon.setDescription(couponDetails.getDescription());
    if (couponDetails.getDiscountType() != null)
      coupon.setDiscountType(couponDetails.getDiscountType());
    if (couponDetails.getDiscountValue() != null)
      coupon.setDiscountValue(couponDetails.getDiscountValue());
    if (couponDetails.getMaxUses() != null)
      coupon.setMaxUses(couponDetails.getMaxUses());
    if (couponDetails.getExpiryDate() != null)
      coupon.setExpiryDate(couponDetails.getExpiryDate());
    if (couponDetails.getApplicablePlans() != null)
      coupon.setApplicablePlans(couponDetails.getApplicablePlans());

    coupon.setActive(couponDetails.isActive());
    coupon.setUpdatedAt(LocalDateTime.now());

    return couponRepository.save(coupon);
  }

  public void deleteCoupon(String id) {
    couponRepository.deleteById(id);
  }

  public boolean validateCoupon(String code) {
    Optional<Coupon> couponOpt = couponRepository.findByCode(code);
    if (couponOpt.isEmpty())
      return false;

    return couponOpt.get().isValid();
  }
}
