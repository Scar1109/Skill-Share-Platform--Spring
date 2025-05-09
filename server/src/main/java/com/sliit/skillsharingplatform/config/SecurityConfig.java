package com.sliit.skillsharingplatform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${app.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        logger.info("Configuring security filter chain");
        
        // Configure HTTP security with OAuth2 login and public access to specific endpoints
        http
            .authorizeHttpRequests(authorizeRequests ->
                authorizeRequests
                    .requestMatchers("/").permitAll() // Allow root URL
                    .requestMatchers("/error").permitAll() // Allow error URL
                    .requestMatchers("/api/users/**").permitAll()
                    .requestMatchers("/api/auth/**").permitAll() // Allow auth endpoints
                    .requestMatchers("/api/posts/**").permitAll()
                    .requestMatchers("/api/courses/**").permitAll()
                    .requestMatchers("/api/progress/**").permitAll()
                    .requestMatchers("/api/videos/**").permitAll()
                    .requestMatchers("/api/comments/**").permitAll()
                    .requestMatchers("/api/courses/upload-image").permitAll()
                    .requestMatchers("/login/**").permitAll() // Allow login endpoints
                    .requestMatchers("/oauth2/**").permitAll() // Allow OAuth2 endpoints
                    .requestMatchers("/login/oauth2/code/**").permitAll() // Allow OAuth2 callback
                    .anyRequest().authenticated()  // Require authentication for all other requests
            )
            .oauth2Login(oauth2 -> {
                logger.info("Configuring OAuth2 login");
                oauth2
                    .defaultSuccessUrl("/api/auth/oauth2/success", true) // Redirect after successful login
                    .failureUrl(frontendUrl + "/login?error=authentication_failed") // Redirect after failed login
                    .permitAll();
            })
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/api/auth/logout"))
                .logoutSuccessUrl(frontendUrl + "/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            );
        
        // Disable CSRF for API endpoints if needed
        http.csrf(csrf -> csrf.disable());

        logger.info("Security filter chain configured successfully");
        return http.build();  // Return the configured HttpSecurity
    }
}
