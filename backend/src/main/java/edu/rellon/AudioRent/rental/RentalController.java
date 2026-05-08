package edu.rellon.AudioRent.rental;

import edu.rellon.AudioRent.rental.dto.CreateRentalRequest;
import edu.rellon.AudioRent.rental.model.Rental;
import edu.rellon.AudioRent.rental.model.RentalStatus;
import edu.rellon.AudioRent.common.repository.UserRepository;
import edu.rellon.AudioRent.common.security.JwtUtils;
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

    // GET /rentals/provider - Provider: get rentals for own packages
    @GetMapping("/provider")
    public ResponseEntity<?> getProviderRentals(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            String providerId = userOpt.get().getId();
            List<Rental> rentals = rentalService.getRentalsByProvider(providerId);
            return ResponseEntity.ok(rentals);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching provider rentals: " + e.getMessage());
        }
    }

    // PUT /rentals/{id}/status - Provider: update rental status
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String id,
            @RequestParam RentalStatus status) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);
            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(401).body("Unauthorized");
            
            // In a real app, we'd check if this provider owns the package in the rental
            Rental updated = rentalService.updateRentalStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error updating status: " + e.getMessage());
        }
    }

    // GET /rentals/package/{packageId} - Customer: check availability
    @GetMapping("/package/{packageId}")
    public ResponseEntity<?> getRentalsByPackage(@PathVariable String packageId) {
        try {
            return ResponseEntity.ok(rentalService.getRentalsByPackage(packageId));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}
