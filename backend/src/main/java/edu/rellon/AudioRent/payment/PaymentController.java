package edu.rellon.AudioRent.payment;

import edu.rellon.AudioRent.payment.dto.CreatePaymentRequest;
import edu.rellon.AudioRent.payment.model.Payment;
import edu.rellon.AudioRent.common.repository.UserRepository;
import edu.rellon.AudioRent.common.security.JwtUtils;
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
