package com.urlshortener.service;

import com.urlshortener.model.ClientAccess;
import com.urlshortener.model.User;
import com.urlshortener.repository.ClientAccessRepository;
import com.urlshortener.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class ClientService {

  @Autowired
  private ClientAccessRepository clientAccessRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private PasswordEncoder passwordEncoder;

  /**
   * Invite a new client to the agency workspace
   */
  public User inviteClient(String agencyUserId, String clientEmail, String firstName, String lastName,
      List<String> pageIds) {
    // Check if user exists
    User existingUser = userRepository.findByEmail(clientEmail).orElse(null);
    User clientUser;

    if (existingUser != null) {
      clientUser = existingUser;
      // Ensure they have ROLE_CLIENT
      clientUser.getRoles().add("ROLE_CLIENT");
      userRepository.save(clientUser);
    } else {
      // Create new user
      clientUser = new User();
      clientUser.setEmail(clientEmail);
      clientUser.setFirstName(firstName);
      clientUser.setLastName(lastName);
      // Generate random password for now (they would set it via reset/invite link)
      clientUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
      clientUser.setRoles(Set.of("ROLE_CLIENT"));
      clientUser.setCreatedAt(LocalDateTime.now());
      clientUser = userRepository.save(clientUser);
    }

    // Create or update ClientAccess mapping
    ClientAccess clientAccess = clientAccessRepository.findByClientId(clientUser.getId())
        .orElse(new ClientAccess(clientUser.getId(), agencyUserId, pageIds));

    // If it already existed, we still want to ensure the agency matches (or support
    // multi-agency per client later)
    clientAccess.setAgencyUserId(agencyUserId);
    clientAccess.setAllowedPageIds(pageIds);
    clientAccess.setUpdatedAt(LocalDateTime.now());

    clientAccessRepository.save(clientAccess);

    return clientUser;
  }

  /**
   * Get all clients for a specific agency
   */
  public List<ClientAccess> getClientsForAgency(String agencyUserId) {
    return clientAccessRepository.findByAgencyUserId(agencyUserId);
  }

  /**
   * Get ClientAccess for a specific client
   */
  public ClientAccess getClientAccess(String clientId) {
    return clientAccessRepository.findByClientId(clientId).orElse(null);
  }
}
