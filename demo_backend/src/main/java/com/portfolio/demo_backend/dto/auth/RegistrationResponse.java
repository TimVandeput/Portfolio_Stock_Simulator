package com.portfolio.demo_backend.dto.auth;

import com.portfolio.demo_backend.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

@Data
@AllArgsConstructor
public class RegistrationResponse {
    private Long id;
    private String username;
    private Set<Role> roles;
}
