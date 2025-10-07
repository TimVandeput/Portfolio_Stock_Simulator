package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.auth.AuthResponse;
import com.portfolio.demo_backend.dto.auth.RegistrationResponse;
import com.portfolio.demo_backend.service.data.AuthTokensData;
import com.portfolio.demo_backend.service.data.RegistrationData;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AuthMapper {

    /**
     * Maps domain registration data to the API registration response.
     */
    RegistrationResponse toRegistrationResponse(RegistrationData data);

    /**
     * Maps token tuple and user context to the authentication response DTO.
     */
    AuthResponse toAuthResponse(AuthTokensData data);
}
