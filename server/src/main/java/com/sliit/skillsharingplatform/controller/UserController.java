package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.User;
import com.sliit.skillsharingplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserService userService, BCryptPasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        logger.info("Received registration request for email: {}", user.getEmail());
        
        // Validate required fields
        Map<String, String> errors = new HashMap<>();
        
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            errors.put("email", "Email is required");
        }
        
        if (user.getFirstName() == null || user.getFirstName().trim().isEmpty()) {
            errors.put("firstName", "First name is required");
        }
        
        if (user.getLastName() == null || user.getLastName().trim().isEmpty()) {
            errors.put("lastName", "Last name is required");
        }
        
        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            errors.put("password", "Password is required");
        }
        
        if (!errors.isEmpty()) {
            logger.warn("Validation errors during registration: {}", errors);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
        }
        
        // Check if email already exists
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            logger.warn("Email already exists: {}", user.getEmail());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already registered"));
        }
        
        try {
            // Encrypt the password before saving
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Save the user
            User createdUser = userService.createUser(user);
            
            // Don't return the password in the response
            createdUser.setPassword(null);
            
            logger.info("User registered successfully: {}", user.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (Exception e) {
            logger.error("Error during user registration", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Registration failed: " + e.getMessage()));
        }
    }

    // Get a user by email
    @GetMapping("/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(value -> {
            // Don't return the password
            value.setPassword(null);
            return ResponseEntity.ok(value);
        }).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        List<User> users = userService.getAllUsers();
        // Don't return passwords
        users.forEach(user -> user.setPassword(null));
        return users;
    }

    // Update user details
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User user) {
        user.setId(id);
        
        // If password is being updated, encrypt it
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            // If password is not provided, get the existing password
            Optional<User> existingUser = userService.getUserById(id);
            if (existingUser.isPresent()) {
                user.setPassword(existingUser.get().getPassword());
            }
        }
        
        User updatedUser = userService.updateUser(user);
        
        // Don't return the password
        updatedUser.setPassword(null);
        
        return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
    }

    // Delete user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
