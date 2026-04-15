package com.AudioRent.backend.controller;

import com.AudioRent.backend.model.Package;
import com.AudioRent.backend.repository.UserRepository;
import com.AudioRent.backend.security.JwtUtils;
import com.AudioRent.backend.service.PackageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/packages")
public class PackageController {

    private final PackageService packageService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public PackageController(PackageService packageService, JwtUtils jwtUtils, UserRepository userRepository) {
        this.packageService = packageService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    // GET /packages - Public: list all active packages
    @GetMapping
    public ResponseEntity<?> getAllPackages() {
        try {
            List<Package> packages = packageService.getAllActivePackages();
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching packages: " + e.getMessage());
        }
    }

    // GET /packages/{id} - Public: get single package
    @GetMapping("/{id}")
    public ResponseEntity<?> getPackageById(@PathVariable String id) {
        try {
            Optional<Package> pkg = packageService.getPackageById(id);
            if (pkg.isEmpty()) return ResponseEntity.status(404).body("Package not found");
            return ResponseEntity.ok(pkg.get());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // GET /packages/my - Provider: get own packages
    @GetMapping("/my")
    public ResponseEntity<?> getMyPackages(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            String providerId = userOpt.get().getId();
            List<Package> packages = packageService.getPackagesByProvider(providerId);
            return ResponseEntity.ok(packages);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // POST /packages - Provider: create package (multipart/form-data)
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createPackage(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("category") String category,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            var user = userOpt.get();
            Package pkg = packageService.createPackage(
                    user.getId(), user.getFullName(), name, description, price, quantity, category, images);
            return ResponseEntity.ok(pkg);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error creating package: " + e.getMessage());
        }
    }

    // PUT /packages/{id} - Provider: update package (multipart/form-data)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<?> updatePackage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("category") String category,
            @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            String providerId = userOpt.get().getId();
            Package pkg = packageService.updatePackage(id, providerId, name, description, price, quantity, category, images);
            return ResponseEntity.ok(pkg);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error updating package: " + e.getMessage());
        }
    }

    // DELETE /packages/{id} - Provider: delete package
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePackage(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            String providerId = userOpt.get().getId();
            packageService.deletePackage(id, providerId);
            return ResponseEntity.ok("Package deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error deleting package: " + e.getMessage());
        }
    }
}
