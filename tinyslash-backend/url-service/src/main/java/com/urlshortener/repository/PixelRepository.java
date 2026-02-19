package com.urlshortener.repository;

import com.urlshortener.model.Pixel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PixelRepository extends MongoRepository<Pixel, String> {

  List<Pixel> findByUserId(String userId);

  Optional<Pixel> findByIdAndUserId(String id, String userId);

  long countByUserId(String userId);
}
