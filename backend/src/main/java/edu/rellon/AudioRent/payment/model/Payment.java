package edu.rellon.AudioRent.payment.model;

import lombok.*;
import com.google.cloud.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    private String id;
    private String rentalId;
    private String customerId;
    private Double amount;          // in PHP
    private String currency;        // "PHP"
    private PaymentStatus status;   // PENDING | SUCCESS | FAILED
    private String transactionReference;       // PayMongo PaymentIntent ID
    private String paymongoPaymentIntentId;
    private String description;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
