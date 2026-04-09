package com.AudioRent.backend.service;

import com.AudioRent.backend.adapter.OAuthProvider;
import com.AudioRent.backend.event.UserRegisteredEvent;
import com.AudioRent.backend.factory.UserFactory;
import com.AudioRent.backend.model.Role;
import com.AudioRent.backend.model.User;
import com.AudioRent.backend.repository.UserRepository;
import com.AudioRent.backend.strategy.UserValidationStrategy;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    // Design Patterns Injectables
    private final UserFactory userFactory;
    private final OAuthProvider oAuthProvider;
    private final UserValidationStrategy validationStrategy;
    private final ApplicationEventPublisher eventPublisher;

    public AuthService(UserRepository userRepository, 
                       PasswordEncoder passwordEncoder,
                       UserFactory userFactory,
                       OAuthProvider oAuthProvider,
                       UserValidationStrategy validationStrategy,
                       ApplicationEventPublisher eventPublisher) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userFactory = userFactory;
        this.oAuthProvider = oAuthProvider;
        this.validationStrategy = validationStrategy;
        this.eventPublisher = eventPublisher;
    }

    public User processGoogleLogin(String googleToken, Role role) throws Exception {
        // Adapter Pattern usage
        Map<String, String> payload = oAuthProvider.verifyTokenAndGetPayload(googleToken);
        String email = payload.get("email");
        String name = payload.get("name");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            if (role == null) {
                throw new RuntimeException("Role selection is required for new Google accounts.");
            }
            // Factory Pattern usage
            User newUser = userFactory.createGoogleUser(name, email, role);
            User savedUser = userRepository.save(newUser);
            
            // Observer Pattern usage
            eventPublisher.publishEvent(new UserRegisteredEvent(savedUser));
            
            return savedUser;
        }
    }

    public User login(String email, String password) throws ExecutionException, InterruptedException {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        return userOpt.get();
    }

    public User register(String fullName, String email, String password, Role role) throws Exception {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        // Factory Pattern usage
        User user = userFactory.createCustomer(fullName, email, password);
        
        // Strategy Pattern usage
        validationStrategy.validate(user);
        
        // Ensure role is correctly overridden if provided
        if(role != null) {
            user.setRole(role);
        }

        User savedUser = userRepository.save(user);
        
        // Observer Pattern usage
        eventPublisher.publishEvent(new UserRegisteredEvent(savedUser));
        
        return savedUser;
    }
}