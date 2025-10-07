package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.symbol.ImportSummaryDTO;
import com.portfolio.demo_backend.service.data.ImportData;
import com.portfolio.demo_backend.exception.symbol.ImportInProgressException;
import com.portfolio.demo_backend.marketdata.integration.FinnhubClient;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.repository.SymbolRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SymbolServiceUnitTest {

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private FinnhubClient finnhubClient;

    @InjectMocks
    private SymbolService symbolService;

    @Test
    void importUniverse_ndx_success_returnsImportSummary() throws IOException {
        List<FinnhubClient.SymbolItem> mockSymbols = List.of(
                createSymbolItem("AAPL", "Apple Inc", "XNAS", "USD", "Common Stock"),
                createSymbolItem("MSFT", "Microsoft Corporation", "XNAS", "USD", "Common Stock"));
        when(finnhubClient.listSymbolsByExchange("US")).thenReturn(mockSymbols);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.findBySymbol("MSFT")).thenReturn(Optional.empty());
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ImportSummaryDTO result = symbolService.importUniverse("NDX");

        assertThat(result).isNotNull();
        assertThat(result.imported).isEqualTo(2);
        assertThat(result.updated).isEqualTo(0);
        verify(symbolRepository, times(2)).save(any(Symbol.class));
    }

    @Test
    void importUniverse_duplicateCall_throwsImportInProgressException() throws IOException {
        List<FinnhubClient.SymbolItem> mockSymbols = List
                .of(createSymbolItem("AAPL", "Apple Inc", "XNAS", "USD", "Common Stock"));
        when(finnhubClient.listSymbolsByExchange("US")).thenReturn(mockSymbols);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.count()).thenReturn(0L);
        when(symbolRepository.findAll()).thenReturn(List.of());
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
            return invocation.getArgument(0);
        });

        Thread importThread = new Thread(() -> {
            try {
                symbolService.importUniverse("NDX");
            } catch (IOException e) {
            }
        });
        importThread.start();

        try {
            Thread.sleep(50);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        assertThatThrownBy(() -> symbolService.importUniverse("NDX"))
                .isInstanceOf(ImportInProgressException.class);

        try {
            importThread.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    @Test
    void importUniverse_finnhubException_propagatesException() throws IOException {
        when(finnhubClient.listSymbolsByExchange("US")).thenThrow(new IOException("Finnhub API error"));

        assertThatThrownBy(() -> symbolService.importUniverse("NDX"))
                .isInstanceOf(IOException.class)
                .hasMessage("Finnhub API error");
    }

    @Test
    void list_withQuery_returnsFilteredResults() {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        Page<Symbol> mockPage = new PageImpl<>(List.of(symbol));
        Pageable pageable = PageRequest.of(0, 10);

        when(symbolRepository.search(eq("AAPL"), eq(true), any(Pageable.class))).thenReturn(mockPage);

        Page<Symbol> result = symbolService.list("AAPL", true, pageable);

        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
        assertThat(result.getContent().get(0).getName()).isEqualTo("Apple Inc");
        assertThat(result.getContent().get(0).isEnabled()).isTrue();
    }

    @Test
    void setEnabled_enableSymbol_success() {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", false);
        symbol.setId(1L);
        when(symbolRepository.findById(1L)).thenReturn(Optional.of(symbol));
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Symbol result = symbolService.setEnabled(1L, true);

        assertThat(result.isEnabled()).isTrue();
        verify(symbolRepository).save(symbol);
        assertThat(symbol.isEnabled()).isTrue();
    }

    @Test
    void setEnabled_disableSymbol_success() {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        symbol.setId(1L);
        when(symbolRepository.findById(1L)).thenReturn(Optional.of(symbol));
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Symbol result = symbolService.setEnabled(1L, false);

        assertThat(result.isEnabled()).isFalse();
        verify(symbolRepository).save(symbol);
        assertThat(symbol.isEnabled()).isFalse();
    }

    @Test
    void setEnabled_symbolNotFound_throwsResponseStatusException() {
        when(symbolRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> symbolService.setEnabled(999L, true))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Symbol not found");
    }

    @Test
    void importStatus_noImportYet_returnsCorrectStatus() {
        ImportData result = symbolService.importStatus();

        assertThat(result.isRunning()).isFalse();
        assertThat(result.getLastImportedAt()).isNull();
        assertThat(result.getLastSummary()).isNull();
    }

    private Symbol createSymbol(String symbol, String name, boolean enabled) {
        Symbol entity = new Symbol();
        entity.setSymbol(symbol);
        entity.setName(name);
        entity.setEnabled(enabled);
        entity.setExchange("NASDAQ");
        entity.setCurrency("USD");
        entity.setMic("XNAS");
        return entity;
    }

    private FinnhubClient.SymbolItem createSymbolItem(String symbol, String description, String mic, String currency,
            String type) {
        FinnhubClient.SymbolItem item = new FinnhubClient.SymbolItem();
        item.symbol = symbol;
        item.description = description;
        item.mic = mic;
        item.currency = currency;
        item.type = type;
        return item;
    }
}
