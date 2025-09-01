package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient;
import com.portfolio.demo_backend.integration.finnhub.FinnhubAdminClient.Profile2;
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
import static org.mockito.ArgumentMatchers.any;
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
        when(finnhub.getIndexConstituents("^NDX")).thenReturn(List.of("AAPL", "MSFT"));
        when(finnhub.throttled(any())).thenAnswer(inv -> {
            FinnhubAdminClient.CallSupplier<Profile2> sup = inv.getArgument(0);
            return sup.get();
        });

        Profile2 p1 = new Profile2();
        p1.ticker = "AAPL";
        p1.name = "Apple Inc.";
        p1.exchange = "NASDAQ";
        p1.currency = "USD";
        Profile2 p2 = new Profile2();
        p2.ticker = "MSFT";
        p2.name = "Microsoft Corp.";
        p2.exchange = "NASDAQ";
        p2.currency = "USD";
        when(finnhub.getProfile2("AAPL")).thenReturn(p1);
        when(finnhub.getProfile2("MSFT")).thenReturn(p2);

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
