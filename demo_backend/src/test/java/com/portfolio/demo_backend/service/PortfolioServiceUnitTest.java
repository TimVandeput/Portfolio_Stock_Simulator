package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.portfolio.PortfolioDataException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.service.data.UserPortfolioData;
import com.portfolio.demo_backend.service.data.UserHoldingData;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.EnumSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PortfolioServiceUnitTest {

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private UserService userService;

    @Mock
    private WalletService walletService;

    @InjectMocks
    private PortfolioService portfolioService;

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
    void getUserPortfolio_withEmptyPortfolio_returnsCorrectStructure() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserId(1L)).thenReturn(Collections.emptyList());

        UserPortfolioData result = portfolioService.getUserPortfolio(1L);

        assertThat(result).isNotNull();
        assertThat(result.getPortfolios()).isEmpty();

        assertThat(result.getWallet()).isNotNull();
        assertThat(result.getWallet().getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(3000.00));
        assertThat(result.getTotalValue()).isNotNull();
        assertThat(result.getTotalInvested()).isEqualByComparingTo(BigDecimal.ZERO);

        assertThat(result.getTotalPL()).isNotNull();

        verify(userService).getUserById(1L);
        verify(walletService).getUserWallet(1L, "testuser");
        verify(portfolioRepository).findByUserId(1L);
    }

    @Test
    void getUserPortfolio_withMultipleHoldings_returnsCorrectCalculations() {
        List<Portfolio> portfolios = Arrays.asList(applePortfolio, googlePortfolio);
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserId(1L)).thenReturn(portfolios);

        UserPortfolioData result = portfolioService.getUserPortfolio(1L);

        assertThat(result).isNotNull();
        assertThat(result.getPortfolios()).hasSize(2);

        Portfolio appleHolding = result.getPortfolios().stream()
                .filter(h -> "AAPL".equals(h.getSymbol().getSymbol()))
                .findFirst().orElse(null);
        assertThat(appleHolding).isNotNull();
        assertThat(appleHolding.getSymbol().getSymbol()).isEqualTo("AAPL");
        assertThat(appleHolding.getSharesOwned()).isEqualTo(10);
        assertThat(appleHolding.getAverageCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(appleHolding.getAverageCostBasis()
                .multiply(BigDecimal.valueOf(appleHolding.getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(1500.00));

        Portfolio googleHolding = result.getPortfolios().stream()
                .filter(h -> "GOOGL".equals(h.getSymbol().getSymbol()))
                .findFirst().orElse(null);
        assertThat(googleHolding).isNotNull();
        assertThat(googleHolding.getSymbol().getSymbol()).isEqualTo("GOOGL");
        assertThat(googleHolding.getSharesOwned()).isEqualTo(5);
        assertThat(googleHolding.getAverageCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(120.00));
        assertThat(googleHolding.getAverageCostBasis()
                .multiply(BigDecimal.valueOf(googleHolding.getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(600.00));

        assertThat(result.getWallet().getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(3000.00));
        assertThat(result.getTotalInvested()).isEqualByComparingTo(BigDecimal.valueOf(2100.00));

        assertThat(result.getTotalValue()).isNotNull();

        verify(userService).getUserById(1L);
        verify(walletService).getUserWallet(1L, "testuser");
        verify(portfolioRepository).findByUserId(1L);
    }

    @Test
    void getUserHolding_existingSymbol_returnsCorrectHolding() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL"))
                .thenReturn(Optional.of(applePortfolio));

        UserHoldingData result = portfolioService.getUserHolding(1L, "AAPL");

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.isHasHolding()).isTrue();
        assertThat(result.getPortfolio().getSharesOwned()).isEqualTo(10);
        assertThat(result.getPortfolio().getAverageCostBasis())
                .isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(result.getPortfolio().getAverageCostBasis()
                .multiply(BigDecimal.valueOf(result.getPortfolio().getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(1500.00));

        verify(userService).getUserById(1L);
        verify(portfolioRepository).findByUserIdAndSymbol_Symbol(1L, "AAPL");
    }

    @Test
    void getUserHolding_nonExistentSymbol_returnsEmptyHolding() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "NONEXISTENT")).thenReturn(Optional.empty());

        UserHoldingData result = portfolioService.getUserHolding(1L, "NONEXISTENT");

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("NONEXISTENT");
        assertThat(result.isHasHolding()).isFalse();
        assertThat(result.getPortfolio()).isNull();

        verify(userService).getUserById(1L);
        verify(portfolioRepository).findByUserIdAndSymbol_Symbol(1L, "NONEXISTENT");
    }

    @Test
    void getUserHolding_portfolioWithNullUpdatedAt_returnsNullLastTradeDate() {
        applePortfolio.setUpdatedAt(null);
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL"))
                .thenReturn(Optional.of(applePortfolio));

        UserHoldingData result = portfolioService.getUserHolding(1L, "AAPL");

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        assertThat(result.isHasHolding()).isTrue();
        assertThat(result.getPortfolio().getSharesOwned()).isEqualTo(10);
        assertThat(result.getPortfolio().getAverageCostBasis())
                .isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(result.getPortfolio().getAverageCostBasis()
                .multiply(BigDecimal.valueOf(result.getPortfolio().getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(1500.00));

        verify(userService).getUserById(1L);
        verify(portfolioRepository).findByUserIdAndSymbol_Symbol(1L, "AAPL");
    }

    @Test
    void getUserPortfolio_singleHolding_correctMathematicalCalculations() {
        Portfolio singlePortfolio = new Portfolio();
        singlePortfolio.setId(1L);
        singlePortfolio.setUserId(1L);
        singlePortfolio.setUser(testUser);
        singlePortfolio.setSymbol(appleSymbol);
        singlePortfolio.setSharesOwned(7);
        singlePortfolio.setAverageCostBasis(BigDecimal.valueOf(142.85));

        when(userService.getUserById(1L)).thenReturn(testUser);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserId(1L)).thenReturn(Collections.singletonList(singlePortfolio));

        UserPortfolioData result = portfolioService.getUserPortfolio(1L);

        assertThat(result).isNotNull();
        assertThat(result.getPortfolios()).hasSize(1);

        Portfolio holding = result.getPortfolios().get(0);
        assertThat(holding.getSymbol().getSymbol()).isEqualTo("AAPL");
        assertThat(holding.getSharesOwned()).isEqualTo(7);
        assertThat(holding.getAverageCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(142.85));
        assertThat(holding.getAverageCostBasis().multiply(BigDecimal.valueOf(holding.getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(999.95));

        assertThat(result.getWallet().getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(3000.00));
        assertThat(result.getTotalInvested()).isEqualByComparingTo(BigDecimal.valueOf(999.95));
        assertThat(result.getTotalValue()).isNotNull();

        verify(userService).getUserById(1L);
        verify(walletService).getUserWallet(1L, "testuser");
        verify(portfolioRepository).findByUserId(1L);
    }

    @Test
    void getUserPortfolio_invalidUserId_throwsIllegalArgumentException() {
        assertThatThrownBy(() -> portfolioService.getUserPortfolio(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User ID cannot be null");

        assertThatThrownBy(() -> portfolioService.getUserPortfolio(0L))
                .isInstanceOf(PortfolioDataException.class)
                .hasMessage("Portfolio data error: Failed to retrieve portfolio data");

        assertThatThrownBy(() -> portfolioService.getUserPortfolio(-1L))
                .isInstanceOf(PortfolioDataException.class)
                .hasMessage("Portfolio data error: Failed to retrieve portfolio data");
    }

    @Test
    void getUserPortfolio_userNotFound_throwsUserNotFoundException() {
        when(userService.getUserById(999L)).thenThrow(new UserNotFoundException(999L));

        assertThatThrownBy(() -> portfolioService.getUserPortfolio(999L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found with id: 999");
    }

    @Test
    void getUserPortfolio_walletNotFound_throwsWalletNotFoundException() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(null);

        assertThatThrownBy(() -> portfolioService.getUserPortfolio(1L))
                .isInstanceOf(WalletNotFoundException.class)
                .hasMessage("Wallet not found for user: testuser");
    }

    @Test
    void getUserPortfolio_repositoryException_throwsPortfolioDataException() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserId(1L)).thenThrow(new RuntimeException("Database error"));

        assertThatThrownBy(() -> portfolioService.getUserPortfolio(1L))
                .isInstanceOf(PortfolioDataException.class)
                .hasMessage("Portfolio data error: Failed to retrieve portfolio data");
    }

    @Test
    void getUserHolding_invalidUserId_throwsIllegalArgumentException() {
        assertThatThrownBy(() -> portfolioService.getUserHolding(null, "AAPL"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("User ID cannot be null");
    }

    @Test
    void getUserHolding_invalidSymbol_throwsIllegalArgumentException() {
        assertThatThrownBy(() -> portfolioService.getUserHolding(1L, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Symbol cannot be null or empty");

        assertThatThrownBy(() -> portfolioService.getUserHolding(1L, ""))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Symbol cannot be null or empty");

        assertThatThrownBy(() -> portfolioService.getUserHolding(1L, "   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Symbol cannot be null or empty");
    }

    @Test
    void getUserHolding_userNotFound_throwsUserNotFoundException() {
        when(userService.getUserById(999L)).thenThrow(new UserNotFoundException(999L));

        assertThatThrownBy(() -> portfolioService.getUserHolding(999L, "AAPL"))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("User not found with id: 999");
    }

    @Test
    void getUserHolding_repositoryException_throwsPortfolioDataException() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL"))
                .thenThrow(new RuntimeException("Database error"));

        assertThatThrownBy(() -> portfolioService.getUserHolding(1L, "AAPL"))
                .isInstanceOf(PortfolioDataException.class)
                .hasMessage("Portfolio data error: Failed to retrieve holding data for symbol: AAPL");
    }

    @Test
    void getUserHolding_symbolNormalization_worksCorrectly() {
        when(userService.getUserById(1L)).thenReturn(testUser);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL"))
                .thenReturn(Optional.of(applePortfolio));

        UserHoldingData result = portfolioService.getUserHolding(1L, "  aapl  ");

        assertThat(result).isNotNull();
        assertThat(result.getSymbol()).isEqualTo("AAPL");
        verify(portfolioRepository).findByUserIdAndSymbol_Symbol(1L, "AAPL");
    }
}
