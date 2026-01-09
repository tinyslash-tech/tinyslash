package com.urlshortener.repository;

import com.urlshortener.model.Coupon;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CouponRepository extends MongoRepository<Coupon, String> {
  Optional<Coupon> findByCode(String code);

  boolean existsByCode(String code);
}
