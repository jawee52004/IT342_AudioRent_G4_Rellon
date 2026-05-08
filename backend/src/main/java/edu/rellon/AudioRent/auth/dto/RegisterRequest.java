package edu.rellon.AudioRent.auth.dto;

import edu.rellon.AudioRent.common.model.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private Role role;
}
