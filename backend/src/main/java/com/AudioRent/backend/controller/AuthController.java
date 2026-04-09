package com.AudioRent.backend.controller;

import com.AudioRent.backend.dto.RegisterRequest;
import com.AudioRent.backend.facade.AuthFacade;
import com.AudioRent.backend.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthFacade authFacade;

    public AuthController(AuthFacade authFacade) {
        this.authFacade = authFacade;
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request) {
        try {
            String googleToken = request.get("token");
            String role = request.get("role");
            return ResponseEntity.ok(authFacade.processGoogleLogin(googleToken, role));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Google Authentication Failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            return ResponseEntity.ok(authFacade.loginUser(request.get("email"), request.get("password")));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = authFacade.registerUser(request);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}