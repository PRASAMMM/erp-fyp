package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.User;
import com.erp.erp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username and password are required"));
        }

        // Try exact match first, then case-insensitive
        Optional<User> opt = userRepository.findByUsername(username);
        if (opt.isEmpty()) {
            opt = userRepository.findByUsernameCaseInsensitive(username);
        }

        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }

        User user = opt.get();

        // Plain text password check (upgrade to BCrypt in production)
        if (!password.equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid username or password"));
        }

        // Normalize role to UPPERCASE so frontend routing always works
        if (user.getRole() != null) {
            user.setRole(user.getRole().toUpperCase());
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", sanitize(user));
        response.put("token", "erp-token-" + user.getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is required"));
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username already exists"));
        }
        // Normalize role
        if (user.getRole() == null || user.getRole().isBlank()) {
            user.setRole("STUDENT");
        } else {
            user.setRole(user.getRole().toUpperCase());
        }
        User saved = userRepository.save(user);
        return ResponseEntity.ok(sanitize(saved));
    }

    // Change password endpoint
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        Optional<User> opt = userRepository.findByUsername(username);
        if (opt.isEmpty()) return ResponseEntity.status(404).body(Map.of("message", "User not found"));

        User user = opt.get();
        if (!oldPassword.equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Current password is incorrect"));
        }
        user.setPassword(newPassword);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
    }

    Map<String, Object> sanitize(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("phone", u.getPhone());
        m.put("role", u.getRole() != null ? u.getRole().toUpperCase() : "STUDENT");
        m.put("department", u.getDepartment());
        m.put("className", u.getClassName());
        m.put("designation", u.getDesignation());
        m.put("registrationNumber", u.getRegistrationNumber());
        return m;
    }
}
