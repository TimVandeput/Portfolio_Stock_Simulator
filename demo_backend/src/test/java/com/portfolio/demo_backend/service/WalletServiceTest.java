package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private PriceService priceService;

    @Mock
    private UserService userService;

    @InjectMocks
    private WalletService walletService;

    private User testUser;
    private Wallet testWallet;
    private Symbol testSymbol;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testWallet = new Wallet();
        testWallet.setUserId(1L);
        testWallet.setCashBalance(new BigDecimal("5000.00"));

        testSymbol = new Symbol();
        testSymbol.setSymbol("AAPL");
        testSymbol.setName("Apple Inc.");
        testSymbol.setEnabled(true);
    }

    @Test
    void getPortfolioSummary_withEmptyPortfolio_returnsOnlyCash() {
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));
        when(portfolioRepository.findByUserId(1L)).thenReturn(List.of());

        PortfolioSummaryDTO summary = walletService.getPortfolioSummary(userId);

        assertNotNull(summary);
        assertEquals(new BigDecimal("5000.00"), summary.getCashBalance());
        assertEquals(BigDecimal.ZERO, summary.getTotalMarketValue());
        assertEquals(new BigDecimal("5000.00"), summary.getTotalPortfolioValue());
        assertEquals(BigDecimal.ZERO, summary.getTotalUnrealizedGainLoss());
        assertTrue(summary.getHoldings().isEmpty());
    }

    @Test
    void getPortfolioSummary_withHoldings_calculatesCorrectly() {
        Long userId = 1L;

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(1L);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("140.00"));

        YahooQuoteDTO testQuote = new YahooQuoteDTO();
        testQuote.setSymbol("AAPL");
        testQuote.setPrice(150.0);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));
        when(portfolioRepository.findByUserId(1L)).thenReturn(List.of(portfolio));
        when(priceService.getAllCurrentPrices()).thenReturn(Map.of("AAPL", testQuote));

        PortfolioSummaryDTO summary = walletService.getPortfolioSummary(userId);

        assertNotNull(summary);
        assertEquals(new BigDecimal("5000.00"), summary.getCashBalance());
        assertEquals(new BigDecimal("1500.0"), summary.getTotalMarketValue());
        assertEquals(new BigDecimal("6500.00"), summary.getTotalPortfolioValue());
        assertEquals(new BigDecimal("100.00"), summary.getTotalUnrealizedGainLoss());
        assertEquals(1, summary.getHoldings().size());

        var holding = summary.getHoldings().get(0);
        assertEquals("AAPL", holding.getSymbol());
        assertEquals(10, holding.getShares());
        assertEquals(new BigDecimal("140.00"), holding.getAverageCost());
        assertEquals(new BigDecimal("150.0"), holding.getCurrentPrice());
        assertEquals(new BigDecimal("1500.0"), holding.getMarketValue());
        assertEquals(new BigDecimal("100.00"), holding.getUnrealizedGainLoss());
    }

    @Test
    void addCashToWallet_updatesBalance() {
        Long userId = 1L;
        BigDecimal amount = new BigDecimal("1000.00");
        String reason = "Admin bonus";

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));

        walletService.addCashToWallet(userId, amount, reason);

        assertEquals(new BigDecimal("6000.00"), testWallet.getCashBalance());
        verify(walletRepository).save(testWallet);
    }

    @Test
    void updateWalletBalance_setsNewBalance() {
        Long userId = 1L;
        BigDecimal newBalance = new BigDecimal("3500.00");

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));

        walletService.updateWalletBalance(userId, newBalance);

        assertEquals(newBalance, testWallet.getCashBalance());
        verify(walletRepository).save(testWallet);
    }

    @Test
    void getUserWallet_withMissingWallet_throws() {
        Long userId = 1L;
        String username = "testuser";

        when(walletRepository.findByUserId(1L)).thenReturn(Optional.empty());

        WalletNotFoundException exception = assertThrows(WalletNotFoundException.class, () -> {
            walletService.getUserWallet(userId, username);
        });

        assertTrue(exception.getMessage().contains("Wallet not found for user: testuser"));
    }

    @Test
    void getUserWallet_returnsWallet() {
        Long userId = 1L;
        String username = "testuser";

        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));

        Wallet result = walletService.getUserWallet(userId, username);

        assertNotNull(result);
        assertEquals(testWallet, result);
    }
}
