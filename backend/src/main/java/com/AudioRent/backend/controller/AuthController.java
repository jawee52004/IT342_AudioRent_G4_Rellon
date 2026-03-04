package com.AudioRent.backend.controller;

import com.AudioRent.backend.model.User;
import com.AudioRent.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String fullName = request.get("fullName");
            String email = request.get("email");
            String password = request.get("password");

            if (fullName == null || email == null || password == null) {
                return ResponseEntity.badRequest().body("Missing required fields");
            }

            User newUser = authService.register(fullName, email, password);
            return ResponseEntity.ok(Map.of(
                    "id", newUser.getId(),
                    "fullName", newUser.getFullName(),
                    "email", newUser.getEmail()
            ));
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Database error");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Missing email or password");
            }

            User user = authService.login(email, password);

            // TODO: Return JWT token later
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "role", user.getRole()
            ));

        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Database error");
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}