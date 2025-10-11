package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

/**
 * Minimal user projection used in registration responses to echo assigned
 * roles and identifiers without exposing sensitive fields.
 */
public record RegistrationData(
        @NotNull Long id,
        @NotBlank String username,
        @NotEmpty Set<Role> roles) {
}
