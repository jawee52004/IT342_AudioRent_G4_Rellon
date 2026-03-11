package com.AudioRent.backend.controller;

import com.AudioRent.backend.model.User;
import com.AudioRent.backend.service.AuthService;
import com.AudioRent.backend.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthController(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String googleToken = request.get("token");
            User user = authService.processGoogleLogin(googleToken);

            // Generate your custom backend JWT
            String token = jwtUtils.generateToken(user.getEmail());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "fullName", user.getFullName(),
                    "role", user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Google Authentication Failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            User user = authService.login(request.get("email"), request.get("password"));
            String token = jwtUtils.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "fullName", user.getFullName(),
                    "role", user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody com.AudioRent.backend.dto.RegisterRequest request) {
        try {
            User user = authService.register(request.getFullName(), request.getEmail(), request.getPassword(), request.getRole());
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}