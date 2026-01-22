package com.urlshortener.service;

import com.urlshortener.model.DatabaseSequence;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicLong;

/**
 * Service to generate thread-safe, monotonically increasing IDs.
 * Uses BLOCK ALLOCATION (Batch of 1000) to reduce DB pressure.
 */
@Service
public class SequenceGeneratorService {

  private static final String URL_SEQUENCE_NAME = "url_sequence";
  private static final int BATCH_SIZE = 1000;

  @Autowired
  private MongoOperations mongoOperations;

  // In-memory counters
  private AtomicLong currentId = new AtomicLong(0);
  private long maxIdInBatch = 0;

  /**
   * Initializes the sequence generator on startup.
   * Ensures we start from a safe new block.
   */
  @PostConstruct
  public void init() {
    // Fetch the next block from DB immediately to initialize
    allocateNewBatch();
  }

  /**
   * Returns the next unique ID.
   * Thread-safe.
   */
  public synchronized long generateSequence(String seqName) {
    // Only handling "url_sequence" with optimization for now
    if (!URL_SEQUENCE_NAME.equals(seqName)) {
      // Fallback for other sequences (non-optimized)
      return getNextSequenceFromDb(seqName, 1);
    }

    // Check if current batch is exhausted
    if (currentId.get() >= maxIdInBatch) {
      allocateNewBatch();
    }

    return currentId.incrementAndGet();
  }

  /**
   * Fetch a new batch of IDs from the database.
   */
  private void allocateNewBatch() {
    // Atomically increment DB sequence by BATCH_SIZE
    long lastId = getNextSequenceFromDb(URL_SEQUENCE_NAME, BATCH_SIZE);

    // The DB returns the *new* max value.
    // So the batch range is: (lastId - BATCH_SIZE) to lastId.
    // We set our in-memory [currentId] to (lastId - BATCH_SIZE) so the next
    // increment() gives the first valid ID.

    this.maxIdInBatch = lastId;
    this.currentId.set(lastId - BATCH_SIZE);

    System.out.println("🆔 Allocated new ID Batch: " + (lastId - BATCH_SIZE + 1) + " -> " + lastId);
  }

  /**
   * Low-level DB atomic increment.
   */
  private long getNextSequenceFromDb(String seqName, int incrementBy) {
    DatabaseSequence counter = mongoOperations.findAndModify(
        Query.query(Criteria.where("_id").is(seqName)),
        new Update().inc("seq", incrementBy),
        FindAndModifyOptions.options().returnNew(true).upsert(true),
        DatabaseSequence.class);

    return counter != null ? counter.getSeq() : 1;
  }
}
