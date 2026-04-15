package com.AudioRent.backend.controller;

import com.AudioRent.backend.dto.CreateRentalRequest;
import com.AudioRent.backend.model.Rental;
import com.AudioRent.backend.repository.UserRepository;
import com.AudioRent.backend.security.JwtUtils;
import com.AudioRent.backend.service.RentalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public RentalController(RentalService rentalService, JwtUtils jwtUtils, UserRepository userRepository) {
        this.rentalService = rentalService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    // POST /rentals - Customer: create a booking
    @PostMapping
    public ResponseEntity<?> createRental(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreateRentalRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            String customerId = userOpt.get().getId();
            Rental rental = rentalService.createRental(customerId, request);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Booking error: " + e.getMessage());
        }
    }

    // GET /rentals - Customer: get own rental history
    @GetMapping
    public ResponseEntity<?> getMyRentals(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            String customerId = userOpt.get().getId();
            List<Rental> rentals = rentalService.getRentalsByCustomer(customerId);
            return ResponseEntity.ok(rentals);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching rentals: " + e.getMessage());
        }
    }

    // GET /rentals/all - Admin: get all rentals
    @GetMapping("/all")
    public ResponseEntity<?> getAllRentals(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            List<Rental> rentals = rentalService.getAllRentals();
            return ResponseEntity.ok(rentals);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
