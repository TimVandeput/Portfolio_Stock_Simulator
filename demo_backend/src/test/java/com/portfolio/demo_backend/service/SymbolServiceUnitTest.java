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

/**
 * Unit tests for {@link SymbolService} import and listing behavior.
 *
 * Adds class/method Javadoc and inline Given/When/Then comments without
 * changing logic.
 */
@ExtendWith(MockitoExtension.class)
class SymbolServiceUnitTest {

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private FinnhubClient finnhubClient;

    @InjectMocks
    private SymbolService symbolService;

    /**
     * Given Finnhub returns two new symbols and none exist in the repository
     * When importing the NDX universe
     * Then two symbols are imported and none updated
     */
    @Test
    void importUniverse_ndx_success_returnsImportSummary() throws IOException {
        List<FinnhubClient.SymbolItem> mockSymbols = List.of(
                createSymbolItem("AAPL", "Apple Inc", "XNAS", "USD", "Common Stock"),
                createSymbolItem("MSFT", "Microsoft Corporation", "XNAS", "USD", "Common Stock"));
        when(finnhubClient.listSymbolsByExchange("US")).thenReturn(mockSymbols);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.findBySymbol("MSFT")).thenReturn(Optional.empty());
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        ImportSummaryDTO result = symbolService.importUniverse("NDX");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.imported).isEqualTo(2);
        assertThat(result.updated).isEqualTo(0);
        verify(symbolRepository, times(2)).save(any(Symbol.class));
    }

    /**
     * Given an import is already in progress
     * When importUniverse is called again
     * Then an ImportInProgressException is thrown
     */
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

        // Then
        assertThatThrownBy(() -> symbolService.importUniverse("NDX"))
                .isInstanceOf(ImportInProgressException.class);

        try {
            importThread.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Given Finnhub throws an IOException
     * When importUniverse is invoked
     * Then the IOException propagates
     */
    @Test
    void importUniverse_finnhubException_propagatesException() throws IOException {
        when(finnhubClient.listSymbolsByExchange("US")).thenThrow(new IOException("Finnhub API error"));

        assertThatThrownBy(() -> symbolService.importUniverse("NDX"))
                .isInstanceOf(IOException.class)
                .hasMessage("Finnhub API error");
    }

    /**
     * Given repository returns a paged result for a query
     * When list is invoked
     * Then the returned page contains expected symbol fields
     */
    @Test
    void list_withQuery_returnsFilteredResults() {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        Page<Symbol> mockPage = new PageImpl<>(List.of(symbol));
        Pageable pageable = PageRequest.of(0, 10);

        when(symbolRepository.search(eq("AAPL"), eq(true), any(Pageable.class))).thenReturn(mockPage);

        // When
        Page<Symbol> result = symbolService.list("AAPL", true, pageable);

        // Then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
        assertThat(result.getContent().get(0).getName()).isEqualTo("Apple Inc");
        assertThat(result.getContent().get(0).isEnabled()).isTrue();
    }

    /**
     * Given a disabled symbol exists
     * When enabling it
     * Then the symbol is saved with enabled true
     */
    @Test
    void setEnabled_enableSymbol_success() {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", false);
        symbol.setId(1L);
        when(symbolRepository.findById(1L)).thenReturn(Optional.of(symbol));
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Symbol result = symbolService.setEnabled(1L, true);

        // Then
        assertThat(result.isEnabled()).isTrue();
        verify(symbolRepository).save(symbol);
        assertThat(symbol.isEnabled()).isTrue();
    }

    /**
     * Given an enabled symbol exists
     * When disabling it
     * Then the symbol is saved with enabled false
     */
    @Test
    void setEnabled_disableSymbol_success() {
        Symbol symbol = createSymbol("AAPL", "Apple Inc", true);
        symbol.setId(1L);
        when(symbolRepository.findById(1L)).thenReturn(Optional.of(symbol));
        when(symbolRepository.save(any(Symbol.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // When
        Symbol result = symbolService.setEnabled(1L, false);

        // Then
        assertThat(result.isEnabled()).isFalse();
        verify(symbolRepository).save(symbol);
        assertThat(symbol.isEnabled()).isFalse();
    }

    /**
     * Given no symbol with the given id
     * When setEnabled is called
     * Then ResponseStatusException is thrown with message containing 'Symbol not
     * found'
     */
    @Test
    void setEnabled_symbolNotFound_throwsResponseStatusException() {
        when(symbolRepository.findById(999L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> symbolService.setEnabled(999L, true))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Symbol not found");
    }

    /**
     * Given no prior imports have run
     * When importStatus is queried
     * Then the status reflects not running and null last-import fields
     */
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
