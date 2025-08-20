package com.portfolio.demo_backend.exception.auth;

public class RoleNotAssignedException extends RuntimeException {
    public RoleNotAssignedException(String role) {
        super("Requested role not assigned to user: " + role);
    }
}