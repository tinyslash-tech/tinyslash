package com.urlshortener.util;

import com.urlshortener.dto.SecurityDecision;
import com.urlshortener.dto.SecurityUiResponse;

public class SecurityMessageMapper {

  public static SecurityUiResponse mapToUserMessage(SecurityDecision decision) {
    String reason = decision.getReason();
    if (reason == null)
      reason = "unknown";

    // 1. ALLOWED ALLOWED
    if (decision.getDecision() == SecurityDecision.Decision.ALLOW) {
      return new SecurityUiResponse(
          "Link created successfully",
          "Link created successfully",
          "This URL passed Tinyslash security checks and is safe to share.",
          "SUCCESS",
          null,
          true);
    }

    // 2. WARNING
    if (decision.getDecision() == SecurityDecision.Decision.WARN) {
      return new SecurityUiResponse(
          "Safety Warning",
          "This link may be unsafe",
          "We detected potential risk signals in this URL. Please review carefully before sharing.",
          "WARNING",
          "TS-WARN-001",
          true // Allowed but warned
      );
    }

    // 3. BLOCKED - CATEGORIZED
    // Default Block Message (System-driven, neutral)
    String title = "Link blocked by Tinyslash Security";
    String primary = "Link blocked by Tinyslash Security";
    String secondary = "This URL did not pass our security checks and cannot be shortened.";
    String code = "TS-BLOCK-003"; // Default generic code

    // --- PHISHING / BRAND IMPERSONATION ---
    if (reason.startsWith("brand_") || reason.startsWith("punycode_brand") ||
        reason.startsWith("homoglyph_brand") || reason.contains("fake_banking") ||
        reason.contains("fake_govt") || reason.contains("fake_job") || reason.startsWith("obfuscated_brand")) {

      primary = "This link is blocked for security reasons";
      secondary = "The URL appears to imitate a trusted brand or service in a misleading way.";
      code = "TS-BLOCK-001"; // Security policy / Phishing
    }

    // --- MALWARE / FILE DOWNLOAD ---
    else if (reason.contains("malware") || reason.startsWith("blocked_file_type") ||
        reason.equals("executable_extension")) {

      primary = "File link blocked";
      secondary = "Links that distribute executable or harmful files are not supported on Tinyslash.";
      code = "TS-BLOCK-002"; // Unsafe file type
    }

    // --- SHORTENER CHAIN ---
    else if (reason.contains("nested_shortener") || reason.contains("shortener_")) {
      primary = "Link shortening not allowed";
      secondary = "This URL already uses a link shortener. Chained short links are blocked for safety.";
      code = "TS-BLOCK-003";
    }

    // --- TECHNICAL / STRUCTURE ISSUE ---
    else if (isStructureViolation(reason)) {
      primary = "Invalid or unsafe URL";
      secondary = "The provided URL contains unsafe formatting or unsupported structures.";
      code = "TS-BLOCK-003";
    }

    // --- RATE LIMIT ---
    else if (reason.contains("rate_limit")) {
      primary = "Action temporarily restricted";
      secondary = "Too many link creation attempts detected. Please try again later.";
      code = "TS-BLOCK-004";
    }

    // --- GENERIC / FALLBACK ---
    // Keeps the default initialized values

    return new SecurityUiResponse(
        title,
        primary,
        secondary,
        "ERROR",
        code,
        false);
  }

  private static boolean isStructureViolation(String reason) {
    return reason.contains("null_byte") || reason.contains("encoding") ||
        reason.contains("invisible") || reason.contains("control_char") ||
        reason.contains("rtlo") || reason.contains("private_ip") ||
        reason.contains("ip_url") || reason.contains("at_symbol") ||
        reason.contains("traversal") || reason.contains("port") ||
        reason.contains("scheme") || reason.contains("malformed");
  }
}
