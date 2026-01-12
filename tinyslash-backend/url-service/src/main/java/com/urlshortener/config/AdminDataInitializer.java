package com.urlshortener.config;

import com.urlshortener.admin.model.AdminRole;
import com.urlshortener.admin.model.AdminUser;
import com.urlshortener.admin.repository.AdminUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
@ConditionalOnProperty(name = "app.admin.enabled", havingValue = "true", matchIfMissing = false)
public class AdminDataInitializer {

  @Bean
  public CommandLineRunner initAdminData(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
    return args -> {
      if (adminUserRepository.count() == 0) {
        System.out.println("Seeding initial admin user...");

        AdminRole superAdminRole = new AdminRole();
        superAdminRole.setName("SUPER_ADMIN");
        superAdminRole.setDisplayName("Super Admin");
        superAdminRole.setDescription("Full system access");
        superAdminRole.setPermissions(Set.of("ALL"));

        AdminUser adminUser = new AdminUser();
        adminUser.setEmail("admin@tinyslash.com");
        adminUser.setName("Super Admin");
        adminUser.setPasswordHash(passwordEncoder.encode("admin123"));
        adminUser.setRole(superAdminRole);
        adminUser.setPermissions(Set.of("ALL"));
        adminUser.setActive(true);
        adminUser.setMfaEnabled(false);

        adminUserRepository.save(adminUser);
        System.out.println("Seeded admin user: admin@tinyslash.com");
      }
    };
  }
}
