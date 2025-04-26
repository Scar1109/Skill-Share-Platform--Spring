package com.sliit.skillsharingplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Configure HTTP security with OAuth2 login and public access to specific endpoints
        http
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers("/api/users").permitAll()  // Allow public access to /api/users
                    .requestMatchers("/api/posts/**").permitAll()  // Allow public access to all /api/posts endpoints
                    .requestMatchers("/api/progress/**").permitAll()  // Allow public access to all /api/courses endpoints
                    .anyRequest().authenticated()  // Require authentication for all other requests
            )
            .oauth2Login();  // Enable OAuth2 login with Spring Security
        
        // Disable CSRF for API endpoints if needed
        http.csrf(csrf -> csrf.disable());

        return http.build();  // Return the configured HttpSecurity
    }
}