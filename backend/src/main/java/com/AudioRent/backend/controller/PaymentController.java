package com.AudioRent.backend.controller;

import com.AudioRent.backend.dto.CreatePaymentRequest;
import com.AudioRent.backend.model.Payment;
import com.AudioRent.backend.repository.UserRepository;
import com.AudioRent.backend.security.JwtUtils;
import com.AudioRent.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    public PaymentController(PaymentService paymentService,
                             JwtUtils jwtUtils,
                             UserRepository userRepository) {
        this.paymentService = paymentService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
    }

    /**
     * POST /api/v1/payments
     * Body: { "rentalId": "<rentalId>" }
     *
     * Triggers the PayMongo sandbox payment flow for a confirmed rental booking.
     * Returns the persisted Payment record (including transactionReference and status).
     */
    @PostMapping
    public ResponseEntity<?> createPayment(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody CreatePaymentRequest request) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String email = jwtUtils.extractEmail(token);

            var userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(401).body("Unauthorized");
            }

            String customerId = userOpt.get().getId();
            Payment payment = paymentService.processPayment(request.getRentalId(), customerId);
            return ResponseEntity.ok(payment);

        } catch (Exception e) {
            return ResponseEntity.status(400).body("Payment error: " + e.getMessage());
        }
    }
}
