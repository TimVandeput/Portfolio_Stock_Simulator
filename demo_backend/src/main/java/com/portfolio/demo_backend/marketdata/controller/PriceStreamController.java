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

@Slf4j
@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
public class PriceStreamController {

    private final FinnhubStreamService finnhub;
    private final StreamAuthenticationService authService;

    private static final int MAX_SYMBOLS = 50;
    private static final long TIMEOUT_MS = 0L;

    @GetMapping(path = "/prices", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamPrices(@RequestParam("symbols") String symbolsCsv,
            @RequestParam("token") String token,
            HttpServletResponse response) {

        authService.validateToken(token);

        response.addHeader("Cache-Control", "no-cache");
        response.addHeader("X-Accel-Buffering", "no");
        final SseEmitter emitter = new SseEmitter(TIMEOUT_MS);
        final List<String> symbols = parseSymbols(symbolsCsv);

        if (symbols.isEmpty()) {
            safeSend(emitter, SseEmitter.event().name("error")
                    .data("{\"status\":400,\"message\":\"At least one symbol is required\"}"), () -> {
                    });
            safeComplete(emitter, () -> {
            });
            return emitter;
        }

        final Map<String, FinnhubStreamService.PriceListener> attached = new ConcurrentHashMap<>();
        final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
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
                    safeSend(emitter, SseEmitter.event().name("price")
                            .data(PriceEvent.price(sym, lastPrice, percentChange)), cleanup);
                }

                FinnhubStreamService.PriceListener l = (symbol, price, pctChange) -> {
                    safeSend(emitter, SseEmitter.event().name("price")
                            .data(PriceEvent.price(symbol, price, pctChange)), cleanup);
                };
                finnhub.addListener(sym, l);
                attached.put(sym, l);
                log.debug("Subscribed to {}", sym);
            }

            safeSend(emitter, SseEmitter.event().name("heartbeat").data(PriceEvent.heartbeat()), cleanup);

            scheduler.scheduleAtFixedRate(
                    () -> safeSend(emitter, SseEmitter.event().name("heartbeat").data(PriceEvent.heartbeat()), cleanup),
                    15, 15, TimeUnit.SECONDS);

        } catch (Exception ex) {
            log.error("Subscription failed for {}: {}", symbols, ex.toString(), ex);
            safeSend(emitter, SseEmitter.event().name("error")
                    .data("{\"status\":500,\"message\":\"Subscription failed\"}"), cleanup);
            safeComplete(emitter, cleanup);
            return emitter;
        }

        emitter.onCompletion(() -> safeComplete(emitter, cleanup));
        emitter.onTimeout(() -> safeComplete(emitter, cleanup));
        emitter.onError(ex -> {
            log.warn("SSE onError: {}", ex.toString(), ex);
            safeComplete(emitter, cleanup);
        });

        return emitter;
    }

    private List<String> parseSymbols(String csv) {
        if (!StringUtils.hasText(csv))
            return List.of();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .distinct()
                .limit(MAX_SYMBOLS)
                .collect(Collectors.toList());
    }

    private static void safeSend(SseEmitter emitter, SseEmitter.SseEventBuilder ev, Runnable cleanup) {
        try {
            emitter.send(ev);
        } catch (Exception ex) {
            if (isClientDisconnectionError(ex)) {
                log.debug("Client disconnected, cleaning up SSE connection");
            } else {
                log.warn("SSE send failed: {}", ex.getMessage());
            }
            safeComplete(emitter, cleanup);
        }
    }

    private static boolean isClientDisconnectionError(Exception ex) {
        String message = ex.getMessage();
        return message != null && (message.contains("connection was aborted") ||
                message.contains("Connection reset") ||
                message.contains("Broken pipe") ||
                ex instanceof java.io.IOException);
    }

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