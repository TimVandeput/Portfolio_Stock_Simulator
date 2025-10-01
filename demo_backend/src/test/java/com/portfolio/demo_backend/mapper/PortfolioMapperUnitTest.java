package com.portfolio.demo_backend.mapper;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.model.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import com.portfolio.demo_backend.service.util.PortfolioCalculations;

class PortfolioMapperUnitTest {

    private User testUser;
    private Wallet testWallet;
    private Symbol appleSymbol;
    private Symbol googleSymbol;
    private Portfolio applePortfolio;
    private Portfolio googlePortfolio;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("password")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();

        testWallet = new Wallet();
        testWallet.setUserId(1L);
        testWallet.setUser(testUser);
        testWallet.setCashBalance(BigDecimal.valueOf(3000.00));

        appleSymbol = new Symbol();
        appleSymbol.setId(1L);
        appleSymbol.setSymbol("AAPL");
        appleSymbol.setName("Apple Inc.");
        appleSymbol.setEnabled(true);

        googleSymbol = new Symbol();
        googleSymbol.setId(2L);
        googleSymbol.setSymbol("GOOGL");
        googleSymbol.setName("Alphabet Inc.");
        googleSymbol.setEnabled(true);

        applePortfolio = new Portfolio();
        applePortfolio.setId(1L);
        applePortfolio.setUserId(1L);
        applePortfolio.setUser(testUser);
        applePortfolio.setSymbol(appleSymbol);
        applePortfolio.setSharesOwned(10);
        applePortfolio.setAverageCostBasis(BigDecimal.valueOf(150.00));
        applePortfolio.setUpdatedAt(Instant.parse("2025-09-20T10:30:00Z"));

        googlePortfolio = new Portfolio();
        googlePortfolio.setId(2L);
        googlePortfolio.setUserId(1L);
        googlePortfolio.setUser(testUser);
        googlePortfolio.setSymbol(googleSymbol);
        googlePortfolio.setSharesOwned(5);
        googlePortfolio.setAverageCostBasis(BigDecimal.valueOf(120.00));
        googlePortfolio.setUpdatedAt(Instant.parse("2025-09-19T14:15:00Z"));
    }

    @Test
    void toPortfolioHoldingResponseDTO_validPortfolio_returnsCorrectDTO() {
        PortfolioHoldingResponseDTO result = PortfolioMapper.toPortfolioHoldingResponseDTO(applePortfolio);

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.getQuantity()).isEqualTo(10);
        assertThat(result.getAvgCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(result.getTotalCost()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));
        assertThat(result.getLastTradeDate()).isEqualTo("2025-09-20T10:30:00Z");
    }

    @Test
    void toPortfolioHoldingResponseDTO_nullPortfolio_returnsNull() {
        PortfolioHoldingResponseDTO result = PortfolioMapper.toPortfolioHoldingResponseDTO(null);

        assertThat(result).isNull();
    }

    @Test
    void toPortfolioHoldingResponseDTO_portfolioWithNullUpdatedAt_returnsNullLastTradeDate() {
        applePortfolio.setUpdatedAt(null);

        PortfolioHoldingResponseDTO result = PortfolioMapper.toPortfolioHoldingResponseDTO(applePortfolio);

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.getQuantity()).isEqualTo(10);
        assertThat(result.getAvgCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(result.getTotalCost()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));
        assertThat(result.getLastTradeDate()).isNull();
    }

    @Test
    void toEmptyPortfolioHoldingResponseDTO_validSymbol_returnsEmptyDTO() {
        PortfolioHoldingResponseDTO result = PortfolioMapper.toEmptyPortfolioHoldingResponseDTO("TESLA");

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("TESLA");
        assertThat(result.getQuantity()).isEqualTo(0);
        assertThat(result.getAvgCostBasis()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.getTotalCost()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.getLastTradeDate()).isNull();
    }

    @Test
    void toPortfolioHoldingResponseDTOList_validList_returnsCorrectDTOList() {
        List<Portfolio> portfolios = Arrays.asList(applePortfolio, googlePortfolio);

        List<PortfolioHoldingResponseDTO> result = PortfolioMapper.toPortfolioHoldingResponseDTOList(portfolios);

        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);

        PortfolioHoldingResponseDTO appleDTO = result.stream()
                .filter(dto -> "AAPL".equals(dto.getSymbol()))
                .findFirst().orElse(null);
        assertThat(appleDTO).isNotNull();
        assertThat(appleDTO.getQuantity()).isEqualTo(10);
        assertThat(appleDTO.getTotalCost()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));

        PortfolioHoldingResponseDTO googleDTO = result.stream()
                .filter(dto -> "GOOGL".equals(dto.getSymbol()))
                .findFirst().orElse(null);
        assertThat(googleDTO).isNotNull();
        assertThat(googleDTO.getQuantity()).isEqualTo(5);
        assertThat(googleDTO.getTotalCost()).isEqualByComparingTo(BigDecimal.valueOf(600.00));
    }

    @Test
    void toPortfolioHoldingResponseDTOList_nullList_returnsNull() {
        List<PortfolioHoldingResponseDTO> result = PortfolioMapper.toPortfolioHoldingResponseDTOList(null);

        assertThat(result).isNull();
    }

    @Test
    void toPortfolioHoldingResponseDTOList_emptyList_returnsEmptyList() {
        List<PortfolioHoldingResponseDTO> result = PortfolioMapper
                .toPortfolioHoldingResponseDTOList(Collections.emptyList());

        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }

    @Test
    void toWalletBalanceDTO_validWallet_returnsCorrectDTO() {
        BigDecimal totalInvested = BigDecimal.valueOf(2000.00);

        PortfolioResponseDTO.WalletBalanceDTO result = PortfolioMapper.toWalletBalanceDTO(testWallet, totalInvested);

        assertThat(result).isNotNull();
        assertThat(result.getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(3000.00));
        assertThat(result.getTotalValue()).isEqualByComparingTo(BigDecimal.valueOf(5000.00));
        assertThat(result.getTotalInvested()).isEqualByComparingTo(BigDecimal.valueOf(2000.00));
    }

    @Test
    void toWalletBalanceDTO_nullWallet_returnsNull() {
        PortfolioResponseDTO.WalletBalanceDTO result = PortfolioMapper.toWalletBalanceDTO(null,
                BigDecimal.valueOf(1000.00));

        assertThat(result).isNull();
    }

    @Test
    void toPortfolioSummaryDetailsDTO_validTotalValue_returnsCorrectDTO() {
        BigDecimal totalValue = BigDecimal.valueOf(10000.00);

        PortfolioResponseDTO.PortfolioSummaryDetailsDTO result = PortfolioMapper
                .toPortfolioSummaryDetailsDTO(totalValue);

        assertThat(result).isNotNull();
        assertThat(result.getTotalPortfolioValue()).isEqualByComparingTo(BigDecimal.valueOf(10000.00));
        assertThat(result.getTotalUnrealizedPnL()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.getTotalRealizedPnL()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.getTotalPnLPercent()).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void calculateTotalInvested_validPortfolios_returnsCorrectTotal() {
        List<Portfolio> portfolios = Arrays.asList(applePortfolio, googlePortfolio);

        BigDecimal result = PortfolioCalculations.calculateTotalInvested(portfolios);

        assertThat(result).isEqualByComparingTo(BigDecimal.valueOf(2100.00));
    }

    @Test
    void calculateTotalInvested_nullList_returnsZero() {
        BigDecimal result = PortfolioCalculations.calculateTotalInvested(null);

        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void calculateTotalInvested_emptyList_returnsZero() {
        BigDecimal result = PortfolioCalculations.calculateTotalInvested(Collections.emptyList());

        assertThat(result).isEqualByComparingTo(BigDecimal.ZERO);
    }

    @Test
    void toPortfolioResponseDTO_validInputs_returnsCorrectDTO() {
        List<PortfolioHoldingResponseDTO> holdings = Arrays.asList(
                new PortfolioHoldingResponseDTO("AAPL", 10, BigDecimal.valueOf(150.00), BigDecimal.valueOf(1500.00),
                        "2025-09-20T10:30:00Z"));
        PortfolioResponseDTO.WalletBalanceDTO walletBalance = new PortfolioResponseDTO.WalletBalanceDTO(
                BigDecimal.valueOf(3000.00), BigDecimal.valueOf(4500.00), BigDecimal.valueOf(1500.00));
        PortfolioResponseDTO.PortfolioSummaryDetailsDTO summary = new PortfolioResponseDTO.PortfolioSummaryDetailsDTO(
                BigDecimal.valueOf(4500.00), BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);

        PortfolioResponseDTO result = PortfolioMapper.toPortfolioResponseDTO(holdings, walletBalance, summary);

        assertThat(result).isNotNull();
        assertThat(result.getHoldings()).hasSize(1);
        assertThat(result.getWalletBalance()).isEqualTo(walletBalance);
        assertThat(result.getSummary()).isEqualTo(summary);
    }
}
