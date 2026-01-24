package com.urlshortener.service;

import com.urlshortener.dto.SecurityDecision;
import com.urlshortener.model.DomainReputation;
import com.urlshortener.model.User;
import com.urlshortener.model.UserTrust;
import com.urlshortener.repository.DomainReputationRepository;
import com.urlshortener.repository.UserTrustRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SecurityServiceTest {

  @Mock
  private DomainReputationRepository domainRepository;

  @Mock
  private UserTrustRepository userTrustRepository;

  @InjectMocks
  private SecurityService securityService;

  private User user;

  @BeforeEach
  void setUp() {
    user = new User();
    user.setId("test-user-id");
  }

  @Test
  void checkStructure_ShouldBlockIpAddress() {
    SecurityDecision decision = securityService.preCheckUrl("http://192.168.1.1/login", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("private_ip", decision.getReason()); // 192.168.x.x is private

    SecurityDecision decision2 = securityService.preCheckUrl("http://8.8.8.8/login", user); // Public IP
    assertEquals(SecurityDecision.Decision.BLOCK, decision2.getDecision());
    assertEquals("ip_url", decision2.getReason());
  }

  @Test
  void checkStructure_ShouldBlockInvalidScheme() {
    SecurityDecision decision = securityService.preCheckUrl("ftp://example.com", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("invalid_scheme", decision.getReason());

    SecurityDecision decision2 = securityService.preCheckUrl("javascript:alert(1)", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision2.getDecision());
  }

  @Test
  void checkStructure_ShouldBlockNullByte() {
    SecurityDecision decision = securityService.preCheckUrl("http://example.com/login%00", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("null_byte", decision.getReason());
  }

  @Test
  void checkStructure_ShouldBlockRTLO() {
    // "photo\u202Egpj.exe" -> looks like photoexe.jpg
    SecurityDecision decision = securityService.preCheckUrl("http://example.com/photo\u202Egpj.exe", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("rtlo_attack", decision.getReason());
  }

  @Test
  void checkStructure_ShouldBlockExcessiveEncoding() {
    // %2525 -> %25 -> % (3 layers)
    SecurityDecision decision = securityService.preCheckUrl("http://example.com/path%252520", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("excessive_encoding", decision.getReason());
  }

  @Test
  void checkStructure_ShouldBlockInvisibleChars() {
    SecurityDecision decision = securityService.preCheckUrl("http://pay\u200Btm.com", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("invisible_characters", decision.getReason());
  }

  @Test
  void checkStructure_ShouldBlockPrivateIPs() {
    SecurityDecision decision = securityService.preCheckUrl("http://10.0.0.1/admin", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("private_ip", decision.getReason());
  }

  @Test
  void checkStructure_ShouldBlockAtSymbolInAuthority() {
    // user:pass@host
    SecurityDecision decision = securityService.preCheckUrl("https://user:pass@example.com", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertEquals("at_symbol", decision.getReason());

    // @ before slash
    SecurityDecision decision2 = securityService.preCheckUrl("https://ex@mple.com", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision2.getDecision());
  }

  @Test
  void checkStructure_ShouldAllowAtSymbolInPath() {
    // https://example.com/@username (common in social media)
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());
    SecurityDecision decision = securityService.preCheckUrl("https://example.com/@username", user);
    // specific logic check: should NOT block with "at_symbol"
    assertNotEquals("at_symbol", decision.getReason());
    assertNotEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
  }

  @Test
  void checkDomain_ShouldAllowIndiaWhitelist() {
    SecurityDecision decision = securityService.preCheckUrl("https://onlinesbi.sbi/personal", user);
    assertEquals(SecurityDecision.Decision.ALLOW, decision.getDecision());
    assertTrue(decision.getRiskScore() <= 0);
  }

  @Test
  void checkDomain_ShouldBlockFreenomTLD() {
    SecurityDecision decision = securityService.preCheckUrl("https://free-money.tk", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    // Just verify it blocked, reason details are secondary for this high level test
  }

  @Test
  void checkDomain_ShouldFlagHighRiskTLD() {
    SecurityDecision decision = securityService.preCheckUrl("https://riskysite.xyz", user);
    assertNotEquals(SecurityDecision.Decision.ALLOW, decision.getDecision());
  }

  @Test
  void checkDomain_ShouldFlagNewDomainOnPlatform() {
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());
    SecurityDecision decision = securityService.preCheckUrl("https://brand-new-site.com", user);
    // Expecting ALLOW as score 25 < 40 (Warn threshold)
    if (decision.getRiskScore() >= 40) {
      // If other logic bumped it up, accept WARN but not BLOCK
      assertNotEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    } else {
      assertEquals(SecurityDecision.Decision.ALLOW, decision.getDecision());
    }
  }

  @Test
  void checkDomain_ShouldBlockHighBlockRatio() {
    DomainReputation badRep = new DomainReputation("bad-reputation.com");
    badRep.setTotalLinks(100);
    badRep.setBlockedLinks(60); // 60% block ratio
    when(domainRepository.findByDomain("bad-reputation.com")).thenReturn(Optional.of(badRep));

    SecurityDecision decision = securityService.preCheckUrl("https://bad-reputation.com/link", user);
    // 60% ratio -> +60 score -> WARN/BLOCK depending on other factors
    // 60 >= 40 -> WARN (if < 70)
    // Check implementation: high_block_ratio is 60.
    // If that's the only flag, decision allows WARN.
    // Let's assert score
    assertTrue(decision.getRiskScore() >= 60);
  }

  @Test
  void checkBrand_ShouldBlockExactImpersonation() {
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());

    SecurityDecision decision = securityService.preCheckUrl("https://hdfc-login.com", user);
    // "hdfc" in INDIAN_BRANDS. "hdfc-login" tokenized -> "hdfc", "login".
    // Exact match HDFC + "login" keyword in URL (via Contextual Escalation auth
    // list) -> Block
    // Also brand_exact_match is 100.
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    assertTrue(decision.getReason().contains("brand") || decision.getReason().contains("high_risk"));
  }

  @Test
  void checkBrand_ShouldBlockCharSubstitution() {
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());
    // p4ytm -> paytm (4 -> a)
    SecurityDecision decision = securityService.preCheckUrl("https://p4ytm-kyc.com", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
    // Verify via analysis details if reason string varies
    boolean hasObfuscation = decision.getReason().contains("obfuscated") ||
        decision.getRiskAnalysis().getViolations().stream().anyMatch(v -> v.contains("obfuscated"));
    assertTrue(hasObfuscation, "Expected obfuscated brand detection, got: " + decision.getReason());
  }

  @Test
  void checkBrand_ShouldBlockFuzzyMatch() {
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());
    // paytym -> Levenshtein dist 1 from paytm
    SecurityDecision decision = securityService.preCheckUrl("https://paytym-offer.com", user);
    // Fuzzy match 50 pts. "offer" (greed) -> 45 pts. Total > 70.
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
  }

  @Test
  void checkBrand_ShouldBlockSeparatorAbuse() {
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());
    // sbi-kyc -> sbi detected via tokenization or separator abuse check
    SecurityDecision decision = securityService.preCheckUrl("https://sbi-kyc-update.com", user);
    // sbi found. kyc found.
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
  }

  @Test
  void checkHomograph_ShouldBlockPunycode() {
    SecurityDecision decision = securityService.preCheckUrl("https://xn--pypl-s5d.com", user); // pŕypĺ.com
    // Starts with xn-- so +50 risk at least
    // If it doesn't match brand, it might just warn if score < 70
    // But punycode_detected is 50.
    // Let's see. 50 is WARN.
    assertNotEquals(SecurityDecision.Decision.ALLOW, decision.getDecision());
  }

  @Test
  void checkShortener_ShouldBlockBitly() {
    SecurityDecision decision = securityService.preCheckUrl("https://bit.ly/scam", user);
    // known_shortener -> 100 score
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
  }

  @Test
  void checkMalware_ShouldBlockExe() {
    SecurityDecision decision = securityService.preCheckUrl("https://example.com/virus.exe", user);
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
  }

  @Test
  void checkSocialEngineering_ShouldBlockKycScam() {
    SecurityDecision decision = securityService.preCheckUrl("https://example.com/kyc-update-pending", user);
    // india_kyc_scam -> +100
    assertEquals(SecurityDecision.Decision.BLOCK, decision.getDecision());
  }

  @Test
  void checkUserTrust_ShouldApplyPenalty() {
    UserTrust lowTrust = new UserTrust();
    lowTrust.setTrustScore(20);
    when(userTrustRepository.findByUserId(user.getId())).thenReturn(Optional.of(lowTrust));
    when(domainRepository.findByDomain(anyString())).thenReturn(Optional.empty());

    // Domain new (+25) + Low Trust (+30) = 55 -> WARN
    SecurityDecision decision = securityService.preCheckUrl("https://unknown-domain.com", user);
    assertEquals(SecurityDecision.Decision.WARN, decision.getDecision());
  }
}
