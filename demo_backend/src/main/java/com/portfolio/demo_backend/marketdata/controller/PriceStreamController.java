package com.portfolio.demo_backend.marketdata.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.portfolio.demo_backend.marketdata.dto.PriceEvent;
import com.portfolio.demo_backend.marketdata.service.FinnhubStreamService;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stream")
@RequiredArgsConstructor
public class PriceStreamController {

    private final FinnhubStreamService finnhub;

    private static final int MAX_SYMBOLS = 50;
    private static final long TIMEOUT_MS = 0L;

    @GetMapping(path = "/prices", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamPrices(@RequestParam("symbols") String symbolsCsv,
            HttpServletResponse response) {

        response.addHeader("Cache-Control", "no-cache");
        response.addHeader("X-Accel-Buffering", "no");

        List<String> symbols = parseSymbols(symbolsCsv);
        if (symbols.isEmpty() || symbols.size() > MAX_SYMBOLS) {
            throw new IllegalArgumentException("Provide between 1 and " + MAX_SYMBOLS + " symbols");
        }

        SseEmitter emitter = new SseEmitter(TIMEOUT_MS);
        Map<String, FinnhubStreamService.PriceListener> attached = new ConcurrentHashMap<>();
        ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

        try {
            emitter.send(SseEmitter.event().name("heartbeat").data(PriceEvent.heartbeat()));
        } catch (IOException ignored) {
        }

        for (String sym : symbols) {
            FinnhubStreamService.PriceListener l = (symbol, price) -> {
                try {
                    emitter.send(SseEmitter.event()
                            .name("price")
                            .data(PriceEvent.price(symbol, price)));
                } catch (IOException e) {
                    emitter.complete();
                }
            };
            finnhub.addListener(sym, l);
            attached.put(sym, l);
        }

        scheduler.scheduleAtFixedRate(() -> {
            try {
                emitter.send(SseEmitter.event().name("heartbeat").data(PriceEvent.heartbeat()));
            } catch (IOException e) {
                emitter.complete();
            }
        }, 15, 15, TimeUnit.SECONDS);

        Runnable cleanup = () -> {
            attached.forEach((sym, l) -> finnhub.unsubscribe(sym, l));
            scheduler.shutdownNow();
        };
        emitter.onCompletion(cleanup);
        emitter.onTimeout(cleanup);
        emitter.onError(t -> cleanup.run());

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
}
