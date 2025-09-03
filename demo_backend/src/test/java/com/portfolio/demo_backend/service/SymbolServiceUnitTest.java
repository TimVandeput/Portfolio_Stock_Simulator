package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.ImportSummaryDTO;
import com.portfolio.demo_backend.dto.SymbolDTO;
import com.portfolio.demo_backend.exception.symbol.SymbolInUseException;
import com.portfolio.demo_backend.marketdata.integration.FinnhubAdminClient;
import com.portfolio.demo_backend.model.SymbolEntity;
import com.portfolio.demo_backend.repository.SymbolRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SymbolServiceUnitTest {

    @Mock
    SymbolRepository repo;

    @Mock
    FinnhubAdminClient finnhub;

    @Mock
    SymbolInUseChecker inUseChecker;

    @InjectMocks
    SymbolService service;

    SymbolEntity aapl, msft;

    @BeforeEach
    void setup() {
        aapl = new SymbolEntity();
        aapl.setId(1L);
        aapl.setSymbol("AAPL");
        aapl.setName("Apple Inc.");
        aapl.setExchange("NASDAQ");
        aapl.setCurrency("USD");
        aapl.setEnabled(true);

        msft = new SymbolEntity();
        msft.setId(2L);
        msft.setSymbol("MSFT");
        msft.setName("Microsoft Corp.");
        msft.setExchange("NASDAQ");
        msft.setCurrency("USD");
        msft.setEnabled(true);
    }

    @Test
    void importUniverse_happyPath_importsAndUpdates_counts() throws Exception {
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

        when(repo.findBySymbol("AAPL")).thenReturn(Optional.empty());
        when(repo.findBySymbol("MSFT")).thenReturn(Optional.of(msft));

        when(repo.save(any(SymbolEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        ImportSummaryDTO sum = service.importUniverse("NDX");

        assertThat(sum.imported).isEqualTo(1);
        assertThat(sum.updated).isEqualTo(1);
        assertThat(sum.skipped).isEqualTo(0);

        verify(repo).findBySymbol("AAPL");
        verify(repo).findBySymbol("MSFT");
        verify(repo, times(2)).save(any(SymbolEntity.class));
    }

    @Test
    void importUniverse_skipsOnClientError() throws Exception {
        FinnhubAdminClient.SymbolItem item = new FinnhubAdminClient.SymbolItem();
        item.symbol = "GOOG";
        item.description = "";
        item.type = "Common Stock";
        item.currency = "USD";
        item.mic = "XNAS";

        when(finnhub.listSymbolsByExchange("US")).thenReturn(List.of(item));

        ImportSummaryDTO sum = service.importUniverse("NDX");

        assertThat(sum.imported).isZero();
        assertThat(sum.updated).isZero();
        assertThat(sum.skipped).isEqualTo(1);
        verify(repo, never()).save(any());
    }

    @Test
    void list_delegatesToRepo_mapsInUseFlag() {
        Page<SymbolEntity> page = new PageImpl<>(List.of(aapl), PageRequest.of(0, 25), 1);
        when(repo.search(isNull(), isNull(), any(Pageable.class))).thenReturn(page);
        when(inUseChecker.isInUse("AAPL")).thenReturn(false);

        Page<SymbolDTO> dtoPage = service.list(null, null, PageRequest.of(0, 25));

        assertThat(dtoPage.getTotalElements()).isEqualTo(1);
        SymbolDTO dto = dtoPage.getContent().get(0);
        assertThat(dto.symbol).isEqualTo("AAPL");
        assertThat(dto.inUse).isFalse();
    }

    @Test
    void setEnabled_disableWhenNotInUse_updates() {
        when(repo.findById(1L)).thenReturn(Optional.of(aapl));
        when(inUseChecker.isInUse("AAPL")).thenReturn(false);
        when(repo.save(any(SymbolEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        SymbolDTO dto = service.setEnabled(1L, false);

        assertThat(dto.enabled).isFalse();
        verify(repo).save(any(SymbolEntity.class));
    }

    @Test
    void setEnabled_disableWhenInUse_throws_andNotSaved() {
        when(repo.findById(1L)).thenReturn(Optional.of(aapl));
        when(inUseChecker.isInUse("AAPL")).thenReturn(true);

        assertThatThrownBy(() -> service.setEnabled(1L, false))
                .isInstanceOf(SymbolInUseException.class);

        verify(repo, never()).save(any());
    }

    @Test
    void setEnabled_enableEvenIfInUse_isAllowed() {
        aapl.setEnabled(false);
        when(repo.findById(1L)).thenReturn(Optional.of(aapl));
        when(inUseChecker.isInUse("AAPL")).thenReturn(true);
        when(repo.save(any(SymbolEntity.class))).thenAnswer(inv -> inv.getArgument(0));

        SymbolDTO dto = service.setEnabled(1L, true);

        assertThat(dto.enabled).isTrue();
        verify(repo).save(any(SymbolEntity.class));
    }
}
