package com.urlshortener.service;

import com.urlshortener.model.PageDraft;
import com.urlshortener.model.PageDraftStatus;
import com.urlshortener.repository.PageDraftRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DraftEscalationService {

  private static final Logger logger = LoggerFactory.getLogger(DraftEscalationService.class);

  @Autowired
  private PageDraftRepository pageDraftRepository;

  @Autowired
  private PageDraftService pageDraftService;

  /**
   * Runs every day at midnight (UTC server time) to check for pending drafts
   * that have exceeded the 5-day auto-approve window.
   */
  @Scheduled(cron = "0 0 0 * * ?")
  public void autoApproveAgingDrafts() {
    logger.info("Starting Auto-Approve Job for Pending Drafts > 5 days old");

    // Fetch all pending drafts
    List<PageDraft> pendingDrafts = pageDraftRepository.findAll().stream()
        .filter(d -> d.getStatus() == PageDraftStatus.PENDING)
        .toList();

    LocalDateTime threshold = LocalDateTime.now().minusDays(5);
    int approvedCount = 0;

    for (PageDraft draft : pendingDrafts) {
      if (draft.getUpdatedAt().isBefore(threshold)) {
        try {
          // Auto-approve using the central service (passing null for clientId since it's
          // an automated system action)
          pageDraftService.approveDraft(draft.getPageId(), "SYSTEM_AUTO_APPROVE");
          logger.info("Auto-approved draft ID {} for Page ID {}", draft.getId(), draft.getPageId());
          approvedCount++;
        } catch (Exception e) {
          logger.error("Failed to auto-approve draft ID {}: {}", draft.getId(), e.getMessage());
        }
      }
    }

    logger.info("Completed Auto-Approve Job. Total drafts auto-approved: {}", approvedCount);
  }

  /**
   * Runs every day at 08:00 AM to send reminders for drafts pending > 2 days.
   * Note: This is a placeholder for the actual email/notification logic.
   */
  @Scheduled(cron = "0 0 8 * * ?")
  public void sendReviewReminders() {
    logger.info("Starting Day-2 Reminder Job for Pending Drafts");

    LocalDateTime threshold2Days = LocalDateTime.now().minusDays(2);
    LocalDateTime threshold5Days = LocalDateTime.now().minusDays(5);

    List<PageDraft> pendingDrafts = pageDraftRepository.findAll().stream()
        .filter(d -> d.getStatus() == PageDraftStatus.PENDING)
        .filter(d -> d.getUpdatedAt().isBefore(threshold2Days) && d.getUpdatedAt().isAfter(threshold5Days))
        .toList();

    for (PageDraft draft : pendingDrafts) {
      // Future Enhancement: Trigger Email/WhatsApp reminder to Client associated with
      // this Page
      logger.debug("Would send reminder for draft ID {} (Page ID {})", draft.getId(), draft.getPageId());
    }

    logger.info("Completed Day-2 Reminder Job. Need to notify {} clients.", pendingDrafts.size());
  }
}
