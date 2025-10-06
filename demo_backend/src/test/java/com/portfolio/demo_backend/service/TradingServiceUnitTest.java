package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.exception.trading.*;
import com.portfolio.demo_backend.mapper.TradingMapper;
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
    private PortfolioRepository portfolioRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private SymbolRepository symbolRepository;

    @Mock
    private PriceService priceService;

    @Mock
    private UserService userService;

    @Mock
    private WalletService walletService;

    @Mock
    private TradingMapper tradingMapper;

    @Mock
    private NotificationService notificationService;

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

    private void stubTradeExecutionResponse() {
        when(tradingMapper.toTradeExecutionResponse(any(Transaction.class), any(BigDecimal.class), anyInt()))
                .thenAnswer(invocation -> {
                    Transaction tx = invocation.getArgument(0);
                    BigDecimal newCash = invocation.getArgument(1);
                    Integer shares = invocation.getArgument(2);
                    TradeExecutionResponse resp = new TradeExecutionResponse();
                    if (tx.getSymbol() != null) {
                        resp.setSymbol(tx.getSymbol().getSymbol());
                    }
                    resp.setQuantity(tx.getQuantity());
                    resp.setExecutionPrice(tx.getPricePerShare());
                    resp.setTotalAmount(tx.getTotalAmount());
                    resp.setTransactionType(tx.getType());
                    resp.setExecutedAt(tx.getExecutedAt());
                    resp.setNewCashBalance(newCash);
                    resp.setNewSharesOwned(shares);
                    String verb = tx.getType() == TransactionType.BUY ? "bought" : "sold";
                    String sym = tx.getSymbol() != null ? tx.getSymbol().getSymbol() : "";
                    resp.setMessage("Successfully " + verb + " " + tx.getQuantity() + " shares of " + sym);
                    return resp;
                });
    }

    @Test
    void executeBuyOrder_withSufficientFunds_completesSuccessfully() {
        stubTradeExecutionResponse();
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
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

        verify(walletService).updateWalletBalance(eq(1L), eq(new BigDecimal("3500.00")));
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
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);

        InsufficientFundsException exception = assertThrows(InsufficientFundsException.class, () -> {
            tradingService.executeBuyOrder(userId, request);
        });

        assertTrue(exception.getMessage().contains("Insufficient funds"));
    }

    @Test
    void executeSellOrder_withSufficientShares_completesSuccessfully() {
        stubTradeExecutionResponse();
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
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
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

        verify(walletService).updateWalletBalance(eq(1L), eq(new BigDecimal("5750.00")));
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
        when(transactionRepository.findByUserIdWithSymbolOrderByExecutedAtDesc(userId)).thenReturn(expectedHistory);

        List<Transaction> actualHistory = tradingService.getTransactionHistory(userId);

        assertNotNull(actualHistory);
        assertEquals(2, actualHistory.size());
        assertEquals(expectedHistory, actualHistory);
        verify(transactionRepository).findByUserIdWithSymbolOrderByExecutedAtDesc(userId);
    }

    @Test
    void executeSellOrder_withTransactionHistory_calculatesCorrectProfitLoss() {
        stubTradeExecutionResponse();
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

        Transaction buyTransaction = new Transaction();
        buyTransaction.setUserId(userId);
        buyTransaction.setSymbol(testSymbol);
        buyTransaction.setType(TransactionType.BUY);
        buyTransaction.setQuantity(10);
        buyTransaction.setPricePerShare(new BigDecimal("120.00"));
        buyTransaction.setTotalAmount(new BigDecimal("1200.00"));

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.of(portfolio));
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL"))
                .thenReturn(List.of(buyTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction saved = invocation.getArgument(0);
            assertEquals(new BigDecimal("150.00"), saved.getProfitLoss());
            return saved;
        });

        TradeExecutionResponse response = tradingService.executeSellOrder(userId, request);

        assertNotNull(response);
        assertTrue(response.getMessage().contains("Successfully sold 5 shares of AAPL"));

        verify(transactionRepository).findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL");
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void executeSellOrder_withMultipleBuyTransactions_usesFIFOForProfitLoss() {
        stubTradeExecutionResponse();
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(8);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(1L);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(15);
        portfolio.setAverageCostBasis(new BigDecimal("115.00"));

        Transaction buyTransaction1 = new Transaction();
        buyTransaction1.setUserId(userId);
        buyTransaction1.setSymbol(testSymbol);
        buyTransaction1.setType(TransactionType.BUY);
        buyTransaction1.setQuantity(5);
        buyTransaction1.setPricePerShare(new BigDecimal("100.00"));

        Transaction buyTransaction2 = new Transaction();
        buyTransaction2.setUserId(userId);
        buyTransaction2.setSymbol(testSymbol);
        buyTransaction2.setType(TransactionType.BUY);
        buyTransaction2.setQuantity(10);
        buyTransaction2.setPricePerShare(new BigDecimal("120.00"));

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.of(portfolio));
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL"))
                .thenReturn(List.of(buyTransaction1, buyTransaction2));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction saved = invocation.getArgument(0);

            assertEquals(new BigDecimal("340.00"), saved.getProfitLoss());
            return saved;
        });

        TradeExecutionResponse response = tradingService.executeSellOrder(userId, request);

        assertNotNull(response);
        assertTrue(response.getMessage().contains("Successfully sold 8 shares of AAPL"));

        verify(transactionRepository).findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL");
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void executeSellOrder_withNoTransactionHistory_setsNullProfitLoss() {
        stubTradeExecutionResponse();
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
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL"))
                .thenReturn(List.of());
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction saved = invocation.getArgument(0);
            assertNull(saved.getProfitLoss());
            return saved;
        });

        TradeExecutionResponse response = tradingService.executeSellOrder(userId, request);

        assertNotNull(response);
        assertTrue(response.getMessage().contains("Successfully sold 5 shares of AAPL"));

        verify(transactionRepository).findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL");
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void executeBuyOrder_doesNotCalculateProfitLoss() {
        stubTradeExecutionResponse();
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction saved = invocation.getArgument(0);
            assertNull(saved.getProfitLoss());
            return saved;
        });

        TradeExecutionResponse response = tradingService.executeBuyOrder(userId, request);

        assertNotNull(response);
        assertTrue(response.getMessage().contains("Successfully bought 10 shares of AAPL"));

        verify(transactionRepository).save(any(Transaction.class));
        verify(transactionRepository, never()).findByUserIdAndSymbolOrderByExecutedAtAsc(anyLong(), anyString());
    }

    @Test
    void executeBuy_sendsTradeNotification() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userService.getAllUsers()).thenReturn(List.of(testUser)); // For getSystemUserId()

        tradingService.executeBuy(userId, request);

        verify(notificationService).sendToUser(
                eq(1L),
                eq(1L),
                eq("📈 Trade Executed - AAPL"),
                argThat(body -> body.contains("buy order has been successfully executed") &&
                        body.contains("Symbol: <strong>AAPL</strong>") &&
                        body.contains("Quantity: 10 shares") &&
                        body.contains("Price per Share: $150") &&
                        body.contains("Total Amount: $1500") &&
                        body.contains("<a href='/portfolio'>Portfolio</a>")));
    }

    @Test
    void executeSell_sendsTradeNotificationWithProfitLoss() {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);
        request.setExpectedPrice(new BigDecimal("160.0"));
        Long userId = 1L;

        Portfolio existingPortfolio = new Portfolio();
        existingPortfolio.setUserId(userId);
        existingPortfolio.setSymbol(testSymbol);
        existingPortfolio.setSharesOwned(10);
        existingPortfolio.setAverageCostBasis(new BigDecimal("140.0"));

        Transaction buyTransaction = new Transaction();
        buyTransaction.setUserId(userId);
        buyTransaction.setSymbol(testSymbol);
        buyTransaction.setType(TransactionType.BUY);
        buyTransaction.setQuantity(10);
        buyTransaction.setPricePerShare(new BigDecimal("140.0"));

        when(userService.getUserById(userId)).thenReturn(testUser);
        YahooQuoteDTO sellQuote = new YahooQuoteDTO();
        sellQuote.setSymbol("AAPL");
        sellQuote.setPrice(160.0);
        sellQuote.setChange(10.0);
        sellQuote.setChangePercent(6.67);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(sellQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.of(existingPortfolio));
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.findByUserIdAndSymbolOrderByExecutedAtAsc(1L, "AAPL"))
                .thenReturn(List.of(buyTransaction));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userService.getAllUsers()).thenReturn(List.of(testUser)); // For getSystemUserId()

        tradingService.executeSell(userId, request);

        verify(notificationService).sendToUser(
                eq(1L),
                eq(1L),
                eq("📉 Trade Executed - AAPL"),
                argThat(body -> body.contains("sell order has been successfully executed") &&
                        body.contains("Symbol: <strong>AAPL</strong>") &&
                        body.contains("Quantity: 5 shares") &&
                        body.contains("Price per Share: $160") &&
                        body.contains("Total Amount: $800") &&
                        body.contains("Profit/Loss: +$100") &&
                        body.contains("<a href='/portfolio'>Portfolio</a>")));
    }

    @Test
    void executeBuy_notificationFails_doesNotThrowException() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(new BigDecimal("150.0"));
        Long userId = 1L;

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(1L, "testuser")).thenReturn(testWallet);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(1L, "AAPL")).thenReturn(Optional.empty());
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(userService.getAllUsers()).thenReturn(List.of(testUser));

        doThrow(new RuntimeException("Notification failed")).when(notificationService)
                .sendToUser(anyLong(), anyLong(), anyString(), anyString());

        assertDoesNotThrow(() -> tradingService.executeBuy(userId, request));

        verify(transactionRepository).save(any(Transaction.class));
        verify(notificationService).sendToUser(anyLong(), anyLong(), anyString(), anyString());
    }
}
