package com.urlshortener.service;

import com.urlshortener.model.TrustVerification;
import com.urlshortener.model.User;
import com.urlshortener.repository.TrustVerificationRepository;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class TrustVerificationService {

  @Autowired
  private TrustVerificationRepository repository;

  @Autowired
  private UserRepository userRepository;

  public TrustVerification submitApplication(String userId, TrustVerification application) {
    // Eligibility Check
    User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    // Simplified Plan Check (assume string contains)
    // In real app, check structured plan data
    // Simplified Plan Check
    boolean hasPlan = user.getPlan() != null &&
        (user.getPlan().toUpperCase().contains("PRO") ||
            user.getPlan().toUpperCase().contains("BUSINESS"));

    // Also check subscriptionPlan (new field often used)
    boolean hasSubscription = user.getSubscriptionPlan() != null &&
        (user.getSubscriptionPlan().toUpperCase().contains("PRO") ||
            user.getSubscriptionPlan().toUpperCase().contains("BUSINESS"));

    if (!hasPlan && !hasSubscription) {
      throw new RuntimeException("Eligible Plan Required (Pro or Business)");
    }

    application.setUserId(userId);
    application.setStatus(TrustVerification.VerificationStatus.PENDING_REVIEW);
    application.setCreatedAt(LocalDateTime.now());

    return repository.save(application);
  }

  public Optional<TrustVerification> getStatus(String userId) {
    return repository.findByUserId(userId);
  }

  public Optional<TrustVerification> getApprovedVerification(String userId) {
    return repository.findByUserIdAndStatus(userId, TrustVerification.VerificationStatus.APPROVED);
  }

  // Admin function to approve
  public void approveApplication(String userId) {
    TrustVerification tv = repository.findByUserId(userId)
        .orElseThrow(() -> new RuntimeException("Application not found"));

    tv.setStatus(TrustVerification.VerificationStatus.APPROVED);
    tv.setVerifiedAt(LocalDateTime.now());
    tv.setExpiresAt(LocalDateTime.now().plusYears(1));
    repository.save(tv);
  }
}
