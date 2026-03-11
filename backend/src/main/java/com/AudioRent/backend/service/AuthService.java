package com.AudioRent.backend.service;

import com.AudioRent.backend.model.Role;
import com.AudioRent.backend.model.User;
import com.AudioRent.backend.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String GOOGLE_CLIENT_ID = "1075750667833-kisopk6s1pl2egd1a6l7cuh28aodtfrd.apps.googleusercontent.com";

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public User processGoogleLogin(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken == null) {
            throw new RuntimeException("Invalid Google Token");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();
        String email = payload.getEmail();
        String name = (String) payload.get("name");

        // Check if user exists in Firestore
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            // Create new Google User in Firestore
            User newUser = User.builder()
                    .fullName(name)
                    .email(email)
                    .passwordHash("") // No password for Google users
                    .role(Role.CUSTOMER)
                    .isActive(true)
                    .createdAt(com.google.cloud.Timestamp.now())
                    .build();
            return userRepository.save(newUser);
        }
    }

    // ... Keep your existing register() and login() methods below ...
    public User login(String email, String password) throws ExecutionException, InterruptedException {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return userOpt.get();
    }

    public User register(String fullName, String email, String password, Role role) throws ExecutionException, InterruptedException {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(role != null ? role : Role.CUSTOMER)
                .isActive(true)
                .createdAt(com.google.cloud.Timestamp.now())
                .build();
        return userRepository.save(user);
    }
}