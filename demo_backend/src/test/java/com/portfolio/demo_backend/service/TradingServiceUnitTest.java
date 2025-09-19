package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.exception.price.PriceUnavailableException;
import com.portfolio.demo_backend.exception.trading.*;
import com.portfolio.demo_backend.repository.WalletRepository;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.TransactionRepository;
import com.portfolio.demo_backend.repository.SymbolRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TradingServiceUnitTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private PortfolioRepository portfolioRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private PriceService priceService;

    @Mock
    private UserService userService;

    @InjectMocks
    private TradingService tradingService;

    private User testUser;
    private Wallet testWallet;
    private YahooQuoteDTO testQuote;
    private Symbol testSymbol;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testWallet = new Wallet();
        testWallet.setUserId(1L);
        testWallet.setCashBalance(new BigDecimal("5000.00"));

        testQuote = new YahooQuoteDTO();
        testQuote.setSymbol("AAPL");
        testQuote.setPrice(150.0);

        testSymbol = new Symbol();
        testSymbol.setSymbol("AAPL");
        testSymbol.setName("Apple Inc.");
        testSymbol.setEnabled(true);
    }

    @Test
    void executeBuyOrder_withSufficientFunds_completesSuccessfully() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TradeExecutionResponse response = tradingService.executeBuyOrder(userId, request);

        assertNotNull(response);
        assertTrue(response.getMessage().contains("Successfully bought 10 shares of AAPL"));
        assertEquals("AAPL", response.getSymbol());
        assertEquals(10, response.getQuantity());
        assertEquals(new BigDecimal("150.0"), response.getExecutionPrice());
        assertEquals(new BigDecimal("1500.0"), response.getTotalAmount());
        assertEquals(TransactionType.BUY, response.getTransactionType());
        assertEquals(new BigDecimal("3500.00"), response.getNewCashBalance());
        assertEquals(10, response.getNewSharesOwned());

        verify(walletRepository).save(any(Wallet.class));
        verify(portfolioRepository).save(any(Portfolio.class));
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void executeBuyOrder_withInsufficientFunds_throws() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(100);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));

        InsufficientFundsException exception = assertThrows(InsufficientFundsException.class, () -> {
            tradingService.executeBuyOrder(userId, request);
        });

        assertTrue(exception.getMessage().contains("Insufficient funds"));
    }

    @Test
    void executeSellOrder_withSufficientShares_completesSuccessfully() {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(1L);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("140.00"));

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.of(portfolio));
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TradeExecutionResponse response = tradingService.executeSellOrder(userId, request);

        assertNotNull(response);
        assertTrue(response.getMessage().contains("Successfully sold 5 shares of AAPL"));
        assertEquals("AAPL", response.getSymbol());
        assertEquals(5, response.getQuantity());
        assertEquals(new BigDecimal("150.0"), response.getExecutionPrice());
        assertEquals(new BigDecimal("750.0"), response.getTotalAmount());
        assertEquals(TransactionType.SELL, response.getTransactionType());
        assertEquals(new BigDecimal("5750.00"), response.getNewCashBalance());
        assertEquals(5, response.getNewSharesOwned());

        verify(walletRepository).save(any(Wallet.class));
        verify(portfolioRepository).save(any(Portfolio.class));
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void executeSellOrder_withInsufficientShares_throws() {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(15);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(1L);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("140.00"));

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.of(portfolio));

        InsufficientSharesException exception = assertThrows(InsufficientSharesException.class, () -> {
            tradingService.executeSellOrder(userId, request);
        });

        assertTrue(exception.getMessage().contains("Insufficient shares"));
    }

    @Test
    void getPortfolioSummary_withEmptyPortfolio_returnsOnlyCash() {
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));
        when(portfolioRepository.findByUserId(1L)).thenReturn(List.of());

        PortfolioSummaryDTO summary = tradingService.getPortfolioSummary(userId);

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

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));
        when(portfolioRepository.findByUserId(1L)).thenReturn(List.of(portfolio));
        when(priceService.getAllCurrentPrices()).thenReturn(java.util.Map.of("AAPL", testQuote));

        PortfolioSummaryDTO summary = tradingService.getPortfolioSummary(userId);

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
    void executeBuyOrder_withMissingWallet_throws() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.empty());

        WalletNotFoundException exception = assertThrows(WalletNotFoundException.class, () -> {
            tradingService.executeBuyOrder(userId, request);
        });

        assertTrue(exception.getMessage().contains("Wallet not found for user: testuser"));
    }

    @Test
    void executeBuyOrder_withUnavailablePrice_throws() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(null);

        PriceUnavailableException exception = assertThrows(PriceUnavailableException.class, () -> {
            tradingService.executeBuyOrder(userId, request);
        });

        assertEquals("Unable to get current price for symbol: AAPL", exception.getMessage());
    }

    @Test
    void executeSellOrder_withMissingWallet_throws() {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(1L);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("140.00"));

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.of(portfolio));
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.empty());

        WalletNotFoundException exception = assertThrows(WalletNotFoundException.class, () -> {
            tradingService.executeSellOrder(userId, request);
        });

        assertTrue(exception.getMessage().contains("Wallet not found for user: testuser"));
    }

    @Test
    void executeSellOrder_withUnavailablePrice_throws() {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(null);

        PriceUnavailableException exception = assertThrows(PriceUnavailableException.class, () -> {
            tradingService.executeSellOrder(userId, request);
        });

        assertEquals("Unable to get current price for symbol: AAPL", exception.getMessage());
    }

    @Test
    void executeSellOrder_withMissingPosition_throws() {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.empty());

        PositionNotFoundException exception = assertThrows(PositionNotFoundException.class, () -> {
            tradingService.executeSellOrder(userId, request);
        });

        assertEquals("No position found for symbol: AAPL", exception.getMessage());
    }

    @Test
    void getPortfolioSummary_withMissingWallet_throws() {
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.empty());

        WalletNotFoundException exception = assertThrows(WalletNotFoundException.class, () -> {
            tradingService.getPortfolioSummary(userId);
        });

        assertTrue(exception.getMessage().contains("Wallet not found for user: testuser"));
    }

    @Test
    void getTransactionHistory_returnsCorrectHistory() {
        Long userId = 1L;

        Transaction transaction1 = new Transaction();
        transaction1.setUserId(userId);
        transaction1.setSymbol(testSymbol);
        transaction1.setType(TransactionType.BUY);
        transaction1.setQuantity(10);

        Transaction transaction2 = new Transaction();
        transaction2.setUserId(userId);
        transaction2.setSymbol(testSymbol);
        transaction2.setType(TransactionType.SELL);
        transaction2.setQuantity(5);

        List<Transaction> expectedHistory = List.of(transaction1, transaction2);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(transactionRepository.findByUserIdOrderByExecutedAtDesc(userId)).thenReturn(expectedHistory);

        List<Transaction> actualHistory = tradingService.getTransactionHistory(userId);

        assertNotNull(actualHistory);
        assertEquals(2, actualHistory.size());
        assertEquals(expectedHistory, actualHistory);
        verify(transactionRepository).findByUserIdOrderByExecutedAtDesc(userId);
    }
}
