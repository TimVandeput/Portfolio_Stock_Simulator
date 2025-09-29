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

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class SymbolServiceIntegrationTest {

    @Autowired
    SymbolService symbolService;
    @Autowired
    SymbolRepository symbolRepository;

    private Symbol testSymbol;

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

    @Test
    void list_withNoFilter_returnsAllSymbols() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Symbol> result = symbolService.list(null, null, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
        assertThat(result.getContent().get(0).getName()).isEqualTo("Apple Inc.");
    }

    @Test
    void list_withEnabledFilter_returnsOnlyEnabled() {
        Symbol disabledSymbol = new Symbol();
        disabledSymbol.setSymbol("DISABLED");
        disabledSymbol.setName("Disabled Corp");
        disabledSymbol.setEnabled(false);
        symbolRepository.save(disabledSymbol);

        Pageable pageable = PageRequest.of(0, 10);

        Page<Symbol> result = symbolService.list(null, true, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
        assertThat(result.getContent().get(0).isEnabled()).isTrue();
    }

    @Test
    void list_withQueryFilter_findsMatchingSymbols() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Symbol> result = symbolService.list("App", null, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).getSymbol()).isEqualTo("AAPL");
    }

    @Test
    void list_withNoMatches_returnsEmpty() {
        Pageable pageable = PageRequest.of(0, 10);

        Page<Symbol> result = symbolService.list("NONEXISTENT", null, pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).isEmpty();
    }

    @Test
    void setEnabled_disablesSymbol() {
        Symbol result = symbolService.setEnabled(testSymbol.getId(), false);

        assertThat(result).isNotNull();
        assertThat(result.isEnabled()).isFalse();

        Symbol updatedSymbol = symbolRepository.findById(testSymbol.getId()).orElseThrow();
        assertThat(updatedSymbol.isEnabled()).isFalse();
    }

    @Test
    void setEnabled_enablesDisabledSymbol() {
        testSymbol.setEnabled(false);
        symbolRepository.save(testSymbol);

        Symbol result = symbolService.setEnabled(testSymbol.getId(), true);

        assertThat(result).isNotNull();
        assertThat(result.isEnabled()).isTrue();

        Symbol updatedSymbol = symbolRepository.findById(testSymbol.getId()).orElseThrow();
        assertThat(updatedSymbol.isEnabled()).isTrue();
    }

    @Test
    void setEnabled_nonExistentSymbol_throws() {
        assertThatThrownBy(() -> symbolService.setEnabled(999L, false))
                .isInstanceOf(RuntimeException.class);
    }

    @Test
    void importStatus_returnsCurrentStatus() {
        ImportData status = symbolService.importStatus();

        assertThat(status).isNotNull();
        assertThat(status.isRunning()).isFalse();
    }

    @Test
    void getEnabledSymbols_returnsOnlyEnabledSymbolNames() {
        Symbol symbol2 = new Symbol();
        symbol2.setSymbol("GOOGL");
        symbol2.setName("Alphabet Inc.");
        symbol2.setEnabled(true);
        symbolRepository.save(symbol2);

        Symbol symbol3 = new Symbol();
        symbol3.setSymbol("TSLA");
        symbol3.setName("Tesla Inc.");
        symbol3.setEnabled(false);
        symbolRepository.save(symbol3);

        List<String> symbols = symbolService.getEnabledSymbols();

        assertThat(symbols).hasSize(2);
        assertThat(symbols).contains("AAPL", "GOOGL");
        assertThat(symbols).doesNotContain("TSLA");
    }

    @Test
    void getEnabledSymbols_withNoEnabledSymbols_returnsEmpty() {
        testSymbol.setEnabled(false);
        symbolRepository.save(testSymbol);

        List<String> symbols = symbolService.getEnabledSymbols();

        assertThat(symbols).isEmpty();
    }
}
