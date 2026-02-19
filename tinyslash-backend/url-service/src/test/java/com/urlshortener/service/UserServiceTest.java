package com.urlshortener.service;

import com.urlshortener.model.User;
import com.urlshortener.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserService Tests")
class UserServiceTest {

  @Mock
  private UserRepository userRepository;
  @Mock
  private PasswordEncoder passwordEncoder;

  @InjectMocks
  private UserService userService;

  private User mockUser;

  @BeforeEach
  void setUp() {
    mockUser = new User();
    mockUser.setId("user-1");
    mockUser.setEmail("test@example.com");
    mockUser.setPassword("hashed-password");
    mockUser.setFirstName("John");
    mockUser.setLastName("Doe");
    mockUser.setActive(true);
  }

  // ===== registerUser =====

  @Test
  @DisplayName("registerUser - should throw when email already exists")
  void registerUser_DuplicateEmail_ShouldThrow() {
    when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
    assertThrows(RuntimeException.class, () -> userService.registerUser("test@example.com", "password", "John", "Doe"));
    verify(userRepository, never()).save(any());
  }

  @Test
  @DisplayName("registerUser - should create user with ROLE_USER on success")
  void registerUser_NewUser_ShouldSaveWithRole() {
    when(userRepository.existsByEmail(anyString())).thenReturn(false);
    when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

    User result = userService.registerUser("new@example.com", "password", "Jane", "Doe");

    assertNotNull(result);
    assertEquals("new@example.com", result.getEmail());
    assertTrue(result.getRoles().contains("ROLE_USER"));
    verify(userRepository, times(1)).save(any(User.class));
  }

  @Test
  @DisplayName("registerUser - should generate API key on registration")
  void registerUser_ShouldGenerateApiKey() {
    when(userRepository.existsByEmail(anyString())).thenReturn(false);
    when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

    User result = userService.registerUser("new@example.com", "secure123", "Jane", "Doe");

    assertNotNull(result.getApiKey());
    assertTrue(result.getApiKey().startsWith("pk_"));
  }

  // ===== loginUser =====

  @Test
  @DisplayName("loginUser - should throw when user not found")
  void loginUser_UserNotFound_ShouldThrow() {
    when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> userService.loginUser("unknown@test.com", "password"));
  }

  @Test
  @DisplayName("loginUser - should throw on wrong password")
  void loginUser_WrongPassword_ShouldThrow() {
    mockUser.setPassword("e9877a28ad7c5b5f5f49f0d4b59f8484abc55e46fbd6dc9c2b58b89c098d3e95"); // sha256 of "correct"
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
    assertThrows(RuntimeException.class, () -> userService.loginUser("test@example.com", "wrong-password"));
  }

  // ===== findById =====

  @Test
  @DisplayName("findById - should return empty when not found")
  void findById_NotFound_ShouldReturnEmpty() {
    when(userRepository.findById("nonexistent")).thenReturn(Optional.empty());
    assertTrue(userService.findById("nonexistent").isEmpty());
  }

  @Test
  @DisplayName("findById - should return user when found")
  void findById_Found_ShouldReturnUser() {
    when(userRepository.findById("user-1")).thenReturn(Optional.of(mockUser));
    assertTrue(userService.findById("user-1").isPresent());
  }

  // ===== suspendUser / reactivateUser =====

  @Test
  @DisplayName("suspendUser - should set user as inactive")
  void suspendUser_ShouldDeactivateUser() {
    when(userRepository.findById("user-1")).thenReturn(Optional.of(mockUser));
    when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    userService.suspendUser("user-1", "Violation");

    assertFalse(mockUser.isActive());
    verify(userRepository, times(1)).save(mockUser);
  }

  @Test
  @DisplayName("reactivateUser - should set user as active again")
  void reactivateUser_ShouldActivateUser() {
    mockUser.setActive(false);
    when(userRepository.findById("user-1")).thenReturn(Optional.of(mockUser));
    when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    userService.reactivateUser("user-1");

    assertTrue(mockUser.isActive());
  }

  @Test
  @DisplayName("suspendUser - should throw when user not found")
  void suspendUser_NotFound_ShouldThrow() {
    when(userRepository.findById("ghost")).thenReturn(Optional.empty());
    assertThrows(RuntimeException.class, () -> userService.suspendUser("ghost", "reason"));
  }

  // ===== Plan Limit Methods =====

  @Test
  @DisplayName("getUserLinksLimit - FREE plan should have 1000 link limit")
  void getUserLinksLimit_FreePlan_Returns1000() {
    assertEquals(1000, userService.getUserLinksLimit("FREE"));
  }

  @Test
  @DisplayName("getUserLinksLimit - BUSINESS plan should return -1 (unlimited)")
  void getUserLinksLimit_BusinessPlan_ReturnsUnlimited() {
    assertEquals(-1, userService.getUserLinksLimit("BUSINESS_MONTHLY"));
  }

  @Test
  @DisplayName("getUserDomainsLimit - FREE plan should return 0 custom domains")
  void getUserDomainsLimit_FreePlan_Returns0() {
    assertEquals(0, userService.getUserDomainsLimit("FREE"));
  }

  @Test
  @DisplayName("getUserDomainsLimit - PRO plan should allow 1 domain")
  void getUserDomainsLimit_ProPlan_Returns1() {
    assertEquals(1, userService.getUserDomainsLimit("PRO_MONTHLY"));
  }

  // ===== updateUserRoles =====

  @Test
  @DisplayName("updateUserRoles - should update and save roles")
  void updateUserRoles_ShouldPersistNewRoles() {
    when(userRepository.findById("user-1")).thenReturn(Optional.of(mockUser));
    when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    userService.updateUserRoles("user-1", Set.of("ROLE_ADMIN", "ROLE_USER"));

    assertTrue(mockUser.getRoles().contains("ROLE_ADMIN"));
    verify(userRepository).save(mockUser);
  }

  // ===== Google Registration =====

  @Test
  @DisplayName("registerWithGoogle - should link googleId to existing email account")
  void registerWithGoogle_ExistingEmail_ShouldLinkGoogle() {
    mockUser.setGoogleId(null);
    when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(mockUser));
    when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    User result = userService.registerWithGoogle(
        "test@example.com", "google-id-123", "John", "Doe", null);

    assertEquals("google-id-123", result.getGoogleId());
    assertEquals("GOOGLE", result.getAuthProvider());
  }

  @Test
  @DisplayName("registerWithGoogle - should create new user for new Google email")
  void registerWithGoogle_NewEmail_ShouldCreateUser() {
    when(userRepository.findByEmail("google@example.com")).thenReturn(Optional.empty());
    when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

    User result = userService.registerWithGoogle(
        "google@example.com", "google-id-456", "Google", "User", "https://pic.url");

    assertTrue(result.isEmailVerified());
    assertEquals("GOOGLE", result.getAuthProvider());
    assertTrue(result.getRoles().contains("ROLE_USER"));
  }
}
