package com.urlshortener.service;

import com.urlshortener.model.OtpToken;
import com.urlshortener.repository.OtpTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class OtpService {

  @Autowired
  private OtpTokenRepository otpTokenRepository;

  private static final int OTP_EXPIRATION_MINUTES = 5;
  private final SecureRandom secureRandom = new SecureRandom();

  /**
   * Generates a 6-digit OTP, saves it to the database, and returns it.
   */
  public String generateAndSaveOtp(String email) {
    // Remove any existing OTP for this email to prevent spam/confusion
    otpTokenRepository.deleteByEmail(email);

    // Generate 6-digit numeric code
    String otpCode = String.format("%06d", secureRandom.nextInt(1000000));

    OtpToken otpToken = new OtpToken(email, otpCode, OTP_EXPIRATION_MINUTES);
    otpTokenRepository.save(otpToken);

    return otpCode;
  }

  /**
   * Validates the OTP. Returns true if valid and not expired.
   */
  public boolean validateOtp(String email, String inputCode) {
    Optional<OtpToken> tokenOpt = otpTokenRepository.findByEmail(email);

    if (tokenOpt.isEmpty()) {
      return false;
    }

    OtpToken token = tokenOpt.get();

    // Check expiration manually (even though we have a TTL index, there can be a
    // slight delay in MongoDB's background pruning)
    if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
      otpTokenRepository.deleteById(token.getId());
      return false;
    }

    boolean isValid = token.getOtpCode().equals(inputCode);

    // If valid, immediately invalidate it so it can't be used twice
    if (isValid) {
      otpTokenRepository.deleteById(token.getId());
    }

    return isValid;
  }
}
