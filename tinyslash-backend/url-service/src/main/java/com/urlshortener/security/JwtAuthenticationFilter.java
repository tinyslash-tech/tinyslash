package com.urlshortener.security;

import com.urlshortener.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        @Autowired
        private JwtUtil jwtUtil;

        @Autowired
        @Lazy
        private UserService userService;

        @Autowired
        @Lazy
        private com.urlshortener.admin.repository.AdminUserRepository adminUserRepository;

        @Override
        protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                        throws ServletException, IOException {

                final String requestTokenHeader = request.getHeader("Authorization");

                String userId = null;
                String jwtToken = null;

                // JWT Token is in the form "Bearer token". Remove Bearer word and get only the
                // Token
                if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
                        jwtToken = requestTokenHeader.substring(7);
                        try {
                                userId = jwtUtil.extractUserId(jwtToken);
                                logger.info("JWT Filter: Extracted userId: " + userId);
                        } catch (Exception e) {
                                logger.warn("Unable to get JWT Token or JWT Token has expired");
                        }
                }

                // Once we get the token validate it.
                if (userId != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                        try {
                                // Check if user exists
                                var userOpt = userService.findById(userId);
                                if (userOpt.isPresent() && jwtUtil.validateToken(jwtToken, userId)) {

                                        com.urlshortener.model.User user = userOpt.get();

                                        List<org.springframework.security.core.GrantedAuthority> authorities = new ArrayList<>();

                                        // Assign roles from database
                                        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                                                for (String role : user.getRoles()) {
                                                        authorities
                                                                        .add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                                        role));
                                                }
                                        } else {
                                                // Fallback default role
                                                authorities.add(
                                                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                                "ROLE_USER"));
                                        }

                                        // Ensure admin@tinyslash.com always has full access (Safety Net)
                                        logger.info("JWT Filter: Checking user email: '" + user.getEmail()
                                                        + "' against 'admin@tinyslash.com'");
                                        if ("admin@tinyslash.com".equals(user.getEmail())) {
                                                boolean hasSuperAdmin = false;
                                                boolean hasHr = false;
                                                boolean hasAdmin = false;

                                                for (org.springframework.security.core.GrantedAuthority auth : authorities) {
                                                        if (auth.getAuthority().equals("ROLE_SUPER_ADMIN"))
                                                                hasSuperAdmin = true;
                                                        if (auth.getAuthority().equals("ROLE_HR"))
                                                                hasHr = true;
                                                        if (auth.getAuthority().equals("ROLE_ADMIN"))
                                                                hasAdmin = true;
                                                }

                                                if (!hasSuperAdmin)
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_SUPER_ADMIN"));
                                                if (!hasHr)
                                                        authorities.add(
                                                                        new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                                        "ROLE_HR"));
                                                if (!hasAdmin)
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_ADMIN"));

                                                // Grant ALL Admin Permissions to Super Admin User
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:read"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:create"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:update"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:delete"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:suspend"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:reactivate"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:impersonate"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:export"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_users:bulk_actions"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_audit:read"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_audit:export"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_employees:read"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_employees:create"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_employees:update"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_employees:delete"));

                                                // Grant ALL Team Permissions to Super Admin User
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_teams:read"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_teams:create"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_teams:update"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_teams:delete"));
                                                authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                "ADMIN_teams:manage_members"));

                                                // Debug: Log all authorities for admin@tinyslash.com
                                                logger.info("JWT Filter: Authorities for admin@tinyslash.com: "
                                                                + authorities);
                                        }

                                        // Create UserDetails for Spring Security - use user ID as username for easier
                                        // access
                                        UserDetails userDetails = User.builder()
                                                        .username(user.getId()) // Use user ID instead of email for
                                                                                // easier access in controllers
                                                        .password("") // We don't need password for JWT auth
                                                        .authorities(authorities)
                                                        .build();

                                        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                                                        userDetails, null, userDetails.getAuthorities());
                                        usernamePasswordAuthenticationToken
                                                        .setDetails(new WebAuthenticationDetailsSource()
                                                                        .buildDetails(request));

                                        // Set the user in the request for easy access
                                        request.setAttribute("currentUser", user);
                                        request.setAttribute("currentUserId", user.getId());
                                        request.setAttribute("currentUserEmail", user.getEmail());

                                        SecurityContextHolder.getContext()
                                                        .setAuthentication(usernamePasswordAuthenticationToken);
                                } else {
                                        // Check if it is an Admin User
                                        var adminOpt = adminUserRepository.findById(userId);
                                        if (adminOpt.isPresent() && jwtUtil.validateToken(jwtToken, userId)) {
                                                com.urlshortener.admin.model.AdminUser admin = adminOpt.get();
                                                List<org.springframework.security.core.GrantedAuthority> authorities = new ArrayList<>();

                                                // Add primary role
                                                if (admin.getRole() != null) {
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ROLE_" + admin.getRole().getName()));
                                                }

                                                // Add explicit ROLE_ADMIN for basic access
                                                authorities.add(
                                                                new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                                "ROLE_ADMIN"));

                                                // Map ALL permissions to required authorities
                                                if (admin.getPermissions() != null
                                                                && admin.getPermissions().contains("ALL")) {
                                                        // Grant all known permissions required by controllers
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:read"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:create"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:update"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:delete"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:suspend"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:reactivate"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:impersonate"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:export"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_users:bulk_actions"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_audit:read"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_audit:export"));

                                                        // Grant Employee Management permissions
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_employees:read"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_employees:write"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_employees:update"));
                                                        authorities.add(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                                        "ADMIN_employees:delete"));
                                                }

                                                UserDetails userDetails = User.builder()
                                                                .username(admin.getId())
                                                                .password("")
                                                                .authorities(authorities)
                                                                .build();

                                                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                                                                userDetails, null, userDetails.getAuthorities());
                                                usernamePasswordAuthenticationToken
                                                                .setDetails(new WebAuthenticationDetailsSource()
                                                                                .buildDetails(request));

                                                request.setAttribute("adminUser", admin);
                                                request.setAttribute("currentAdminId", admin.getId());
                                                request.setAttribute("currentAdminEmail", admin.getEmail());

                                                SecurityContextHolder.getContext()
                                                                .setAuthentication(usernamePasswordAuthenticationToken);
                                                logger.info("JWT Filter: Admin authenticated successfully: "
                                                                + admin.getEmail());
                                        } else {
                                                logger.warn("JWT Filter: Admin not found or token invalid for ID: "
                                                                + userId);
                                        }
                                }
                        } catch (Exception e) {
                                logger.error("Error validating user: " + e.getMessage(), e);
                        }
                }
                chain.doFilter(request, response);
        }
}