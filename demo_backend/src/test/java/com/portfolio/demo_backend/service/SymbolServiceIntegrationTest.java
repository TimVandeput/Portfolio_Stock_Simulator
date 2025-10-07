package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.service.data.ImportData;
import com.portfolio.demo_backend.repository.SymbolRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

/**
 * Integration tests for {@link SymbolService} covering list and enable/disable
 * flows.
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class SymbolServiceIntegrationTest {

    @Autowired
    SymbolService symbolService;
    @Autowired
    SymbolRepository symbolRepository;

    private Symbol testSymbol;

    /**
     * Given an initial symbol stored for lookup tests.
     */
    @BeforeEach
    void setUp() {
        testSymbol = new Symbol();
        testSymbol.setSymbol("AAPL");
        testSymbol.setName("Apple Inc.");
        testSymbol.setExchange("NASDAQ");
        testSymbol.setCurrency("USD");
        testSymbol.setEnabled(true);
        testSymbol = symbolRepository.save(testSymbol);
    }

    /**
     * Given no filters
     * When listing symbols
     * Then all stored symbols are returned
     */
    @Test
    void list_withNoFilter_returnsAllSymbols() {
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Symbol> result = symbolService.list(null, null, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
        assertThat(result.getContent().get(0).getName()).isEqualTo("Apple Inc.");
    }

    /**
     * Given both enabled and disabled symbols exist
     * When filtering by enabled
     * Then only enabled symbols are returned
     */
    @Test
    void list_withEnabledFilter_returnsOnlyEnabled() {
        Symbol disabledSymbol = new Symbol();
        disabledSymbol.setSymbol("DISABLED");
        disabledSymbol.setName("Disabled Corp");
        disabledSymbol.setEnabled(false);
        symbolRepository.save(disabledSymbol);

        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Symbol> result = symbolService.list(null, true, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
        assertThat(result.getContent().get(0).isEnabled()).isTrue();
    }

    /**
     * Given a stored symbol
     * When querying with a partial name
     * Then the matching symbol is returned
     */
    @Test
    void list_withQueryFilter_findsMatchingSymbols() {
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Symbol> result = symbolService.list("App", null, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
    }

    /**
     * Given no symbols match a query
     * When listing with that query
     * Then an empty page is returned
     */
    @Test
    void list_withNoMatches_returnsEmpty() {
        Pageable pageable = PageRequest.of(0, 10);

        // When
        Page<Symbol> result = symbolService.list("NONEXISTENT", null, pageable);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
    }

    /**
     * Given an enabled symbol
     * When disabling it
     * Then persisted state reflects disabled
     */
    @Test
    void setEnabled_disablesSymbol() {
        // When
        Symbol result = symbolService.setEnabled(testSymbol.getId(), false);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isEnabled()).isFalse();

        Symbol updatedSymbol = symbolRepository.findById(testSymbol.getId()).orElseThrow();
        assertThat(updatedSymbol.isEnabled()).isFalse();
    }

    /**
     * Given a disabled symbol
     * When enabling it
     * Then persisted state reflects enabled
     */
    @Test
    void setEnabled_enablesDisabledSymbol() {
        testSymbol.setEnabled(false);
        symbolRepository.save(testSymbol);

        // When
        Symbol result = symbolService.setEnabled(testSymbol.getId(), true);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.isEnabled()).isTrue();

        Symbol updatedSymbol = symbolRepository.findById(testSymbol.getId()).orElseThrow();
        assertThat(updatedSymbol.isEnabled()).isTrue();
    }

    /**
     * Given no symbol for an id
     * When setEnabled is invoked
     * Then a runtime exception is thrown
     */
    @Test
    void setEnabled_nonExistentSymbol_throws() {
        assertThatThrownBy(() -> symbolService.setEnabled(999L, false))
                .isInstanceOf(RuntimeException.class);
    }

    /**
     * When retrieving import status
     * Then a non-running status is returned by default
     */
    @Test
    void importStatus_returnsCurrentStatus() {
        ImportData status = symbolService.importStatus();

        assertThat(status).isNotNull();
        assertThat(status.isRunning()).isFalse();
    }

}
