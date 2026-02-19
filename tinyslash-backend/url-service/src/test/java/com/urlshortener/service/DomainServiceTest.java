package com.urlshortener.service;

import com.urlshortener.dto.DomainResponse;
import com.urlshortener.model.Domain;
import com.urlshortener.model.User;
import com.urlshortener.repository.DomainRepository;
import com.urlshortener.repository.DomainAuditLogRepository;
import com.urlshortener.repository.ReservedDomainRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.repository.TeamRepository;
import com.urlshortener.repository.DomainCooldownRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import java.time.LocalDateTime;
import org.springframework.data.redis.core.ValueOperations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("DomainService Tests")
class DomainServiceTest {

  @Mock
  private DomainRepository domainRepository;
  @Mock
  private ReservedDomainRepository reservedDomainRepository;
  @Mock
  private DomainAuditLogRepository domainAuditLogRepository;
  @Mock
  private UserRepository userRepository;
  @Mock
  private TeamRepository teamRepository;
  @Mock
  private DomainCooldownRepository domainCooldownRepository;
  @Mock
  private RedisTemplate<String, Object> redisTemplate;
  @Mock
  private ValueOperations<String, Object> valueOperations;
  @Mock
  private CloudflareSaasService cloudflareSaasService;
  @Mock
  private DomainVerificationWorker domainVerificationWorker;

  @InjectMocks
  private DomainService domainService;

  private User mockUser;
  private Domain mockDomain;

  @BeforeEach
  void setUp() {
    mockUser = new User();
    mockUser.setId("user-1");
    mockUser.setEmail("test@example.com");

    mockDomain = new Domain();
    mockDomain.setId("domain-1");
    mockDomain.setDomainName("custom.com");
    mockDomain.setOwnerId("user-1");
    mockDomain.setOwnerType("USER");
    mockDomain.setStatus("VERIFIED");
    mockDomain.setSslStatus("ACTIVE"); // Avoid Cloudflare SSL check branch
    // Set recent verification so triggerReactiveVerification() won't call the
    // worker
    mockDomain.setLastVerificationAttempt(LocalDateTime.now().minusHours(1));

    // Mock redis for methods that call blacklist/rate limit checks
    lenient().when(redisTemplate.opsForValue()).thenReturn(valueOperations);
    lenient().when(valueOperations.get(anyString())).thenReturn(null);
  }

  // ===== getDomainsByOwner =====

  @Test
  @DisplayName("getDomainsByOwner - should return empty list when user has no domains")
  void getDomainsByOwner_NoDomains_ShouldReturnEmpty() {
    when(domainRepository.findByOwnerIdAndOwnerType("user-1", "USER")).thenReturn(List.of());
    List<DomainResponse> result = domainService.getDomainsByOwner("user-1", "USER");
    assertNotNull(result);
    assertTrue(result.isEmpty());
  }

  @Test
  @DisplayName("getDomainsByOwner - should return DomainResponse for all owner domains")
  void getDomainsByOwner_WithDomains_ShouldReturnAll() {
    when(domainRepository.findByOwnerIdAndOwnerType("user-1", "USER")).thenReturn(List.of(mockDomain));
    List<DomainResponse> result = domainService.getDomainsByOwner("user-1", "USER");
    assertEquals(1, result.size());
    assertEquals("custom.com", result.get(0).getDomainName());
  }

  // ===== getDomainStatus =====

  @Test
  @DisplayName("getDomainStatus - should throw when domain not found")
  void getDomainStatus_NotFound_ShouldThrow() {
    when(domainRepository.findById("not-exist")).thenReturn(Optional.empty());
    assertThrows(Exception.class, () -> domainService.getDomainStatus("not-exist", "user-1"));
  }

  @Test
  @DisplayName("getDomainStatus - should throw when user is not the owner")
  void getDomainStatus_WrongUser_ShouldThrow() {
    when(domainRepository.findById("domain-1")).thenReturn(Optional.of(mockDomain));
    assertThrows(Exception.class, () -> domainService.getDomainStatus("domain-1", "other-user"));
  }

  @Test
  @DisplayName("getDomainStatus - should return DomainResponse for authorized owner")
  void getDomainStatus_ValidOwner_ShouldReturn() {
    // SSL status is ACTIVE so cloudflareSaasService.checkSslStatus() won't be
    // called
    when(domainRepository.findById("domain-1")).thenReturn(Optional.of(mockDomain));

    DomainResponse result = domainService.getDomainStatus("domain-1", "user-1");
    assertNotNull(result);
    assertEquals("VERIFIED", result.getStatus());
  }

  // ===== softDeleteDomain =====

  @Test
  @DisplayName("softDeleteDomain - should throw when user is not the domain owner")
  void softDeleteDomain_UnauthorizedUser_ShouldThrow() {
    when(domainRepository.findById("domain-1")).thenReturn(Optional.of(mockDomain));
    assertThrows(Exception.class, () -> domainService.softDeleteDomain("domain-1", "other-user"));
    verify(domainRepository, never()).save(any());
  }

  @Test
  @DisplayName("softDeleteDomain - authorized owner should trigger status change")
  void softDeleteDomain_AuthorizedUser_ShouldMarkDeleting() {
    when(domainRepository.findById("domain-1")).thenReturn(Optional.of(mockDomain));
    when(domainRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    lenient().when(domainAuditLogRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));
    lenient().when(domainCooldownRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    assertDoesNotThrow(() -> domainService.softDeleteDomain("domain-1", "user-1"));
    verify(domainRepository, atLeastOnce()).save(any(Domain.class));
  }

  // ===== getVerifiedDomains =====

  @Test
  @DisplayName("getVerifiedDomains - should call findVerifiedDomainsByOwner and return results")
  void getVerifiedDomains_ShouldReturnVerifiedDomains() {
    when(domainRepository.findVerifiedDomainsByOwner("user-1", "USER")).thenReturn(List.of(mockDomain));
    List<DomainResponse> result = domainService.getVerifiedDomains("user-1", "USER");
    assertEquals(1, result.size());
    assertEquals("VERIFIED", result.get(0).getStatus());
  }

  @Test
  @DisplayName("getVerifiedDomains - should return empty when no verified domains")
  void getVerifiedDomains_NoVerified_ShouldReturnEmpty() {
    when(domainRepository.findVerifiedDomainsByOwner("user-1", "USER")).thenReturn(List.of());
    List<DomainResponse> result = domainService.getVerifiedDomains("user-1", "USER");
    assertTrue(result.isEmpty());
  }
}
