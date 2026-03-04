package com.AudioRent.backend.service;

import com.AudioRent.backend.model.User;
import com.AudioRent.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // hashing passwords
    }

    public User register(String fullName, String email, String password) throws ExecutionException, InterruptedException {
        // Check if email exists
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        // Create new user
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role("CUSTOMER") // default role
                .isActive(true)
                .createdAt(Instant.now())
                .build();

        return userRepository.save(user);
    }

    public User login(String email, String password) throws ExecutionException, InterruptedException {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid credentials");
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }

        // TODO: Generate JWT token here
        return user;
    }
}