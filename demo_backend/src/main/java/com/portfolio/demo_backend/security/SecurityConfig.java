package com.portfolio.demo_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

/**
 * Spring Security configuration defining stateless JWT auth and route
 * authorizations.
 *
 * Highlights:
 * - Stateless sessions, CSRF disabled for API usage.
 * - Custom entry point returning JSON 401 bodies.
 * - Explicit per-endpoint authorization mapping for clarity.
 */
@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, Environment environment) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource(environment)))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(eh -> eh.authenticationEntryPoint(new RestAuthEntryPoint()))
                .addFilterBefore(jwtAuthenticationFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll();

                    auth.requestMatchers("/actuator/health", "/actuator/info").permitAll();
                    auth.requestMatchers("/api/auth/**").permitAll();

                    auth.requestMatchers(HttpMethod.GET, "/api/symbols/import/status").hasAuthority("ROLE_ADMIN");
                    auth.requestMatchers(HttpMethod.POST, "/api/symbols/import").hasAuthority("ROLE_ADMIN");
                    auth.requestMatchers(HttpMethod.PUT, "/api/symbols/*/enabled").hasAuthority("ROLE_ADMIN");

                    auth.requestMatchers(HttpMethod.GET, "/api/symbols/**").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/prices/**").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/stream/**").permitAll();

                    auth.requestMatchers("/api/users/**").permitAll();

                    auth.requestMatchers(HttpMethod.POST, "/api/wallet/*/add-cash").hasAuthority("ROLE_ADMIN");

                    auth.requestMatchers(HttpMethod.POST, "/api/trades/*/buy").hasAuthority("ROLE_USER");
                    auth.requestMatchers(HttpMethod.POST, "/api/trades/*/sell").hasAuthority("ROLE_USER");
                    auth.requestMatchers(HttpMethod.GET, "/api/market/**").hasAuthority("ROLE_USER");
                    auth.requestMatchers(HttpMethod.GET, "/api/trades/*/portfolio").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/trades/*/history").authenticated();
                    auth.requestMatchers("/api/wallet/**").authenticated();
                    auth.requestMatchers(HttpMethod.GET, "/api/notifications/user/*").authenticated();
                    auth.requestMatchers(HttpMethod.POST, "/api/notifications/*/read").authenticated();

                    auth.anyRequest().authenticated();
                });

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(org.springframework.core.env.Environment env) {
        CorsConfiguration cfg = new CorsConfiguration();
        // Read comma-separated origins from env var CORS_ALLOWED_ORIGINS (fallback to
        // localhost)
        String originsProp = env.getProperty("CORS_ALLOWED_ORIGINS", "http://localhost:3000");
        List<String> origins = List.of(originsProp.split(","))
                .stream().map(String::trim).filter(s -> !s.isEmpty()).toList();
        // Use patterns to allow wildcards like https://*.up.railway.app
        cfg.setAllowedOriginPatterns(origins);
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setExposedHeaders(List.of("Location", "Authorization"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
