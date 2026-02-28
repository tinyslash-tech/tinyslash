package com.urlshortener.service;

import com.urlshortener.model.Page;
import com.urlshortener.model.PageDraft;
import com.urlshortener.model.PageDraftStatus;
import com.urlshortener.repository.PageDraftRepository;
import com.urlshortener.repository.PageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PageDraftService {

  @Autowired
  private PageDraftRepository pageDraftRepository;

  @Autowired
  private PageRepository pageRepository;

  /**
   * Saves progress of a draft. If a DRAFT already exists for the page, updates
   * it.
   * If a PENDING or APPROVED draft exists, creates a new DRAFT and marks older
   * ones SUPERSEDED if necessary.
   */
  public PageDraft saveDraft(String pageId, String agencyUserId, PageDraft inputDraft) {
    // 1. Check for existing active drafts
    Optional<PageDraft> existingDraftOpt = pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.DRAFT);

    PageDraft draftToSave;

    if (existingDraftOpt.isPresent()) {
      // Update existing draft
      draftToSave = existingDraftOpt.get();
      // We only update the content fields
      draftToSave.setTitle(inputDraft.getTitle());
      draftToSave.setBio(inputDraft.getBio());
      draftToSave.setAvatarUrl(inputDraft.getAvatarUrl());
      draftToSave.setTheme(inputDraft.getTheme());
      draftToSave.setBlocks(inputDraft.getBlocks());
      draftToSave.setPublished(inputDraft.isPublished());
      draftToSave.setCustomDomain(inputDraft.getCustomDomain());
      draftToSave.setRemoveBranding(inputDraft.isRemoveBranding());
      draftToSave.setVerified(inputDraft.isVerified());
      draftToSave.setWaNumber(inputDraft.getWaNumber());
      draftToSave.setWaDefaultMessage(inputDraft.getWaDefaultMessage());
      draftToSave.setWaSmartTemplate(inputDraft.getWaSmartTemplate());
      draftToSave.setWaDisplayType(inputDraft.getWaDisplayType());
      draftToSave.setMetaTitle(inputDraft.getMetaTitle());
      draftToSave.setMetaDescription(inputDraft.getMetaDescription());
      draftToSave.setFbPixelId(inputDraft.getFbPixelId());
      draftToSave.setGoogleAnalyticsId(inputDraft.getGoogleAnalyticsId());
      draftToSave.setCustomScripts(inputDraft.getCustomScripts());
      draftToSave.setUpdatedAt(LocalDateTime.now());
    } else {
      // Get the original page to inherit slug and userId
      Page originalPage = pageRepository.findById(pageId)
          .orElseThrow(() -> new RuntimeException("Original page not found"));

      // Create new draft
      inputDraft.setId(null); // Ensure MongoDB generates a new ID
      inputDraft.setPageId(pageId);
      inputDraft.setAgencyUserId(agencyUserId);
      inputDraft.setStatus(PageDraftStatus.DRAFT);
      inputDraft.setUserId(originalPage.getUserId());
      inputDraft.setSlug(originalPage.getSlug());
      inputDraft.setCreatedAt(LocalDateTime.now());
      inputDraft.setUpdatedAt(LocalDateTime.now());

      draftToSave = inputDraft;
    }

    return pageDraftRepository.save(draftToSave);
  }

  /**
   * Submits a DRAFT for review. Changes status from DRAFT -> PENDING.
   */
  public PageDraft submitDraftForApproval(String pageId) {
    PageDraft draft = pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.DRAFT)
        .orElseThrow(() -> new RuntimeException("No active draft found to submit"));

    // Optional: If there's an existing PENDING draft, supersede it
    Optional<PageDraft> existingPending = pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.PENDING);
    if (existingPending.isPresent()) {
      PageDraft oldPending = existingPending.get();
      oldPending.setStatus(PageDraftStatus.SUPERSEDED);
      pageDraftRepository.save(oldPending);
    }

    draft.setStatus(PageDraftStatus.PENDING);
    draft.setUpdatedAt(LocalDateTime.now());
    return pageDraftRepository.save(draft);
  }

  /**
   * Approves a PENDING draft and merges it into the live Page.
   */
  @Transactional
  public PageDraft approveDraft(String pageId, String clientId) {
    PageDraft pendingDraft = pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.PENDING)
        .orElseThrow(() -> new RuntimeException("No pending draft found to approve"));

    // Security check: ensure the clientId here actually owns the page (handled
    // primarily by Controller, but good practice if needed)

    Page livePage = pageRepository.findById(pageId)
        .orElseThrow(() -> new RuntimeException("Live page not found"));

    // Merge fields from draft -> live
    livePage.setTitle(pendingDraft.getTitle());
    livePage.setBio(pendingDraft.getBio());
    livePage.setAvatarUrl(pendingDraft.getAvatarUrl());
    livePage.setTheme(pendingDraft.getTheme());
    livePage.setBlocks(pendingDraft.getBlocks());
    livePage.setPublished(pendingDraft.isPublished());
    livePage.setCustomDomain(pendingDraft.getCustomDomain());
    livePage.setRemoveBranding(pendingDraft.isRemoveBranding());
    livePage.setVerified(pendingDraft.isVerified());
    livePage.setWaNumber(pendingDraft.getWaNumber());
    livePage.setWaDefaultMessage(pendingDraft.getWaDefaultMessage());
    livePage.setWaSmartTemplate(pendingDraft.getWaSmartTemplate());
    livePage.setWaDisplayType(pendingDraft.getWaDisplayType());
    livePage.setMetaTitle(pendingDraft.getMetaTitle());
    livePage.setMetaDescription(pendingDraft.getMetaDescription());
    livePage.setFbPixelId(pendingDraft.getFbPixelId());
    livePage.setGoogleAnalyticsId(pendingDraft.getGoogleAnalyticsId());
    livePage.setCustomScripts(pendingDraft.getCustomScripts());
    livePage.setUpdatedAt(LocalDateTime.now());

    // Save Live Page
    pageRepository.save(livePage);

    // Mark draft as approved
    pendingDraft.setStatus(PageDraftStatus.APPROVED);
    return pageDraftRepository.save(pendingDraft);
  }

  /**
   * Rejects a PENDING draft. Status -> REJECTED.
   */
  public PageDraft rejectDraft(String pageId) {
    PageDraft pendingDraft = pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.PENDING)
        .orElseThrow(() -> new RuntimeException("No pending draft found to reject"));

    pendingDraft.setStatus(PageDraftStatus.REJECTED);
    pendingDraft.setUpdatedAt(LocalDateTime.now());
    return pageDraftRepository.save(pendingDraft);
  }

  /**
   * Gets the active draft (either DRAFT or PENDING).
   * Used by PageBuilder to load the current workspace state.
   */
  public Optional<PageDraft> getActiveDraft(String pageId) {
    // Check DRAFT first, then PENDING
    Optional<PageDraft> draft = pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.DRAFT);
    if (draft.isPresent())
      return draft;

    return pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.PENDING);
  }

  /**
   * Gets a specific PENDING draft, usually for client review.
   */
  public Optional<PageDraft> getPendingDraft(String pageId) {
    return pageDraftRepository.findByPageIdAndStatus(pageId, PageDraftStatus.PENDING);
  }
}
