package com.AudioRent.backend.model;

import lombok.*;
import com.google.cloud.Timestamp;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Package {

    private String id;
    private String providerId;
    private String providerName;
    private String name;
    private String description;
    private Double price;          // price per day
    private Integer quantity;
    private String category;
    private List<String> imageUrls;
    private Boolean isActive;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
