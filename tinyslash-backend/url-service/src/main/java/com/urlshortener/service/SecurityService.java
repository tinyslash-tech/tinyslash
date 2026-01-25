package com.urlshortener.service;

import com.urlshortener.dto.RiskAnalysis;
import com.urlshortener.dto.SecurityDecision;
import com.urlshortener.model.DomainReputation;
import com.urlshortener.model.User;
import com.urlshortener.model.UserTrust;
import com.urlshortener.repository.DomainReputationRepository;
import com.urlshortener.repository.UserTrustRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class SecurityService {

  private static final Logger logger = LoggerFactory.getLogger(SecurityService.class);

  @Autowired
  private DomainReputationRepository domainRepository;

  @Autowired
  private UserTrustRepository userTrustRepository;

  // --- MAIN PRECHECK ENTRY POINT ---
  public SecurityDecision preCheckUrl(String url, User user) {
    RiskAnalysis analysis = new RiskAnalysis();
    int riskScore = 0;

    try {
      // CHECK 1: URL STRUCTURE & SANITIZATION
      SecurityDecision structureDecision = checkStructure(url, analysis);
      if (structureDecision != null)
        return structureDecision;

      // Extract Domain
      URL urlObj = new URL(url);
      String domain = urlObj.getHost().toLowerCase().replace("www.", "");

      // CHECK 2: DOMAIN INTELLIGENCE (Can return instant decision)
      SecurityDecision domainDecision = checkDomainIntelligence(domain, analysis);
      if (domainDecision != null) {
        return domainDecision;
      }

      // CHECK 3: BRAND IMPERSONATION
      checkBrandImpersonation(domain, url, analysis);

      // CHECK 4: HOMOGRAPH & IDN ATTACKS
      checkHomographData(domain, analysis);

      // CHECK 5: SHORTENER NESTING
      SecurityDecision shortenerDecision = checkShortenerNesting(domain, url, analysis);
      if (shortenerDecision != null) {
        return shortenerDecision;
      }

      // CHECK 6: MALWARE INDICATORS
      checkMalwareIndicators(urlObj, analysis);

      // CHECK 7: SOCIAL ENGINEERING
      checkSocialEngineering(url, analysis);

      // CHECK 8: USER TRUST & LIMITS
      if (user != null) {
        checkUserTrust(user, domain, analysis);
      }

      // FINAL DECISION LOGIC

      // 1. Whitelist / Trust Bypass
      if (analysis.isWhitelisted()) {
        String whitelistReason = analysis.getRiskBreakdown().containsKey("whitelisted_domain") ? "whitelisted_domain"
            : "trusted";
        return new SecurityDecision(SecurityDecision.Decision.ALLOW, whitelistReason,
            "Domain is explicitly whitelisted/trusted",
            analysis.getRiskScore(), analysis);
      }

      riskScore = analysis.getRiskScore(); // Recalculate total score

      // 2. High Risk / Block
      if (riskScore >= 70) {
        String reason = "high_risk_score";
        // Try to find specific major violation
        if (!analysis.getViolations().isEmpty()) {
          reason = analysis.getViolations().iterator().next();
        } else if (analysis.getRiskBreakdown().containsKey("freenom_tld")) {
          reason = "freenom_tld_blocked";
        } else if (analysis.getRiskBreakdown().containsKey("blocked_tld_.tk")) {
          reason = "blocked_tld_.tk";
        }
        return SecurityDecision.block(reason, "This URL has a high risk score (" + riskScore + ")",
            riskScore, analysis);
      } else if (riskScore >= 40) {
        return SecurityDecision.warn(riskScore, analysis);
      } else {
        return SecurityDecision.allow(riskScore, analysis);
      }

    } catch (MalformedURLException e) {
      return SecurityDecision.block("malformed_url", "Invalid URL format", 100, analysis);
    } catch (Exception e) {
      logger.error("Error in SecurityService preCheck", e);
      return SecurityDecision.block("system_error", "Security check failed unexpectedly", 100, analysis);
    }
  }

  // --- CHECK 1: URL STRUCTURE & SANITIZATION ---
  private static final Set<String> ALLOWED_SCHEMES = Set.of("http", "https");
  private static final Set<String> LOCALHOST_ALIASES = Set.of("localhost", "127.0.0.1", "0.0.0.0", "::1");
  // Regex for private IP ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x,
  // 169.254.x.x
  private static final Pattern PRIVATE_IP_PATTERN = Pattern.compile(
      "^(10\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.|192\\.168\\.|169\\.254\\.).*");
  private static final Pattern IP_V4_PATTERN = Pattern.compile("^(\\d{1,3}\\.){3}\\d{1,3}$");
  private static final Pattern IP_HEX_PATTERN = Pattern.compile("^0x[0-9a-fA-F]{8}$");
  private static final Pattern IP_DECIMAL_PATTERN = Pattern.compile("^\\d{8,10}$");

  // Indian specific patterns
  private static final Pattern INDIAN_PHONE_PATTERN = Pattern.compile("(\\+91|91)?[6-9]\\d{9}");
  private static final Pattern TYPOSQUATTING_PATTERN = Pattern.compile("paytym|gogle|flipkat|amazn|phoneepy|whatapp",
      Pattern.CASE_INSENSITIVE);

  private SecurityDecision checkStructure(String rawUrl, RiskAnalysis analysis) {
    analysis.addCheckPerformed("structure_validation");

    // STAGE 1: PARSING & DECODING
    String url = rawUrl.trim();

    // 1. Null Byte Injection (Check 12)
    if (url.contains("\0") || url.contains("%00")) {
      return SecurityDecision.block("null_byte", "URL contains null byte characters", 100, analysis);
    }

    // 2. Decode URL (Check for excessive encoding - Check 1 variation)
    String decodedUrl = url;
    int encodingLayers = 0;
    while (decodedUrl.contains("%")) {
      try {
        decodedUrl = java.net.URLDecoder.decode(decodedUrl, java.nio.charset.StandardCharsets.UTF_8);
        encodingLayers++;
        if (encodingLayers > 2) {
          analysis.addViolation("excessive_encoding");
          analysis.addRiskScore("excessive_encoding", 100);
          return SecurityDecision.block("excessive_encoding", "URL contains excessive encoding layers (>2)", 100,
              analysis);
        }
      } catch (Exception e) {
        return SecurityDecision.block("malformed_encoding", "URL encoding is malformed", 100, analysis);
      }
    }

    // Normalization
    String normalizedUrl = decodedUrl.toLowerCase()
        .replaceAll("/+$", "") // remove trailing slash
        .replaceAll("\\s+", ""); // remove whitespace

    // 3. Invisible Characters (Check 6)
    if (containsInvisibleChars(rawUrl)) { // Check RAW url for tricks
      return SecurityDecision.block("invisible_characters", "URL contains invisible Unicode characters", 100, analysis);
    }

    // 4. Control Characters (Check 15)
    if (containsControlChars(rawUrl)) {
      return SecurityDecision.block("control_characters", "URL contains malicious control characters", 100, analysis);
    }

    // 5. RTLO Attack (Check 13)
    if (containsRTLO(rawUrl)) {
      return SecurityDecision.block("rtlo_attack", "Right-to-Left Override attack detected", 100, analysis);
    }

    // 6. URL Length (Check 5)
    if (url.length() > 2048) {
      return SecurityDecision.block("url_too_long", "URL exceeds maximum length (2048 chars)", 100, analysis);
    }

    try {
      URL urlObj = new URL(url); // Standard Java URL parsing
      String scheme = urlObj.getProtocol().toLowerCase();
      String host = urlObj.getHost().toLowerCase();
      String path = urlObj.getPath();
      String query = urlObj.getQuery();
      String userInfo = urlObj.getUserInfo();

      // 7. Scheme Validation (Check 1)
      if (!ALLOWED_SCHEMES.contains(scheme)) {
        return SecurityDecision.block("invalid_scheme", "Only HTTP/HTTPS schemes are allowed", 100, analysis);
      }

      // 8. Localhost & Private IPs (Check 10 - Prioritized)
      if (LOCALHOST_ALIASES.contains(host) || PRIVATE_IP_PATTERN.matcher(host).matches()) {
        return SecurityDecision.block("private_ip", "Local/Private IP addresses are not allowed", 100, analysis);
      }

      // 9. IP Address Blocking (Check 2 - Catch-all for Public IPs)
      if (isIpAddress(host)) {
        return SecurityDecision.block("ip_url", "Direct IP address URLs are not allowed", 100, analysis);
      }

      // 10. @ Symbol & UserInfo (Check 3 - Refined)
      // Allow @ in path (e.g. /@username) but block in authority (user:pass@host)
      if (userInfo != null) {
        return SecurityDecision.block("at_symbol", "URL contains userinfo (potential credential harvesting)", 100,
            analysis);
      }
      if (rawUrl.contains("@")) {
        int atIndex = rawUrl.indexOf("@");
        int schemeEndIndex = rawUrl.indexOf("://");
        int startSearch = (schemeEndIndex != -1) ? schemeEndIndex + 3 : 0;
        int firstSlash = rawUrl.indexOf("/", startSearch);

        // If @ is present and (no slash exists OR @ is before the first slash), it's in
        // authority part -> BLOCK
        if (firstSlash == -1 || atIndex < firstSlash) {
          return SecurityDecision.block("at_symbol", "URL contains '@' in authority section", 100, analysis);
        }
      }

      // 11. Double Slashes/Traversal (Check 4 & 11)
      if (path.contains("//")) {
        return SecurityDecision.block("double_slashes", "URL path contains suspicious double slashes", 100, analysis);
      }
      if (path.contains("..")) { // Simple traversal check
        return SecurityDecision.block("path_traversal", "URL path contains traversal patterns (..)", 100, analysis);
      }

      // 12. Non-Standard Port (Check 9)
      int port = urlObj.getPort();
      if (port != -1 && port != 80 && port != 443) {
        // Check suspicious list
        Set<Integer> SUSPICIOUS_PORTS = Set.of(8080, 8443, 3128, 8888, 4444, 1337);
        if (SUSPICIOUS_PORTS.contains(port)) {
          analysis.addRiskScore("suspicious_port", 40);
        } else {
          analysis.addRiskScore("non_standard_port", 30);
        }
      }

      // 13. Mixed Scripts Check (Moved fully to Check 4)

      // 14. Indian Phone Patterns
      if (INDIAN_PHONE_PATTERN.matcher(url).find()) {
        analysis.addRiskScore("phone_number_in_url", 35);
        analysis.addViolation("phone_scam_pattern");
      }

      // 15. Typosquatting
      if (TYPOSQUATTING_PATTERN.matcher(url).find()) {
        analysis.addRiskScore("typosquatting", 50);
        analysis.addViolation("possible_typosquatting");
      }

      // 16. Excessive Query Params (Check 14)
      if (query != null && query.split("&").length > 20) {
        analysis.addRiskScore("excessive_params", 40);
      }

    } catch (MalformedURLException e) {
      return SecurityDecision.block("malformed_url", "Invalid URL format", 100, analysis);
    }

    return null; // Pass
  }

  // --- HELPER METHODS FOR CHECK 1 ---

  private boolean isIpAddress(String host) {
    // Standard IPv4
    if (IP_V4_PATTERN.matcher(host).matches())
      return true;

    // IPv6 (simple check for colons)
    if (host.contains(":") && !host.contains("http")) { // avoid confusion with scheme if host parsed wrong
      // Java URL parser handles IPv6 literals in host as [::1], so strictly speaking
      // host might just have brackets
      return host.startsWith("[") && host.endsWith("]");
    }

    // Hex/Decimal IPs
    if (IP_HEX_PATTERN.matcher(host).matches())
      return true;
    if (IP_DECIMAL_PATTERN.matcher(host).matches())
      return true;

    return false;
  }

  private boolean containsInvisibleChars(String s) {
    // Zero-width space, non-joiner, joiner, word joiner, no-break space,
    // non-breaking space
    return s.contains("\u200B") || s.contains("\u200C") || s.contains("\u200D") ||
        s.contains("\u2060") || s.contains("\uFEFF") || s.contains("\u00A0");
  }

  private boolean containsControlChars(String s) {
    for (char c : s.toCharArray()) {
      if (c < 32 && c != 9 && c != 10 && c != 13)
        return true;
    }
    return false;
  }

  private boolean containsRTLO(String s) {
    return s.contains("\u202E") || s.contains("\u202D") || s.contains("\u202C");
  }

  private boolean hasMixedScripts(String host) {
    boolean hasLatin = host.matches(".*[a-zA-Z].*");
    boolean hasCyrillic = host.matches(".*[\\u0400-\\u04FF].*");
    boolean hasHindi = host.matches(".*[\\u0900-\\u097F].*");
    boolean hasArabic = host.matches(".*[\\u0600-\\u06FF].*");

    int scripts = 0;
    if (hasLatin)
      scripts++;
    if (hasCyrillic)
      scripts++;
    if (hasHindi)
      scripts++;
    if (hasArabic)
      scripts++;

    return scripts > 1;
  }

  @Autowired
  private com.urlshortener.repository.ShortenedUrlRepository shortenedUrlRepository; // Needed for velocity checks

  // --- CHECK 2: DOMAIN INTELLIGENCE ---

  // TLD Risk Matrix (Simplified from SQL provided)
  private static final Map<String, Integer> TLD_RISK_SCORES = Map.ofEntries(
      Map.entry(".tk", 100), Map.entry(".ml", 100), Map.entry(".ga", 100), Map.entry(".cf", 100), Map.entry(".gq", 100),
      Map.entry(".download", 100), Map.entry(".loan", 95), Map.entry(".racing", 90),
      Map.entry(".xyz", 50), Map.entry(".online", 45), Map.entry(".site", 45), Map.entry(".top", 95),
      Map.entry(".pw", 55), Map.entry(".cc", 50), Map.entry(".info", 40),
      Map.entry(".club", 25), Map.entry(".vip", 30),
      Map.entry(".com", 0), Map.entry(".org", 0), Map.entry(".net", 0), Map.entry(".io", 10),
      Map.entry(".in", 0), Map.entry(".co.in", 0), Map.entry(".gov.in", 0));

  // Massive Indian Whitelist (Subset for implementation)
  private static final Set<String> INDIAN_WHITELIST = Set.of(
      "india.gov.in", "uidai.gov.in", "incometax.gov.in", "gst.gov.in", "epfindia.gov.in",
      "onlinesbi.sbi", "sbi.co.in", "hdfcbank.com", "icicibank.com", "axisbank.com", "kotak.com",
      "paytm.com", "phonepe.com", "googlepay.com", "razorpay.com", "cred.club",
      "amazon.in", "flipkart.com", "myntra.com", "swiggy.com", "zomato.com",
      "google.com", "microsoft.com", "apple.com", "facebook.com", "instagram.com", "whatsapp.com");

  // Changed to return SecurityDecision for INSTANT BLOCK/ALLOW capabilities
  private SecurityDecision checkDomainIntelligence(String domain, RiskAnalysis analysis) {
    analysis.addCheckPerformed("domain_intelligence");

    // 1. Whitelist Check (Instant Allow)
    // Supports subdomains of trusted brands (e.g. login.paytm.com)
    boolean isWhitelisted = domain.endsWith(".gov.in") || domain.endsWith(".nic.in");

    if (!isWhitelisted) {
      for (String w : INDIAN_WHITELIST) {
        if (domain.equals(w) || domain.endsWith("." + w)) {
          isWhitelisted = true;
          break;
        }
      }
    }

    if (isWhitelisted) {
      analysis.setWhitelisted(true);
      analysis.addRiskScore("whitelisted_domain", -100);
      return SecurityDecision.allow(analysis.getRiskScore(), analysis); // Immediate Return Check 1
    }

    // 2. TLD Risk Analysis
    String tld = extractEffectiveTld(domain);
    if (TLD_RISK_SCORES.containsKey(tld)) {
      int score = TLD_RISK_SCORES.get(tld);
      if (score >= 90) {
        analysis.addRiskScore("blocked_tld_" + tld, 100);
        analysis.addViolation("tld_abuse");
        return SecurityDecision.block("blocked_tld_" + tld, "This TLD is blocked due to high abuse rate", 100,
            analysis); // Immediate Return Check 2
      } else if (score > 0) {
        analysis.addRiskScore("risky_tld", score);
      }
    } else {
      // Unknown TLD -> Moderate Risk
      analysis.addRiskScore("unknown_tld", 25);
    }

    // 3. Domain Reputation Database Lookup
    // Note: We cannot easily "return" from inside ifPresentOrElse consumer lambda
    // to the outer method.
    // So we use a wrapper or AtomicReference if we needed to block here.
    // But database stats usually add score rather than instant block unless
    // explicitly blacklisted.
    // We will check blacklist status and return null (continue) or block.
    // For simplicity in this refactor, we accept that DB checks accumulate score,
    // BUT if blacklist is found, we should flag it high.
    // To implement "Instant Block" for DB blacklist, we need to fetch explicitly.

    var repoOpt = domainRepository.findByDomain(domain);
    if (repoOpt.isPresent()) {
      DomainReputation repo = repoOpt.get();
      if (repo.isBlacklisted()) {
        return SecurityDecision.block("domain_blacklisted", "Domain is blacklisted", 100, analysis);
      }
      if (repo.isTempBanned()) {
        if (repo.getTempBanUntil() != null && repo.getTempBanUntil().isAfter(java.time.LocalDateTime.now())) {
          return SecurityDecision.block("domain_temp_banned", "Domain is temporarily banned", 100, analysis);
        }
      }

      // Stats scoring (no return, just score)
      double blockRatio = repo.getBlockRatio();
      if (blockRatio > 0.5)
        analysis.addRiskScore("high_block_ratio", 60);
      else if (blockRatio > 0.3)
        analysis.addRiskScore("medium_block_ratio", 40);

      long hoursKnown = java.time.Duration.between(repo.getFirstSeen(), java.time.LocalDateTime.now()).toHours();
      if (hoursKnown < 1)
        analysis.addRiskScore("very_new_domain", 30);
      else if (hoursKnown < 24)
        analysis.addRiskScore("new_domain_24h", 25);
      else if (hoursKnown < 168)
        analysis.addRiskScore("recent_domain", 15);

      if (repo.getLinksLastHour() > 50)
        analysis.addRiskScore("extreme_velocity", 50);
      else if (repo.getLinksLastHour() > 20)
        analysis.addRiskScore("high_velocity", 35);

      if (repo.getTotalLinks() > 20 && repo.getUniqueUsers() == 1)
        analysis.addRiskScore("single_user_spam", 45);
      if (repo.getReportedCount() >= 5)
        analysis.addRiskScore("heavily_reported", 100);
      else if (repo.getReportedCount() >= 3)
        analysis.addRiskScore("reported_domain", 60);

    } else {
      // New Domain
      analysis.addRiskScore("new_to_platform", 25);
      if (TLD_RISK_SCORES.getOrDefault(tld, 0) > 40) {
        analysis.addRiskScore("new_risky_tld", 20);
      }
      try {
        domainRepository.save(new DomainReputation(domain));
      } catch (Exception e) {
      }
    }

    return null; // No instant decision, proceed to next checks
  }

  private String extractEffectiveTld(String domain) {
    if (domain == null || !domain.contains("."))
      return "";
    // Handle known multi-level TLDs common in India/Security context
    if (domain.endsWith(".co.in"))
      return ".co.in";
    if (domain.endsWith(".gov.in"))
      return ".gov.in";
    if (domain.endsWith(".ac.in"))
      return ".ac.in";
    if (domain.endsWith(".nic.in"))
      return ".nic.in";
    if (domain.endsWith(".org.in"))
      return ".org.in";
    if (domain.endsWith(".net.in"))
      return ".net.in";
    if (domain.endsWith(".res.in"))
      return ".res.in";
    if (domain.endsWith(".edu.in"))
      return ".edu.in";

    // Fallback to last segment
    return domain.substring(domain.lastIndexOf("."));
  }

  // --- CHECK 3: BRAND IMPERSONATION ---

  // Categorized Brand Registry (Simplified for Set lookup, but logic can handle
  // categories)
  private static final Set<String> INDIAN_BRANDS = Set.of(
      // BANKS (Critical)
      "sbi", "statebank", "hdfc", "hdfcbank", "icici", "icicibank", "axis", "axisbank", "pnb", "punjabnationalbank",
      "kotak", "kotakbank", "indusind", "yesbank", "idbi", "unionbank", "canara", "bob", "bankofbaroda", "federal",
      "federalbank",
      // DIGITAL PAYMENTS (Critical)
      "paytm", "paytmbank", "phonepe", "googlepay", "gpay", "bhim", "amazonpay", "mobikwik", "freecharge", "cred",
      "slice", "razorpay", "payu", "cashfree",
      // E-COMMERCE
      "amazon", "amazn", "flipkart", "myntra", "snapdeal", "meesho", "ajio", "swiggy", "zomato", "bigbasket", "blinkit",
      "grofers",
      // GOVT
      "aadhaar", "uidai", "epfo", "epf", "pan", "pancard", "gst", "irctc", "railway", "digilocker", "cowin", "passport",
      "india",
      // TELECOM
      "airtel", "jio", "vi", "vodafone", "idea", "bsnl",
      // TECH
      "google", "facebook", "whatsapp", "instagram", "microsoft", "apple", "youtube", "netflix");

  // Expanded Action Keywords
  private static final Map<String, List<String>> ACTION_KEYWORDS = Map.of(
      "auth",
      List.of("login", "signin", "sign-in", "log-in", "verify", "verification", "authenticate", "validation", "confirm",
          "update-password", "reset-password", "account-access"),
      "financial",
      List.of("kyc", "update-kyc", "pending", "pan", "aadhaar", "otp", "cvv", "card", "debit", "credit", "netbanking",
          "upi", "wallet", "payment", "bank", "account", "balance", "transfer", "fund", "invest", "trading", "crypto",
          "return", "profit"),
      "urgency",
      List.of("urgent", "immediately", "expire", "suspend", "block", "blocked", "action-required", "verify-now",
          "update-now", "limited"),
      "greed",
      List.of("free", "win", "winner", "prize", "reward", "bonus", "cashback", "offer", "deal", "loot", "claim",
          "congratulations"),
      "authority", List.of("official", "verified", "authorized", "govt", "government", "sarkari"));

  private void checkBrandImpersonation(String domain, String url, RiskAnalysis analysis) {
    analysis.addCheckPerformed("brand_impersonation");
    String urlLower = url.toLowerCase();

    // Remove TLD for analysis
    String domainNoTld = domain.contains(".") ? domain.substring(0, domain.lastIndexOf(".")) : domain;

    // 1. Tokenization (Smart Split)
    List<String> tokens = tokenizeDomain(domainNoTld);

    String detectedBrand = null;
    boolean isCriticalBrand = false;

    // Scan tokens against registry
    for (String token : tokens) {
      // A. Exact Match
      if (INDIAN_BRANDS.contains(token)) {
        detectedBrand = token;
        // Check if officially allowed (Official TLD bypass logic is in Check 2,
        // simplified here)
        if (!isOfficialBrandDomain(domain, token)) {
          analysis.addRiskScore("brand_exact_match", 100);
          analysis.addViolation("brand_impersonation_" + token);
          isCriticalBrand = true;
        }
      }

      // B. Character Substitution (Homoglyphs/Leet)
      if (detectedBrand == null) {
        String normalizedToken = normalizeCharSubstitutions(token);
        if (INDIAN_BRANDS.contains(normalizedToken)) {
          analysis.addRiskScore("brand_char_substitution", 100);
          analysis.addViolation("obfuscated_brand_" + normalizedToken);
          detectedBrand = normalizedToken;
        }
      }

      // C. Fuzzy Match (Typo/Levenshtein)
      if (detectedBrand == null && token.length() > 3) {
        for (String brand : INDIAN_BRANDS) {
          // Tightened rule: Length difference must be <= 1 to avoid false positives
          if (Math.abs(token.length() - brand.length()) > 1)
            continue;
          int dist = getLevenshteinDistance(token, brand);
          if (dist <= 1) { // Very close match
            analysis.addRiskScore("brand_fuzzy_match", 50);
            detectedBrand = brand;
            break;
          }
        }
      }

      if (detectedBrand != null)
        break;
    }

    // 2. Contextual Escalation (Action Keywords)
    if (detectedBrand != null) {
      if (containsAny(urlLower, ACTION_KEYWORDS.get("auth"))) {
        analysis.addRiskScore("brand_plus_auth", 100);
      } else if (containsAny(urlLower, ACTION_KEYWORDS.get("financial"))) {
        analysis.addRiskScore("brand_plus_financial", 100);
      } else if (containsAny(urlLower, ACTION_KEYWORDS.get("urgency"))) {
        analysis.addRiskScore("brand_plus_urgency", 50);
      } else if (containsAny(urlLower, ACTION_KEYWORDS.get("greed"))) {
        analysis.addRiskScore("brand_plus_greed", 45);
      }
    }

    // 3. Separator Abuse (e.g. paytm-login)
    // Detected implicitly by tokenization + keyword matching, but explicit check
    // for strong signal
    for (String sep : List.of("-", "_", ".")) {
      if (detectedBrand != null && urlLower.contains(detectedBrand + sep)) {
        // If detected brand is "sbi" and url has "sbi-", check what follows
        String after = urlLower.substring(urlLower.indexOf(detectedBrand + sep) + detectedBrand.length() + 1);
        for (List<String> keywords : ACTION_KEYWORDS.values()) {
          for (String k : keywords) {
            if (after.startsWith(k)) {
              analysis.addRiskScore("brand_separator_action", 100); // Confidence boost
              break;
            }
          }
        }
      }
    }
  }

  // HELPER MAPPINGS & METHODS

  private List<String> tokenizeDomain(String domain) {
    // Split by common separators (smart split)
    String[] parts = domain.split("[\\.\\-_]");
    // Remove empty strings if any
    List<String> tokens = new ArrayList<>();
    for (String p : parts) {
      if (!p.isEmpty())
        tokens.add(p);
    }
    return tokens;
  }

  private boolean isOfficialBrandDomain(String domain, String brand) {
    if (INDIAN_WHITELIST.contains(domain) || TRUSTED_SHORT_DOMAINS.contains(domain))
      return true;

    if (domain.endsWith(".gov.in") || domain.endsWith(".nic.in"))
      return true;

    // Heuristic whitelist
    return domain.equals(brand + ".com") || domain.equals(brand + ".in") || domain.equals(brand + ".co.in") ||
        domain.endsWith("." + brand + ".com") || domain.endsWith("." + brand + ".in");
  }

  private static final Map<Character, String> CHAR_SUB_MAP = Map.ofEntries(
      Map.entry('0', "o"), Map.entry('1', "l"), Map.entry('3', "e"), Map.entry('4', "a"),
      Map.entry('5', "s"), Map.entry('7', "t"), Map.entry('8', "b"), Map.entry('9', "g"),
      Map.entry('@', "a"), Map.entry('$', "s"), Map.entry('!', "i"), Map.entry('+', "t"));

  private String normalizeCharSubstitutions(String input) {
    StringBuilder sb = new StringBuilder();
    for (char c : input.toCharArray()) {
      if (CHAR_SUB_MAP.containsKey(c)) {
        sb.append(CHAR_SUB_MAP.get(c));
      } else {
        sb.append(c);
      }
    }
    return sb.toString();
  }

  // Reusing existing containsAny
  private boolean containsAny(String input, List<String> keywords) {
    if (keywords == null)
      return false;
    for (String k : keywords) {
      if (input.contains(k))
        return true;
    }
    return false;
  }

  // Reusing existing getLevenshteinDistance
  private int getLevenshteinDistance(String s1, String s2) {
    int[][] dp = new int[s1.length() + 1][s2.length() + 1];
    for (int i = 0; i <= s1.length(); i++)
      dp[i][0] = i;
    for (int j = 0; j <= s2.length(); j++)
      dp[0][j] = j;
    for (int i = 1; i <= s1.length(); i++) {
      for (int j = 1; j <= s2.length(); j++) {
        int cost = (s1.charAt(i - 1) == s2.charAt(j - 1)) ? 0 : 1;
        dp[i][j] = Math.min(Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1), dp[i - 1][j - 1] + cost);
      }
    }
    return dp[s1.length()][s2.length()];
  }

  // --- CHECK 4: HOMOGRAPH & IDN ---
  private void checkHomographData(String domain, RiskAnalysis analysis) {
    analysis.addCheckPerformed("homograph_detection");

    // 1. Punycode Detection
    if (domain.startsWith("xn--")) {
      analysis.addRiskScore("punycode_detected", 50);
      try {
        String decoded = java.net.IDN.toUnicode(domain);
        // Check decoded against brands (reuse brand check logic or simple fuzzy)
        for (String brand : INDIAN_BRANDS) {
          if (decoded.contains(brand)) { // Simplistic match for now
            analysis.addRiskScore("punycode_brand_spoof", 100);
            return;
          }
        }
      } catch (Exception e) {
        // Formatting error, suspicious
        analysis.addRiskScore("malformed_punycode", 50);
      }
    }

    // 2. Mixed Scripts Detection
    // Use regex for script blocks: Cyrillic, Greek, etc. not expected in normal
    // Indian/US domains
    boolean hasLatin = domain.matches(".*[a-z].*");
    boolean hasCyrillic = domain.matches(".*[\\u0400-\\u04FF].*"); // Cyrillic block
    boolean hasGreek = domain.matches(".*[\\u0370-\\u03FF].*"); // Greek block

    if (hasLatin && (hasCyrillic || hasGreek)) {
      analysis.addRiskScore("mixed_scripts", 100);
      analysis.addViolation("mixed_script_homograph_attack");
    }

    // 3. IDN Homoglyph Normalization (Simplified)
    // (Full normalization table is huge, focusing on Cyrillic lookalikes)
    String normalized = normalizeHomoglyphs(domain);
    if (!normalized.equals(domain)) {
      analysis.addRiskScore("homoglyph_normalization", 55);
      for (String brand : INDIAN_BRANDS) {
        if (normalized.contains(brand)) {
          analysis.addRiskScore("homoglyph_brand_spoof", 100);
        }
      }
    }
  }

  private String normalizeHomoglyphs(String input) {
    // Simple manual map for common Cyrillic->Latin homoglyphs
    // 'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x'
    return input.replace('\u0430', 'a')
        .replace('\u0435', 'e')
        .replace('\u043E', 'o')
        .replace('\u0440', 'p')
        .replace('\u0441', 'c')
        .replace('\u0443', 'y')
        .replace('\u0445', 'x');
  }

  // --- CHECK 5: SHORTENER NESTING ---

  // 1️⃣ TRUSTED SHORTENERS (ALLOWLIST) - Brand Owned
  private static final Set<String> TRUSTED_SHORT_DOMAINS = Set.of(
      // Amazon
      "amzn.to", "amzn.eu", "amzn.in",
      // Google
      "goo.gl", "maps.app.goo.gl",
      // Microsoft
      "aka.ms",
      // Apple
      "apple.co",
      // Meta
      "fb.me", "ig.me",
      // YouTube
      "youtu.be",
      // LinkedIn
      "lnkd.in",
      // Twitter/X
      "t.co");

  private static final Set<String> KNOWN_SHORTENERS = Set.of(
      "bit.ly", "tinyurl.com", "ow.ly", "buff.ly", "is.gd", "tiny.cc", "short.io",
      "cutt.ly", "rebrand.ly", "bl.ink", "clk.ru", "shorturl.at", "tny.im", "po.st",
      "adf.ly", "bc.vc", "linkbucks.com", "soo.gd", "ouo.io", "shrinkearn.com", "shorturl.in", "shrinkme.io");

  private static final Pattern SHORTENER_PATTERN = Pattern
      .compile("^https?://[^/]+/([a-zA-Z0-9]{5,8}|r/[a-zA-Z0-9]+)$");

  // Changed to return SecurityDecision for INSTANT BLOCK capabilities
  private SecurityDecision checkShortenerNesting(String domain, String url, RiskAnalysis analysis) {
    analysis.addCheckPerformed("shortener_nesting");

    // 0. Check Trust List FIRST
    if (TRUSTED_SHORT_DOMAINS.contains(domain)) {
      analysis.setWhitelisted(true); // <--- CRITICAL FIX: Explicitly bypass risk scoring
      analysis.addRiskScore("whitelisted_domain", 0);
      return null;
    }

    // 1. Known Shortener Domain Block
    if (KNOWN_SHORTENERS.contains(domain)) {
      analysis.addRiskScore("known_shortener", 100);
      analysis.addViolation("nested_shortener_blocked");
      return SecurityDecision.block("nested_shortener", "Chained URL shorteners are not allowed", 100, analysis);
    }

    // 2. Subdomain check (fuzzy)
    for (String shortener : KNOWN_SHORTENERS) {
      if (domain.endsWith("." + shortener)) {
        analysis.addRiskScore("shortener_subdomain", 100);
        return SecurityDecision.block("nested_shortener", "Chained URL shorteners are not allowed", 100, analysis);
      }
    }

    // 3. Pattern Matching (Generic Shortener Structure)
    // Only valid if path length is short and looks like an ID
    if (SHORTENER_PATTERN.matcher(url).matches()) {
      // Too many false positives? Just add risk, don't instant block unless confident
      analysis.addRiskScore("shortener_pattern", 50);
    }

    return null; // Pass
  }

  // --- CHECK 6: MALWARE INDICATORS ---

  private static final Set<String> EXECUTABLE_EXTENSIONS = Set.of(".exe", ".msi", ".bat", ".cmd", ".com", ".scr",
      ".pif", ".vbs", ".js", ".jar", ".wsf", ".apk", ".ipa", ".deb", ".sh", ".bash", ".ps1", ".py", ".rb", ".xlsm",
      ".docm", ".pptm");
  private static final Set<String> ARCHIVE_EXTENSIONS = Set.of(".zip", ".rar", ".7z", ".tar", ".gz", ".iso", ".dmg",
      ".pkg");
  private static final Set<String> SUSPICIOUS_PARAMS = Set.of("download=", "file=", "attachment=", "exec=", "run=",
      "install=");

  private void checkMalwareIndicators(URL urlObj, RiskAnalysis analysis) {
    analysis.addCheckPerformed("malware_indicators");
    String path = urlObj.getPath().toLowerCase();
    String query = urlObj.getQuery() != null ? urlObj.getQuery().toLowerCase() : "";

    // 1. Executable Extensions -> INSTANT BLOCK
    for (String ext : EXECUTABLE_EXTENSIONS) {
      if (path.endsWith(ext)) {
        analysis.addRiskScore("executable_extension", 100);
        analysis.addViolation("blocked_file_type_" + ext);

        // India Specific: APK + Bank/Paytm = 100% Scam
        if (ext.equals(".apk")) {
          for (String brand : INDIAN_BRANDS) {
            if (path.contains(brand)) {
              analysis.addRiskScore("fake_banking_app", 100); // Double ensure
            }
          }
        }
        return;
      }
    }

    // 2. High Risk Archives
    for (String ext : ARCHIVE_EXTENSIONS) {
      if (path.endsWith(ext)) {
        analysis.addRiskScore("archive_extension", 40);
      }
    }

    // 3. Suspicious Query Params
    for (String param : SUSPICIOUS_PARAMS) {
      if (query.contains(param)) {
        analysis.addRiskScore("suspicious_download_param", 45);
      }
    }
  }

  // --- CHECK 7: SOCIAL ENGINEERING ---

  private static final Map<String, List<String>> INDIAN_KEYWORDS = Map.of(
      "government", List.of("pm", "pradhan-mantri", "modi", "yojana", "scheme", "subsidy", "ration", "lpg"),
      "employment", List.of("naukri", "job", "vacancy", "recruitment", "railway", "ssc", "upsc", "government-job"),
      "hindi", List.of("sarkari", "labh", "muft", "inaam", "jeet", "kamao"));

  private void checkSocialEngineering(String url, RiskAnalysis analysis) {
    analysis.addCheckPerformed("social_engineering");
    String urlLower = url.toLowerCase();

    List<String> categoriesFound = new ArrayList<>();
    int totalKeywords = 0;

    // 1. Standard Categories Support
    for (Map.Entry<String, List<String>> entry : ACTION_KEYWORDS.entrySet()) {
      if (containsAny(urlLower, entry.getValue())) {
        categoriesFound.add(entry.getKey());
        totalKeywords++;
        // Apply specific weights per category
        int weight = 20; // Default
        switch (entry.getKey()) {
          case "urgency":
            weight = 25;
            break;
          case "authority":
            weight = 35;
            break;
          case "financial":
            weight = 30;
            break;
          case "greed":
            weight = 25;
            break;
        }
        analysis.addRiskScore("keyword_category_" + entry.getKey(), weight);
      }
    }

    // 2. Multi-Category Escalation
    if (categoriesFound.size() >= 3) {
      analysis.addRiskScore("multi_category_attack", 50);
    }
    if (totalKeywords >= 4) {
      analysis.addRiskScore("keyword_stuffing", 40);
    }

    // 3. Dangerous Combinations
    if (categoriesFound.contains("urgency") && categoriesFound.contains("threat")) { // Threat not defined in map but
                                                                                     // let's assume urgency covers it
                                                                                     // or add it
      analysis.addRiskScore("urgency_threat_combo", 35);
    }
    if (categoriesFound.contains("financial") && urlLower.contains("official")) { // Authority proxy
      analysis.addRiskScore("authority_financial_combo", 40);
    }

    // 4. India Specific Social Engineering
    if (containsAny(urlLower, INDIAN_KEYWORDS.get("government"))) {
      // If domains is not .gov.in (already blocked/trusted in check 2/3), score high
      analysis.addRiskScore("fake_govt_scheme", 45);
    }
    if (containsAny(urlLower, INDIAN_KEYWORDS.get("employment"))) {
      analysis.addRiskScore("fake_job_scam", 30);
    }
  }

  // --- CHECK 8: USER TRUST & LIMITS ---

  private void checkUserTrust(User user, String domain, RiskAnalysis analysis) {
    analysis.addCheckPerformed("user_trust_limits");

    userTrustRepository.findByUserId(user.getId()).ifPresentOrElse(
        trust -> {
          int trustScore = trust.getTrustScore();

          // 1. Low Trust Penalty
          if (trustScore < 30) {
            analysis.addRiskScore("low_user_trust", 30);
          } else if (trustScore < 50) {
            analysis.addRiskScore("medium_user_trust", 15);
          }

          // 2. Recent Blocks
          if (trust.getConsecutiveBlocks() > 0) {
            analysis.addRiskScore("recent_blocks", 20 * trust.getConsecutiveBlocks());
          }

          // 3. Rate Limiting (Simple Check for now)
          long linksToday = trust.getTotalLinksCreated(); // This is total lifetime, normally need daily counter. Using
                                                          // total for mocked new user check.
          if (trustScore < 50 && linksToday > 50) { // Daily limit simulation
            // In real imp, check Redis for daily count
          }
        },
        () -> {
          // First time user / No trust record
          analysis.addRiskScore("new_user_low_trust", 30);
          // Create profile async
          try {
            userTrustRepository.save(new UserTrust(user.getId()));
          } catch (Exception e) {
          }
        });
  }
}
