package com.urlshortener.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.urlshortener.model.WAInteraction;

@Repository
public interface WAInteractionRepository extends MongoRepository<WAInteraction, String> {
}
