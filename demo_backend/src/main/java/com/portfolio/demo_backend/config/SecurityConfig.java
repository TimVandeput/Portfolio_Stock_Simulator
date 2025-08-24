package com.portfolio.demo_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import java.util.Arrays;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> {
                    auth.requestMatchers("/api/auth/**").permitAll();
            if (environment != null
                && Arrays.asList(environment.getActiveProfiles()).contains("test")) {
                        auth.requestMatchers(HttpMethod.POST, "/api/users/*/mystery-page").permitAll();
                    } else {
                        auth.requestMatchers(HttpMethod.POST, "/api/users/*/mystery-page").hasRole("ADMIN");
                    }
                    auth.anyRequest().authenticated();
                });
        return http.build();
    }

    private final Environment environment;

    public SecurityConfig(Environment environment) {
        this.environment = environment;
    }
}
