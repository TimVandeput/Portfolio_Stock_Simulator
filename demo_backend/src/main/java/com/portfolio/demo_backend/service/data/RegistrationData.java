package com.portfolio.demo_backend.service.data;

import com.portfolio.demo_backend.model.enums.Role;

import java.util.Set;

public record RegistrationData(
        Long id,
        String username,
        Set<Role> roles) {
}
