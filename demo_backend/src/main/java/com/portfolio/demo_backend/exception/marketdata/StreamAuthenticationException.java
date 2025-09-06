package com.portfolio.demo_backend.exception.marketdata;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class StreamAuthenticationException extends RuntimeException {
    public StreamAuthenticationException(String message) {
        super(message);
    }

    public StreamAuthenticationException(String message, Throwable cause) {
        super(message, cause);
    }
}
