package com.AudioRent.backend.controller;

import com.AudioRent.backend.model.Package;
import com.AudioRent.backend.model.Role;
import com.AudioRent.backend.model.User;
import com.AudioRent.backend.repository.UserRepository;
import com.AudioRent.backend.security.JwtUtils;
import com.AudioRent.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * AdminController – all routes require ADMIN role.
 *
 * GET    /admin/users                – list all users
 * PUT    /admin/users/{id}/deactivate – set isActive = false
 * GET    /admin/packages             – list all packages (incl. inactive)
 * DELETE /admin/packages/{id}        – permanently remove a package
 */
@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public AdminController(AdminService adminService,
                           JwtUtils jwtUtils,
                           UserRepository userRepository) {
        this.adminService = adminService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    // ----------------------------------------------------------------
    // Guard helper – validate JWT and confirm ADMIN role
    // ----------------------------------------------------------------
    private boolean isAdmin(String authHeader) throws Exception {
        String token = authHeader.replace("Bearer ", "");
        if (!jwtUtils.isTokenValid(token)) return false;
        String email = jwtUtils.extractEmail(token);
        var userOpt = userRepository.findByEmail(email);
        return userOpt.isPresent() && Role.ADMIN.equals(userOpt.get().getRole());
    }

    // ----------------------------------------------------------------
    // GET /admin/users
    // ----------------------------------------------------------------
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(403).body("Admin access required");
            }
            List<User> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching users: " + e.getMessage());
        }
    }

    // ----------------------------------------------------------------
    // PUT /admin/users/{id}/deactivate
    // ----------------------------------------------------------------
    @PutMapping("/users/{id}/deactivate")
    public ResponseEntity<?> deactivateUser(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(403).body("Admin access required");
            }
            User updated = adminService.deactivateUser(id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deactivating user: " + e.getMessage());
        }
    }

    // ----------------------------------------------------------------
    // GET /admin/packages
    // ----------------------------------------------------------------
    @GetMapping("/packages")
    public ResponseEntity<?> getAllPackages(
            @RequestHeader("Authorization") String authHeader) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(403).body("Admin access required");
            }
            List<Package> packages = adminService.getAllPackages();
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching packages: " + e.getMessage());
        }
    }

    // ----------------------------------------------------------------
    // DELETE /admin/packages/{id}
    // ----------------------------------------------------------------
    @DeleteMapping("/packages/{id}")
    public ResponseEntity<?> deletePackage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            if (!isAdmin(authHeader)) {
                return ResponseEntity.status(403).body("Admin access required");
            }
            adminService.removePackage(id);
            return ResponseEntity.ok("Package removed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error removing package: " + e.getMessage());
        }
    }
}
