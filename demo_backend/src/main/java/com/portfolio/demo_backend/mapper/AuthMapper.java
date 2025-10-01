package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.auth.AuthResponse;
import com.portfolio.demo_backend.dto.auth.RegistrationResponse;
import com.portfolio.demo_backend.service.data.AuthTokensData;
import com.portfolio.demo_backend.service.data.RegistrationData;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuthMapper {
    RegistrationResponse toRegistrationResponse(RegistrationData data);

    AuthResponse toAuthResponse(AuthTokensData data);
}
