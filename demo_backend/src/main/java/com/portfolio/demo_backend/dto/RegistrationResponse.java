package com.portfolio.demo_backend.dto;

import com.portfolio.demo_backend.model.Role;
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
