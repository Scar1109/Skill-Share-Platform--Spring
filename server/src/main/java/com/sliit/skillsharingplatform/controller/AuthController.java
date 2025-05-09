package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.User;
import com.sliit.skillsharingplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        Optional<User> userOptional = userService.getUserByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Check if password matches
            if (passwordEncoder.matches(password, user.getPassword())) {
                // Generate a simple token (in a real app, use JWT)
                String token = UUID.randomUUID().toString();

                // Create response with token and user data (excluding password)
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);

                // Create a user map without the password
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("id", user.getId());
                userMap.put("firstName", user.getFirstName());
                userMap.put("lastName", user.getLastName());
                userMap.put("email", user.getEmail());
                userMap.put("role", user.getRole());
                userMap.put("profileImageUrl", user.getProfileImageUrl());

                response.put("user", userMap);

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid email or password"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authHeader) {
        // In a real app, validate the token and get the user
        // For now, we'll just extract the token and return a mock response

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix

            // In a real app, validate the token and get the user ID
            // For now, we'll just return a mock response

            return ResponseEntity.ok(Map.of(
                    "id", "mock-user-id",
                    "firstName", "John",
                    "lastName", "Doe",
                    "email", "john.doe@example.com",
                    "role", "user"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid or expired token"));
    }
}
