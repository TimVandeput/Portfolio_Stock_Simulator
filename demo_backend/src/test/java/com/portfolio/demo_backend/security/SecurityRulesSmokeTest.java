package com.portfolio.demo_backend.security;

import com.portfolio.demo_backend.config.JwtProperties;
import com.portfolio.demo_backend.controller.AuthController;
import com.portfolio.demo_backend.dto.AuthResponse;
import com.portfolio.demo_backend.marketdata.controller.PriceStreamController;
import com.portfolio.demo_backend.marketdata.service.FinnhubStreamService;
import com.portfolio.demo_backend.model.Role;
import com.portfolio.demo_backend.service.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {
        PriceStreamController.class,
        AuthController.class
})
@AutoConfigureMockMvc(addFilters = true)
@Import({ SecurityConfig.class, SecurityRulesSmokeTest.TestBeans.class })
class SecurityRulesSmokeTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthService authService;

    @Test
    void stream_requiresAuth() throws Exception {
        mockMvc.perform(get("/api/stream/prices").param("symbols", "AAPL"))
                .andExpect(status().isForbidden());
    }

    @Test
    void auth_open_notBlockedBySecurity() throws Exception {
        when(authService.login(any())).thenReturn(
                new AuthResponse(
                        "access-token",
                        "refresh-token",
                        "Bearer",
                        "tim",
                        Set.of(Role.ROLE_USER),
                        Role.ROLE_USER));

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"tim\",\"password\":\"pw\",\"chosenRole\":\"USER\"}"))
                .andExpect(status().isOk());
    }

    @TestConfiguration
    static class TestBeans {
        @Bean
        JwtAuthenticationFilter jwtAuthenticationFilter() {
            JwtProperties props = new JwtProperties();
            props.setSecret("TestSecretKeyForJwtThatIsLongEnough_1234567890"); // >= 32 bytes
            props.setExpiration(900_000L);
            props.setRefreshExpiration(604_800_000L);
            JwtService jwtService = new JwtService(props);
            return new JwtAuthenticationFilter(jwtService);
        }

        @Bean
        FinnhubStreamService finnhubStreamService() {
            return Mockito.mock(FinnhubStreamService.class);
        }

        @Bean
        AuthService authService() {
            return Mockito.mock(AuthService.class);
        }
    }
}
