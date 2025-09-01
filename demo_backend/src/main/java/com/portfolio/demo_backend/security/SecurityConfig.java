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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
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

                    auth.requestMatchers(HttpMethod.GET, "/api/quotes/**").authenticated();

                    if (environment != null
                            && java.util.Arrays.asList(environment.getActiveProfiles()).contains("test")) {
                        auth.requestMatchers(HttpMethod.POST, "/api/users/*/mystery-page").permitAll();
                    } else {
                        auth.requestMatchers(HttpMethod.POST, "/api/users/*/mystery-page").hasRole("ADMIN");
                    }
                    auth.requestMatchers("/api/users/**").permitAll();

                    auth.anyRequest().authenticated();
                });
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(List.of("*"));
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
