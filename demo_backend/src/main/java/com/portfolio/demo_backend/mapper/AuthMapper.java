package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.auth.AuthResponse;
import com.portfolio.demo_backend.dto.auth.RegistrationResponse;
import com.portfolio.demo_backend.service.data.AuthTokensData;
import com.portfolio.demo_backend.service.data.RegistrationData;
import org.mapstruct.Mapper;

/**
 * Authentication-related mapper.
 *
 * Maps registration and token domain models to API response DTOs. Implemented
 * using default methods to avoid annotation-processor edge cases while still
 * exposing a Spring-managed mapper bean.
 */
@Mapper(componentModel = "spring")
public interface AuthMapper {

    /**
     * Maps domain registration data to the API registration response.
     * Implemented as a default method to avoid annotation processor edge-cases.
     */
    default RegistrationResponse toRegistrationResponse(RegistrationData data) {
        if (data == null) {
            return null;
        }
        RegistrationResponse dto = new RegistrationResponse();
        dto.setId(data.id());
        dto.setUsername(data.username());
        dto.setRoles(data.roles());
        return dto;
    }

    /**
     * Maps token tuple and user context to the authentication response DTO.
     * Implemented as a default method to avoid annotation processor edge-cases.
     */
    default AuthResponse toAuthResponse(AuthTokensData data) {
        if (data == null) {
            return null;
        }
        AuthResponse dto = new AuthResponse();
        dto.setAccessToken(data.accessToken());
        dto.setRefreshToken(data.refreshToken());
        dto.setTokenType(data.tokenType());
        dto.setUserId(data.userId());
        dto.setUsername(data.username());
        dto.setRoles(data.roles());
        dto.setAuthenticatedAs(data.authenticatedAs());
        return dto;
    }
}
