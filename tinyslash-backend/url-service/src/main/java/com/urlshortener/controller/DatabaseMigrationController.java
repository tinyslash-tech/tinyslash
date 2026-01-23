package com.urlshortener.controller;

import com.urlshortener.model.ShortenedUrl;
import com.urlshortener.repository.ShortenedUrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Update;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/migration")
public class DatabaseMigrationController {

    @Autowired
    private ShortenedUrlRepository shortenedUrlRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @PostMapping("/backfill-domains")
    public ResponseEntity<Map<String, Object>> backfillDomains() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Find records where domain is null
            Query query = new Query(Criteria.where("domain").is(null));
            Update update = new Update().set("domain", "tinyslash.com");

            // Execute batch update
            var result = mongoTemplate.updateMulti(query, update, ShortenedUrl.class);

            response.put("success", true);
            response.put("matchedCount", result.getMatchedCount());
            response.put("modifiedCount", result.getModifiedCount());
            response.put("message", "Successfully backfilled domains for legacy URLs");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Migration error: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}