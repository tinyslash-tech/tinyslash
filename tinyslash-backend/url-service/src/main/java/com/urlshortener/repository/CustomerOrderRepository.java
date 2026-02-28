package com.urlshortener.repository;

import com.urlshortener.model.CustomerOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOrderRepository extends MongoRepository<CustomerOrder, String> {
  List<CustomerOrder> findByCreatorIdOrderByCreatedAtDesc(String creatorId);

  List<CustomerOrder> findByCreatorIdAndPageIdOrderByCreatedAtDesc(String creatorId, String pageId);

  List<CustomerOrder> findByCreatorIdAndPageIdInOrderByCreatedAtDesc(String creatorId, List<String> pageIds);

  List<CustomerOrder> findByCreatorIdAndStatus(String creatorId, String status);

  List<CustomerOrder> findByPageIdOrderByCreatedAtDesc(String pageId);

  Optional<CustomerOrder> findByRazorpayOrderId(String razorpayOrderId);
}
