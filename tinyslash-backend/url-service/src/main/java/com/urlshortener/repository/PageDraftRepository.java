package com.urlshortener.repository;

import com.urlshortener.model.PageDraft;
import com.urlshortener.model.PageDraftStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PageDraftRepository extends MongoRepository<PageDraft, String> {
  List<PageDraft> findByPageId(String pageId);

  List<PageDraft> findByAgencyUserId(String agencyUserId);

  Optional<PageDraft> findByPageIdAndStatus(String pageId, PageDraftStatus status);

  List<PageDraft> findByPageIdAndStatusIn(String pageId, List<PageDraftStatus> statuses);
}
