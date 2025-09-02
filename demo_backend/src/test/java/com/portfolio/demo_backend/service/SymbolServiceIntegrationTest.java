package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient;
import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.repository.SymbolRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest(properties = {
        "app.marketdata.finnhub.enabled=false",
        "app.marketdata.finnhub.token=test"
})
@ActiveProfiles("test")
@Transactional
class SymbolServiceIntegrationTest {

    @Autowired
    SymbolService service;

    @Autowired
    SymbolRepository repo;

    @MockitoBean
    FinnhubAdminClient finnhub;

    @Test
    void importUniverse_persists_and_list_returns_page() throws Exception {
        FinnhubAdminClient.SymbolItem item1 = new FinnhubAdminClient.SymbolItem();
        item1.symbol = "AAPL";
        item1.description = "Apple Inc.";
        item1.type = "Common Stock";
        item1.currency = "USD";
        item1.mic = "XNAS";

        FinnhubAdminClient.SymbolItem item2 = new FinnhubAdminClient.SymbolItem();
        item2.symbol = "MSFT";
        item2.description = "Microsoft Corp.";
        item2.type = "Common Stock";
        item2.currency = "USD";
        item2.mic = "XNAS";

        when(finnhub.listSymbolsByExchange("US")).thenReturn(List.of(item1, item2));

        ImportSummaryDTO sum = service.importUniverse("NDX");

        assertThat(sum.imported).isEqualTo(2);
        assertThat(repo.findBySymbol("AAPL")).isPresent();
        assertThat(repo.findBySymbol("MSFT")).isPresent();

        Page<SymbolDTO> page = service.list(null, null, PageRequest.of(0, 10));
        assertThat(page.getTotalElements()).isEqualTo(2);
    }

    @Test
    void setEnabled_toggles_persisted_value() {
        SymbolEntity s = new SymbolEntity();
        s.setSymbol("TEST");
        s.setName("Test Inc.");
        s.setExchange("TESTX");
        s.setCurrency("USD");
        s.setEnabled(true);
        repo.saveAndFlush(s);

        SymbolDTO afterDisable = service.setEnabled(s.getId(), false);
        assertThat(afterDisable.enabled).isFalse();

        Optional<SymbolEntity> reloaded = repo.findById(s.getId());
        assertThat(reloaded).isPresent();
        assertThat(reloaded.get().isEnabled()).isFalse();
    }
}
