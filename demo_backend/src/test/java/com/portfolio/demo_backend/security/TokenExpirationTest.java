package com.portfolio.demo_backend.security;

import java.time.Instant;

public class TokenExpirationTest {
    public static void main(String[] args) {
        long refreshExpiration = 604800000L;
        System.out.println("Refresh expiration config: " + refreshExpiration + " ms");
        System.out.println("That equals: " + (refreshExpiration / 1000 / 60 / 60 / 24) + " days");

        Instant now = Instant.now();
        Instant expires = now.plusMillis(refreshExpiration);

        System.out.println("Current time: " + now);
        System.out.println("Expiration time: " + expires);
        System.out.println("Duration: " + java.time.Duration.between(now, expires));

        long millisBetween = expires.toEpochMilli() - now.toEpochMilli();
        System.out.println("Milliseconds between: " + millisBetween);
        System.out.println("Days between: " + (millisBetween / 1000.0 / 60.0 / 60.0 / 24.0));
    }
}
