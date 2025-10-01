package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.enums.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record RegistrationData(
        @NotNull Long id,
        @NotBlank String username,
        @NotEmpty Set<Role> roles) {
}
