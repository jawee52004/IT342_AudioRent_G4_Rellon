package com.AudioRent.backend.facade;

import com.AudioRent.backend.dto.RegisterRequest;
import com.AudioRent.backend.model.User;
import com.AudioRent.backend.security.JwtUtils;
import com.AudioRent.backend.service.AuthService;
import com.AudioRent.backend.model.Role;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
public class AuthFacade {
    private final AuthService authService;
    private final JwtUtils jwtUtils;

    public AuthFacade(AuthService authService, JwtUtils jwtUtils) {
        this.authService = authService;
        this.jwtUtils = jwtUtils;
    }

    public Map<String, Object> loginUser(String email, String password) throws Exception {
        User user = authService.login(email, password);
        String token = jwtUtils.generateToken(user.getEmail());
        return Map.of(
            "token", token, 
            "fullName", user.getFullName(), 
            "role", user.getRole(),
            "id", user.getId()
        );
    }

    public User registerUser(RegisterRequest request) throws Exception {
        return authService.register(request.getFullName(), request.getEmail(), request.getPassword(), request.getRole());
    }

    public Map<String, Object> processGoogleLogin(String googleToken, String roleStr) throws Exception {
        Role role = roleStr != null && !roleStr.isEmpty() ? Role.valueOf(roleStr) : null;
        User user = authService.processGoogleLogin(googleToken, role);
        String token = jwtUtils.generateToken(user.getEmail());
        return Map.of(
            "token", token, 
            "fullName", user.getFullName(), 
            "role", user.getRole(),
            "id", user.getId()
        );
    }
}
