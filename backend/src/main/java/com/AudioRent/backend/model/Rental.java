package com.AudioRent.backend.model;

import lombok.*;
import com.google.cloud.Timestamp;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Rental {

    private String id;
    private String customerId;
    private String customerName;
    private String packageId;
    private String packageName;
    private String providerId;
    private String startDate;   // stored as ISO string "yyyy-MM-dd"
    private String endDate;
    private Integer totalDays;
    private Double totalPrice;
    private String notes;
    private RentalStatus status; // PENDING, CONFIRMED, CANCELLED, COMPLETED
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
