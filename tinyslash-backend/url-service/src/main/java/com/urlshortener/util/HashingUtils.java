package com.urlshortener.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashingUtils {

  /**
   * Normalizes and hashes a string using SHA-256 as per Meta CAPI requirements.
   * Trims whitespace and converts to lowercase before hashing.
   *
   * @param input The input string (e.g., email, phone)
   * @return The SHA-256 hash in hex format, or null if input is null
   */
  public static String hashSha256(String input) {
    if (input == null || input.trim().isEmpty()) {
      return null;
    }

    // Normalize: internal whitespace trimming and lowercase
    String normalized = input.trim().toLowerCase();

    try {
      MessageDigest digest = MessageDigest.getInstance("SHA-256");
      byte[] encodedhash = digest.digest(normalized.getBytes(StandardCharsets.UTF_8));
      return bytesToHex(encodedhash);
    } catch (NoSuchAlgorithmException e) {
      throw new RuntimeException("SHA-256 algorithm not found", e);
    }
  }

  private static String bytesToHex(byte[] hash) {
    StringBuilder hexString = new StringBuilder(2 * hash.length);
    for (byte b : hash) {
      String hex = Integer.toHexString(0xff & b);
      if (hex.length() == 1) {
        hexString.append('0');
      }
      hexString.append(hex);
    }
    return hexString.toString();
  }
}
