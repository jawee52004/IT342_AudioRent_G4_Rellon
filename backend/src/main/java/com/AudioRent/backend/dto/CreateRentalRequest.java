package com.AudioRent.backend.dto;

import lombok.Data;

@Data
public class CreateRentalRequest {
    private String packageId;
    private String startDate;  // "yyyy-MM-dd"
    private String endDate;    // "yyyy-MM-dd"
    private String notes;
}
