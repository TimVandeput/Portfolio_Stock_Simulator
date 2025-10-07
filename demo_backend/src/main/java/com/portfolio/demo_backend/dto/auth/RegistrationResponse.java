package com.portfolio.demo_backend.dto.auth;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Set;

/**
 * Registration confirmation payload echoing user id, username and roles.
 */
@Data
@AllArgsConstructor
public class RegistrationResponse {
    @NotNull
    private Long id;
    @NotBlank
    private String username;
    @NotEmpty
    private Set<Role> roles;
}
