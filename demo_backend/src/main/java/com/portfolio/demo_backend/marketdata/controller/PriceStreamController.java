package com.portfolio.demo_backend.marketdata.controller;

import com.portfolio.demo_backend.marketdata.dto.PriceEvent;
import com.portfolio.demo_backend.marketdata.service.FinnhubStreamService;
import com.portfolio.demo_backend.marketdata.service.StreamAuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Server-Sent Events (SSE) endpoint to stream live price updates to clients
 * after token validation.
 */
@Slf4j
@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor

public class PriceStreamController {

    private final FinnhubStreamService finnhub;
    private final StreamAuthenticationService authService;

    private static final int MAX_SYMBOLS = 50;
    // Use 0 (no timeout) to let the server keep the SSE connection open
    // indefinitely. Cleanup is managed explicitly via callbacks below.
    private static final long TIMEOUT_MS = 0L;

    /**
     * Subscribe to price updates for a set of symbols using SSE.
     *
     * Events emitted:
     * - name=price, data=PriceEvent (initial snapshot + live updates)
     * - name=heartbeat, data=PriceEvent (periodic keep-alive)
     * - name=error, data={status,message} (recoverable/non-recoverable errors)
     *
     * @param symbolsCsv comma-separated list of tickers
     * @param token      JWT token for authentication
     * @return an SseEmitter streaming initial snapshot and subsequent ticks
     */
    @GetMapping(path = "/prices", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamPrices(@RequestParam("symbols") String symbolsCsv,
            @RequestParam("token") String token,
            HttpServletResponse response) {

        // Validate the bearer JWT before opening a long-lived stream
        authService.validateToken(token);

        // Disable proxies/buffers to keep SSE flowing without chunked buffering
        response.addHeader("Cache-Control", "no-cache");
        response.addHeader("X-Accel-Buffering", "no");
        final SseEmitter emitter = new SseEmitter(TIMEOUT_MS);
        final List<String> symbols = parseSymbols(symbolsCsv);

        if (symbols.isEmpty()) {
            // Fail fast when no symbols provided; send SSE error and close
            safeSend(emitter, SseEmitter.event().name("error")
                    .data("{\"status\":400,\"message\":\"At least one symbol is required\"}"), () -> {
                    });
            safeComplete(emitter, () -> {
            });
            return emitter;
        }

        // Track per-symbol listeners so we can unsubscribe on completion/error
        final Map<String, FinnhubStreamService.PriceListener> attached = new ConcurrentHashMap<>();
        // Single-threaded scheduler for lightweight periodic heartbeats
        final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
        // Centralized cleanup routine to unsubscribe and stop heartbeat scheduler
        final Runnable cleanup = () -> {
            attached.forEach((sym, l) -> finnhub.unsubscribe(sym, l));
            scheduler.shutdownNow();
        };

        try {
            for (String sym : symbols) {
                log.debug("Subscribing to {}", sym);

                Double lastPrice = finnhub.getLastPrice(sym);
                Double percentChange = finnhub.getPercentChange(sym);
                if (lastPrice != null) {
                    // Bootstrap stream with the latest known quote so client UI can
                    // render immediately while waiting for the next live tick
                    safeSend(emitter, SseEmitter.event().name("price")
                            .data(PriceEvent.price(sym, lastPrice, percentChange)), cleanup);
                }

                FinnhubStreamService.PriceListener l = (symbol, price, pctChange) -> {
                    // Forward live ticks as SSE price events
                    safeSend(emitter, SseEmitter.event().name("price")
                            .data(PriceEvent.price(symbol, price, pctChange)), cleanup);
                };
                finnhub.addListener(sym, l);
                attached.put(sym, l);
                log.debug("Subscribed to {}", sym);
            }

            // Send an initial heartbeat so clients can verify the stream is alive
            safeSend(emitter, SseEmitter.event().name("heartbeat").data(PriceEvent.heartbeat()), cleanup);

            // Periodic keep-alive to keep intermediaries (proxies/LB) from
            // closing the idle SSE connection
            scheduler.scheduleAtFixedRate(
                    () -> safeSend(emitter, SseEmitter.event().name("heartbeat").data(PriceEvent.heartbeat()), cleanup),
                    15, 15, TimeUnit.SECONDS);

        } catch (Exception ex) {
            log.error("Subscription failed for {}: {}", symbols, ex.toString(), ex);
            // Surface a generic error to the client, then close the stream
            safeSend(emitter, SseEmitter.event().name("error")
                    .data("{\"status\":500,\"message\":\"Subscription failed\"}"), cleanup);
            safeComplete(emitter, cleanup);
            return emitter;
        }

        // Ensure cleanup triggers regardless of how the stream ends
        emitter.onCompletion(() -> safeComplete(emitter, cleanup));
        emitter.onTimeout(() -> safeComplete(emitter, cleanup));
        emitter.onError(ex -> {
            log.warn("SSE onError: {}", ex.toString(), ex);
            safeComplete(emitter, cleanup);
        });

        return emitter;
    }

    /**
     * Parse, sanitize, de-duplicate and cap the requested symbols list.
     */
    private List<String> parseSymbols(String csv) {
        if (!StringUtils.hasText(csv))
            return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                // Avoid duplicate subscriptions and cap total to protect the stream
                .distinct()
                .limit(MAX_SYMBOLS)
                .collect(Collectors.toList());
    }

    /**
     * Send an SSE event and perform best-effort cleanup on any send failure. Treats
     * common client disconnect errors as normal and lowers log verbosity.
     *
     * @param emitter the active SSE emitter
     * @param ev      pre-built SSE event
     * @param cleanup cleanup routine to unsubscribe and stop heartbeat
     */
    private static void safeSend(SseEmitter emitter, SseEmitter.SseEventBuilder ev, Runnable cleanup) {
        try {
            emitter.send(ev);
        } catch (Exception ex) {
            if (isClientDisconnectionError(ex)) {
                log.debug("Client disconnected, cleaning up SSE connection");
            } else {
                log.warn("SSE send failed: {}", ex.getMessage());
            }
            // Any send failure should complete and cleanup to avoid resource leaks
            safeComplete(emitter, cleanup);
        }
    }

    /**
     * Heuristic detection of typical client disconnection scenarios to avoid
     * noisy error logs for expected conditions.
     *
     * @param ex the exception thrown by the emitter
     * @return true if the error likely resulted from a closed client connection
     */
    private static boolean isClientDisconnectionError(Exception ex) {
        String message = ex.getMessage();
        // Heuristics for typical client disconnect/EOF conditions
        return message != null && (message.contains("connection was aborted") ||
                message.contains("Connection reset") ||
                message.contains("Broken pipe") ||
                ex instanceof java.io.IOException);
    }

    /**
     * Complete the SSE emitter and run cleanup, suppressing any errors during
     * shutdown to ensure resources are released.
     *
     * @param emitter the active SSE emitter
     * @param cleanup cleanup routine to unsubscribe and stop heartbeat
     */
    private static void safeComplete(SseEmitter emitter, Runnable cleanup) {
        try {
            emitter.complete();
        } catch (Exception ignored) {
        }
        try {
            cleanup.run();
        } catch (Exception ignored) {
        }
    }
}