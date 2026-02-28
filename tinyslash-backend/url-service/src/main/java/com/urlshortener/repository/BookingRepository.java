package com.urlshortener.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.urlshortener.model.Booking;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
  List<Booking> findByCreatorIdAndBookingDateAndStatusIn(String creatorId, String bookingDate, List<String> statuses);

  List<Booking> findByCreatorIdOrderByCreatedAtDesc(String creatorId);

  List<Booking> findByCreatorIdAndPageIdOrderByCreatedAtDesc(String creatorId, String pageId);

  List<Booking> findByCreatorIdAndPageIdInOrderByCreatedAtDesc(String creatorId, List<String> pageIds);

  Optional<Booking> findByCustomerOrderId(String customerOrderId);
}
