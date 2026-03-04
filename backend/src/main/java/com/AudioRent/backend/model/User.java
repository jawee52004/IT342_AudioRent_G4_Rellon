package com.AudioRent.backend.model;

import lombok.*;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private String id;
    private String email;
    private String passwordHash;
    private String fullName;
    private String role;
    private Boolean isActive;
    private Instant createdAt;
}
