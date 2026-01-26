package com.urlshortener;

import com.urlshortener.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter)
                        throws Exception {
                http
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(authz -> authz
                                                // Permit all OPTIONS requests (CORS preflight)
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                // Public endpoints
                                                .requestMatchers("/api/v1/auth/**").permitAll()
                                                .requestMatchers("/api/redirect/**").permitAll()
                                                .requestMatchers("/api/v1/urls/*/click").permitAll()
                                                .requestMatchers("/api/v1/qr/*/scan").permitAll()
                                                .requestMatchers("/api/v1/files/view/**").permitAll()
                                                .requestMatchers("/api/actuator/**").permitAll()
                                                .requestMatchers("/api/database/**").permitAll()
                                                .requestMatchers("/api/domains/**").permitAll()
                                                .requestMatchers("/api/monitoring/**").permitAll()
                                                // Lead Lock Public Endpoints
                                                .requestMatchers("/api/v1/leads/unlock/**").permitAll()
                                                // Redirect endpoints - CRITICAL for custom domains
                                                .requestMatchers("/{shortCode}").permitAll()
                                                .requestMatchers("/debug/{shortCode}").permitAll()
                                                .requestMatchers("/health").permitAll()
                                                .requestMatchers("/_health").permitAll()
                                                .requestMatchers("/debug").permitAll()
                                                .requestMatchers("/_debug").permitAll()
                                                // Allow anonymous creation but protect management endpoints
                                                .requestMatchers(HttpMethod.POST, "/api/v1/urls").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/qr").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/files/upload").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/public/applications")
                                                .permitAll()
                                                // Allow password-protected link access without authentication
                                                .requestMatchers(HttpMethod.POST, "/api/v1/urls/*/redirect").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/qr/*/redirect").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v1/files/*/redirect")
                                                .permitAll()
                                                // Protected endpoints - require authentication
                                                .requestMatchers("/api/v1/urls/**").authenticated()
                                                .requestMatchers("/api/v1/qr/**").authenticated()
                                                .requestMatchers("/api/v1/files/**").authenticated()
                                                .requestMatchers("/api/v1/analytics/**").authenticated()
                                                .requestMatchers("/api/v1/teams/**").authenticated()
                                                .requestMatchers("/api/v1/subscriptions/**").authenticated()
                                                .requestMatchers("/api/v1/support/**").authenticated()
                                                .requestMatchers("/api/v1/admin/employees/**").authenticated()
                                                .requestMatchers("/api/v1/admin/admins/**").authenticated()
                                                .requestMatchers("/api/v1/leads/**").authenticated()
                                                // All other requests
                                                .anyRequest().permitAll())
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        @Bean
        public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
                System.out.println("DEBUG: Loading Custom CORS Configuration with Specific Origins");
                org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
                // Use allowedOriginPatterns for wildcard support with credentials
                configuration.setAllowedOriginPatterns(java.util.Arrays.asList("*"));
                configuration
                                .setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS",
                                                "HEAD", "PATCH"));
                configuration.setAllowedHeaders(java.util.Arrays.asList("Authorization", "Content-Type",
                                "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method",
                                "Access-Control-Request-Headers"));
                configuration.setAllowCredentials(true);
                org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}