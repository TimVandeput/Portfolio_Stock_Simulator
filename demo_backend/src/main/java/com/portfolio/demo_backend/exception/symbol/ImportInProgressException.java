package com.portfolio.demo_backend.exception.symbol;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class ImportInProgressException extends RuntimeException {
    public ImportInProgressException() {
        super("An import is already running.");
    }
}
