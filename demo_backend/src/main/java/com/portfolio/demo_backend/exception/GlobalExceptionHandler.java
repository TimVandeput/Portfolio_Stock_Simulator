package com.portfolio.demo_backend.exception;

import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.user.WeakPasswordException;
import com.portfolio.demo_backend.exception.marketdata.StreamAuthenticationException;
import com.portfolio.demo_backend.exception.price.PriceUnavailableException;
import com.portfolio.demo_backend.exception.marketdata.ApiRateLimitException;
import com.portfolio.demo_backend.exception.marketdata.MarketDataUnavailableException;
import com.portfolio.demo_backend.exception.trading.*;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;

import com.portfolio.demo_backend.exception.auth.InvalidCredentialsException;
import com.portfolio.demo_backend.exception.auth.InvalidRefreshTokenException;
import com.portfolio.demo_backend.exception.auth.RoleNotAssignedException;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.exception.symbol.SymbolNotFoundException;
import com.portfolio.demo_backend.exception.user.InvalidPasscodeException;
import com.portfolio.demo_backend.exception.user.UserAlreadyExistsException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(WeakPasswordException.class)
    public ResponseEntity<Map<String, String>> handleWeakPassword(WeakPasswordException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(InvalidPasscodeException.class)
    public ResponseEntity<Map<String, String>> handleInvalidPasscode(InvalidPasscodeException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCreds(InvalidCredentialsException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(RoleNotAssignedException.class)
    public ResponseEntity<Map<String, String>> handleRoleNotAssigned(RoleNotAssignedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    @ExceptionHandler(InvalidRefreshTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidRefresh(InvalidRefreshTokenException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(ImportInProgressException.class)
    public ResponseEntity<Map<String, String>> handleImportBusy(ImportInProgressException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(StreamAuthenticationException.class)
    public ResponseEntity<Map<String, String>> handleStreamAuth(StreamAuthenticationException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

    @ExceptionHandler(ApiRateLimitException.class)
    public ResponseEntity<Map<String, String>> handleApiRateLimit(ApiRateLimitException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(error);
    }

    @ExceptionHandler(MarketDataUnavailableException.class)
    public ResponseEntity<Map<String, String>> handleMarketDataUnavailable(MarketDataUnavailableException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientFunds(InsufficientFundsException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(InsufficientSharesException.class)
    public ResponseEntity<Map<String, String>> handleInsufficientShares(InsufficientSharesException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(WalletNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleWalletNotFound(WalletNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(PositionNotFoundException.class)
    public ResponseEntity<Map<String, String>> handlePositionNotFound(PositionNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(PriceUnavailableException.class)
    public ResponseEntity<Map<String, String>> handlePriceUnavailable(PriceUnavailableException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }

    @ExceptionHandler(SymbolNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleSymbolNotFound(SymbolNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex,
            jakarta.servlet.http.HttpServletRequest req) {
        log.error("Unhandled exception at {} {} (accept={}): {}",
                req.getMethod(), req.getRequestURI(), req.getHeader("Accept"),
                ex.toString(), ex);

        String accept = req.getHeader("Accept");
        if (accept != null && accept.contains(MediaType.TEXT_EVENT_STREAM_VALUE)) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.TEXT_PLAIN)
                    .body("stream error");
        }

        Map<String, String> body = new HashMap<>();
        body.put("error", ex.getClass().getSimpleName() + ": " + String.valueOf(ex.getMessage()));
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body);
    }

}
