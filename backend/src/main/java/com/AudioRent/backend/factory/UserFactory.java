package com.AudioRent.backend.factory;

import com.AudioRent.backend.model.Role;
import com.AudioRent.backend.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserFactory {
    
    private final PasswordEncoder passwordEncoder;
    
    public UserFactory(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public User createCustomer(String fullName, String email, String password) {
        return User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .role(Role.CUSTOMER)
                .isActive(true)
                .createdAt(com.google.cloud.Timestamp.now())
                .build();
    }
    
    public User createGoogleUser(String name, String email, Role role) {
        return User.builder()
                .fullName(name)
                .email(email)
                .passwordHash("") // No password for Google
                .role(role)
                .isActive(true)
                .createdAt(com.google.cloud.Timestamp.now())
                .build();
    }
}
