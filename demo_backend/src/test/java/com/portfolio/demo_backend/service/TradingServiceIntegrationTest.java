package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.exception.trading.InsufficientFundsException;
import com.portfolio.demo_backend.exception.trading.InsufficientSharesException;
import com.portfolio.demo_backend.exception.trading.PositionNotFoundException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.repository.*;
import com.portfolio.demo_backend.service.data.TradeExecutionData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;

/**
 * Integration tests for {@link TradingService}.
 * 
 * These tests verify the complete trading workflow including database
 * persistence,
 * transaction rollbacks, and integration with external services using an
 * in-memory H2 database.
 * External dependencies (PriceService, NotificationService) are mocked to
 * isolate trading logic.
 *
 * @author Portfolio Team
 * @since 1.0
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TradingServiceIntegrationTest {

    /**
     * Test configuration providing mocked external dependencies.
     * PriceService is mocked to avoid external API calls during testing.
     * NotificationService is mocked to isolate trading logic verification.
     */
    @TestConfiguration
    static class MockServiceConfig {
        @Bean
        @Primary
        public PriceService priceService() {
            return mock(PriceService.class);
        }

        @Bean
        @Primary
        public NotificationService notificationService() {
            return mock(NotificationService.class);
        }
    }

    @Autowired
    private TradingService tradingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private SymbolRepository symbolRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private PriceService priceService;

    @Autowired
    private NotificationService notificationService;

    private User testUser;
    private Symbol testSymbol;
    private Wallet testWallet;

    @BeforeEach
    void setUp() {
        // Clean up data
        transactionRepository.deleteAll();
        portfolioRepository.deleteAll();
        walletRepository.deleteAll();
        symbolRepository.deleteAll();
        userRepository.deleteAll();

        // Reset mocks
        reset(priceService);
        reset(notificationService);

        // Create test user
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedpassword");
        testUser = userRepository.save(testUser);

        // Create test wallet
        testWallet = new Wallet();
        testWallet.setUser(testUser);
        testWallet.setCashBalance(new BigDecimal("10000.00"));
        testWallet = walletRepository.save(testWallet);

        // Create test symbol
        testSymbol = new Symbol();
        testSymbol.setSymbol("AAPL");
        testSymbol.setName("Apple Inc.");
        testSymbol.setEnabled(true);
        testSymbol = symbolRepository.save(testSymbol);

        // Mock price service
        YahooQuoteDTO mockQuote = new YahooQuoteDTO();
        mockQuote.setSymbol("AAPL");
        mockQuote.setPrice(150.0);
        when(priceService.getCurrentPrice(anyString())).thenReturn(mockQuote);
    }

    // ================ BUY ORDER INTEGRATION TESTS ================

    /**
     * Tests that a valid buy order creates a transaction and updates the portfolio.
     */
    @Test
    void executeBuy_validOrder_createsTransactionAndPortfolio() {
        // Given: A user with sufficient funds and a valid symbol
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);

        // When: A buy order is executed
        TradeExecutionData result = tradingService.executeBuy(testUser.getId(), request);

        // Then: Transaction is created, portfolio is updated, and wallet balance is
        // reduced
        assertThat(result).isNotNull();
        assertThat(result.getTransaction()).isNotNull();
        assertThat(result.getTransaction().getType()).isEqualTo(TransactionType.BUY);
        assertThat(result.getTransaction().getQuantity()).isEqualTo(10);
        assertThat(result.getTransaction().getPricePerShare()).isEqualByComparingTo(new BigDecimal("150.00"));
        assertThat(result.getTransaction().getTotalAmount()).isEqualByComparingTo(new BigDecimal("1500.00"));
        assertThat(result.getNewCashBalance()).isEqualByComparingTo(new BigDecimal("8500.00"));
        assertThat(result.getNewSharesOwned()).isEqualTo(10);

        // Verify database state
        Wallet updatedWallet = walletRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedWallet.getCashBalance()).isEqualByComparingTo(new BigDecimal("8500.00"));

        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(testUser.getId(), "AAPL").orElseThrow();
        assertThat(portfolio.getSharesOwned()).isEqualTo(10);
        assertThat(portfolio.getAverageCostBasis()).isEqualByComparingTo(new BigDecimal("150.0000"));

        List<Transaction> transactions = transactionRepository
                .findByUserIdWithSymbolOrderByExecutedAtDesc(testUser.getId());
        assertThat(transactions).hasSize(1);
        assertThat(transactions.get(0).getType()).isEqualTo(TransactionType.BUY);
    }

    /**
     * Tests that insufficient funds throws an exception and makes no database
     * changes.
     */
    @Test
    void executeBuy_insufficientFunds_throws() {
        // Given: A user with insufficient funds for the requested buy order
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(100); // $15,000 worth - more than available balance

        // When: A buy order is executed
        // Then: InsufficientFundsException is thrown and no database changes occur
        assertThatThrownBy(() -> tradingService.executeBuy(testUser.getId(), request))
                .isInstanceOf(InsufficientFundsException.class);
        Wallet wallet = walletRepository.findById(testUser.getId()).orElseThrow();
        assertThat(wallet.getCashBalance()).isEqualByComparingTo(new BigDecimal("10000.00"));

        List<Portfolio> portfolios = portfolioRepository.findByUserId(testUser.getId());
        assertThat(portfolios).isEmpty();

        List<Transaction> transactions = transactionRepository
                .findByUserIdWithSymbolOrderByExecutedAtDesc(testUser.getId());
        assertThat(transactions).isEmpty();
    }

    /**
     * Tests that multiple purchases update the average cost basis correctly.
     */
    @Test
    void executeBuy_multiplePurchases_updatesAverageCostBasis() {
        // Given: Multiple buy orders for the same symbol at different prices
        // Given: First purchase at $100
        BuyOrderRequest request1 = new BuyOrderRequest();
        request1.setSymbol("AAPL");
        request1.setQuantity(10);

        YahooQuoteDTO quote1 = new YahooQuoteDTO();
        quote1.setSymbol("AAPL");
        quote1.setPrice(100.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(quote1);

        tradingService.executeBuy(testUser.getId(), request1);

        BuyOrderRequest request2 = new BuyOrderRequest();
        request2.setSymbol("AAPL");
        request2.setQuantity(10);

        YahooQuoteDTO quote2 = new YahooQuoteDTO();
        quote2.setSymbol("AAPL");
        quote2.setPrice(200.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(quote2);

        // When: Second buy order at $200 is executed
        TradeExecutionData result = tradingService.executeBuy(testUser.getId(), request2);

        // Then: Portfolio average cost basis is correctly calculated using weighted
        // average
        assertThat(result.getNewSharesOwned()).isEqualTo(20);

        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(testUser.getId(), "AAPL").orElseThrow();
        assertThat(portfolio.getSharesOwned()).isEqualTo(20);
        // Average cost should be (10 * 100 + 10 * 200) / 20 = 150
        assertThat(portfolio.getAverageCostBasis()).isEqualByComparingTo(new BigDecimal("150.0000"));

        List<Transaction> transactions = transactionRepository
                .findByUserIdWithSymbolOrderByExecutedAtDesc(testUser.getId());
        assertThat(transactions).hasSize(2);
    }

    // ================ SELL ORDER INTEGRATION TESTS ================

    /**
     * Tests that a valid sell order updates portfolio and wallet correctly.
     */
    @Test
    void executeSell_validOrder_updatesPortfolioAndWallet() {
        // Given: A user with an existing portfolio position
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(20);
        portfolio.setAverageCostBasis(new BigDecimal("100.00"));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);

        // When: A valid sell order is executed
        TradeExecutionData result = tradingService.executeSell(testUser.getId(), request);

        // Then: Portfolio is updated, wallet balance increases, and transaction is
        // recorded
        assertThat(result).isNotNull();
        assertThat(result.getTransaction().getType()).isEqualTo(TransactionType.SELL);
        assertThat(result.getTransaction().getQuantity()).isEqualTo(10);
        assertThat(result.getNewCashBalance()).isEqualByComparingTo(new BigDecimal("11500.00")); // 10000 + 1500
        assertThat(result.getNewSharesOwned()).isEqualTo(10);

        // Verify database state
        Wallet updatedWallet = walletRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedWallet.getCashBalance()).isEqualByComparingTo(new BigDecimal("11500.00"));

        Portfolio updatedPortfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(testUser.getId(), "AAPL")
                .orElseThrow();
        assertThat(updatedPortfolio.getSharesOwned()).isEqualTo(10);
    }

    /**
     * Tests that selling more shares than owned throws an exception.
     */
    @Test
    void executeSell_insufficientShares_throws() {
        // Given: A user trying to sell more shares than they own
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(5);
        portfolio.setAverageCostBasis(new BigDecimal("100.00"));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10); // More than owned

        // When/Then: Sell execution throws InsufficientSharesException and no database
        // changes occur
        assertThatThrownBy(() -> tradingService.executeSell(testUser.getId(), request))
                .isInstanceOf(InsufficientSharesException.class);
        Portfolio unchangedPortfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(testUser.getId(), "AAPL")
                .orElseThrow();
        assertThat(unchangedPortfolio.getSharesOwned()).isEqualTo(5);

        Wallet unchangedWallet = walletRepository.findById(testUser.getId()).orElseThrow();
        assertThat(unchangedWallet.getCashBalance()).isEqualByComparingTo(new BigDecimal("10000.00"));
    }

    /**
     * Tests that selling all shares deletes the portfolio position.
     */
    @Test
    void executeSell_allShares_deletesPosition() {
        // Given: A user selling all their shares in a position
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("100.00"));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10); // Sell all shares

        // When: A sell order for all shares is executed
        TradeExecutionData result = tradingService.executeSell(testUser.getId(), request);

        // Then: Portfolio position is deleted from database
        assertThat(result.getNewSharesOwned()).isEqualTo(0);

        // Verify portfolio is deleted
        assertThat(portfolioRepository.findByUserIdAndSymbol_Symbol(testUser.getId(), "AAPL")).isEmpty();

        // Verify wallet is updated
        Wallet updatedWallet = walletRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedWallet.getCashBalance()).isEqualByComparingTo(new BigDecimal("11500.00"));
    }

    /**
     * Tests that selling with no position throws an exception.
     */
    @Test
    void executeSell_noPosition_throws() {
        // Given: A user with no portfolio position for a symbol (no portfolio exists)
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);

        // When/Then: Attempting to sell throws PositionNotFoundException
        assertThatThrownBy(() -> tradingService.executeSell(testUser.getId(), request))
                .isInstanceOf(PositionNotFoundException.class);
    }

    // ================ PROFIT/LOSS CALCULATION TESTS ================

    /**
     * Tests that simple profit/loss calculation works correctly.
     */
    @Test
    void executeSell_calculatesSimpleProfitLoss() {
        // Given: A portfolio with shares bought at one price (create buy transaction
        // history)
        Transaction buyTransaction = new Transaction();
        buyTransaction.setUserId(testUser.getId());
        buyTransaction.setSymbol(testSymbol);
        buyTransaction.setType(TransactionType.BUY);
        buyTransaction.setQuantity(10);
        buyTransaction.setPricePerShare(new BigDecimal("100.00"));
        buyTransaction.setTotalAmount(new BigDecimal("1000.00"));
        transactionRepository.save(buyTransaction);

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("100.00"));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        // When: Selling at $150 (profit of $50 per share)
        TradeExecutionData result = tradingService.executeSell(testUser.getId(), request);

        // Then: Profit is computed correctly
        assertThat(result.getTransaction().getProfitLoss()).isEqualByComparingTo(new BigDecimal("250.00")); // (150-100)
                                                                                                            // * 5
    }

    /**
     * Tests FIFO profit/loss calculation with multiple purchases.
     */
    @Test
    void executeSell_calculatesFIFOProfitLossWithMultiplePurchases() {
        // Given: Multiple buy transactions at different prices (create multiple buy
        // transactions)
        Transaction buyTransaction1 = new Transaction();
        buyTransaction1.setUserId(testUser.getId());
        buyTransaction1.setSymbol(testSymbol);
        buyTransaction1.setType(TransactionType.BUY);
        buyTransaction1.setQuantity(5);
        buyTransaction1.setPricePerShare(new BigDecimal("100.00"));
        buyTransaction1.setTotalAmount(new BigDecimal("500.00"));
        transactionRepository.save(buyTransaction1);

        Transaction buyTransaction2 = new Transaction();
        buyTransaction2.setUserId(testUser.getId());
        buyTransaction2.setSymbol(testSymbol);
        buyTransaction2.setType(TransactionType.BUY);
        buyTransaction2.setQuantity(5);
        buyTransaction2.setPricePerShare(new BigDecimal("120.00"));
        buyTransaction2.setTotalAmount(new BigDecimal("600.00"));
        transactionRepository.save(buyTransaction2);

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("110.00"));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(7); // Sell 7 shares (5 from first batch + 2 from second)

        // When: Selling at $150
        TradeExecutionData result = tradingService.executeSell(testUser.getId(), request);

        // Then: FIFO calculation yields (150-100)*5 + (150-120)*2 = 250 + 60 = 310
        assertThat(result.getTransaction().getProfitLoss()).isEqualByComparingTo(new BigDecimal("310.00"));
    }

    /**
     * Ensures losses are represented as negative profit when selling below cost
     * basis.
     */
    @Test
    void executeSell_calculatesLossCorrectly() {
        // Given: Shares purchased at a higher price
        Transaction buyTransaction = new Transaction();
        buyTransaction.setUserId(testUser.getId());
        buyTransaction.setSymbol(testSymbol);
        buyTransaction.setType(TransactionType.BUY);
        buyTransaction.setQuantity(10);
        buyTransaction.setPricePerShare(new BigDecimal("200.00"));
        buyTransaction.setTotalAmount(new BigDecimal("2000.00"));
        transactionRepository.save(buyTransaction);

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(new BigDecimal("200.00"));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        // When: Selling at $150 (loss of $50 per share)
        TradeExecutionData result = tradingService.executeSell(testUser.getId(), request);

        // Then: Loss is negative
        assertThat(result.getTransaction().getProfitLoss()).isEqualByComparingTo(new BigDecimal("-250.00"));
    }

    // ================ BUY ORDER - NO PROFIT/LOSS ================

    /**
     * Tests that buy orders do not set profit/loss values.
     */
    @Test
    void executeBuy_doesNotSetProfitLoss() {
        // Given: A buy order request
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);

        // When: Executing the buy order
        TradeExecutionData result = tradingService.executeBuy(testUser.getId(), request);

        // Then: Buy orders should not have profit/loss
        assertThat(result.getTransaction().getProfitLoss()).isNull();
    }

    // ================ TRANSACTION HISTORY TESTS ================

    /**
     * Tests that transaction history returns ordered transactions.
     */
    @Test
    void getTransactionHistory_returnsOrderedTransactions() {
        // Given: Multiple transactions for a user (create some transactions)
        tradingService.executeBuy(testUser.getId(), createBuyRequest("AAPL", 10));

        @SuppressWarnings("unused")
        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(testUser.getId(), "AAPL").orElseThrow();
        tradingService.executeSell(testUser.getId(), createSellRequest("AAPL", 5));

        // When: Fetching transaction history
        List<Transaction> history = tradingService.getTransactionHistory(testUser.getId());

        // Then: History is ordered descending by execution time
        assertThat(history).hasSize(2);
        assertThat(history.get(0).getType()).isEqualTo(TransactionType.SELL); // Most recent first
        assertThat(history.get(1).getType()).isEqualTo(TransactionType.BUY);
    }

    /**
     * Tests that invalid user ID throws an exception.
     */
    @Test
    void getTransactionHistory_invalidUser_throws() {
        // Given: An invalid user ID
        // When/Then: Fetching history throws UserNotFoundException
        assertThatThrownBy(() -> tradingService.getTransactionHistory(999L))
                .isInstanceOf(UserNotFoundException.class);
    }

    // ================ HELPER METHODS ================

    private BuyOrderRequest createBuyRequest(String symbol, int quantity) {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol(symbol);
        request.setQuantity(quantity);
        return request;
    }

    private SellOrderRequest createSellRequest(String symbol, int quantity) {
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol(symbol);
        request.setQuantity(quantity);
        return request;
    }
}