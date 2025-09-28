package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.exception.trading.*;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.repository.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TradingServiceIntegrationTest {

    @TestConfiguration
    static class MockPriceServiceConfig {
        @Bean
        @Primary
        public PriceService priceService() {
            return mock(PriceService.class);
        }
    }

    @Autowired
    TradingService tradingService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    WalletRepository walletRepository;
    @Autowired
    SymbolRepository symbolRepository;
    @Autowired
    PortfolioRepository portfolioRepository;
    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    PriceService priceService;

    private User testUser;
    private Wallet testWallet;
    private Symbol testSymbol;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("trader")
                .email("trader@example.com")
                .password("encodedpassword")
                .build();
        testUser = userRepository.save(testUser);

        testWallet = new Wallet();
        testWallet.setUser(testUser);
        testWallet.setCashBalance(BigDecimal.valueOf(10000.00));
        testWallet = walletRepository.save(testWallet);

        testSymbol = new Symbol();
        testSymbol.setSymbol("AAPL");
        testSymbol.setName("Apple Inc.");
        testSymbol.setEnabled(true);
        testSymbol = symbolRepository.save(testSymbol);

        reset(priceService);

        YahooQuoteDTO appleQuote = new YahooQuoteDTO("AAPL", 150.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(appleQuote);
    }

    @Test
    void executeBuyOrder_validOrder_createsTransactionAndPortfolio() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(BigDecimal.valueOf(150.00));

        TradeExecutionResponse response = tradingService.executeBuyOrder(testUser.getId(), request);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).containsIgnoringCase("successfully");
        assertThat(response.getQuantity()).isEqualTo(10);
        assertThat(response.getSymbol()).isEqualTo("AAPL");
    }

    @Test
    void executeBuyOrder_insufficientFunds_throws() {
        testWallet.setCashBalance(BigDecimal.valueOf(100.00));
        walletRepository.save(testWallet);

        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(100);
        request.setExpectedPrice(BigDecimal.valueOf(150.00));

        assertThatThrownBy(() -> tradingService.executeBuyOrder(testUser.getId(), request))
                .isInstanceOf(InsufficientFundsException.class);
    }

    @Test
    void executeSellOrder_validOrder_updatesPortfolioAndWallet() {
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setUser(testUser);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(20);
        portfolio.setAverageCostBasis(BigDecimal.valueOf(140.00));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(BigDecimal.valueOf(145.00));

        TradeExecutionResponse response = tradingService.executeSellOrder(testUser.getId(), request);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).containsIgnoringCase("successfully");
        assertThat(response.getQuantity()).isEqualTo(10);
        assertThat(response.getSymbol()).isEqualTo("AAPL");
    }

    @Test
    void executeSellOrder_insufficientShares_throws() {
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setUser(testUser);
        portfolio.setSymbol(testSymbol);
        portfolio.setSharesOwned(5);
        portfolio.setAverageCostBasis(BigDecimal.valueOf(140.00));
        portfolioRepository.save(portfolio);

        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(BigDecimal.valueOf(145.00));

        assertThatThrownBy(() -> tradingService.executeSellOrder(testUser.getId(), request))
                .isInstanceOf(InsufficientSharesException.class);
    }

    @Test
    void getTransactionHistory_returnsOrderedTransactions() {
        Transaction transaction1 = new Transaction();
        transaction1.setUserId(testUser.getId());
        transaction1.setUser(testUser);
        transaction1.setSymbol(testSymbol);
        transaction1.setType(TransactionType.BUY);
        transaction1.setQuantity(10);
        transaction1.setPricePerShare(BigDecimal.valueOf(150.00));
        transaction1.setTotalAmount(BigDecimal.valueOf(1500.00));
        transactionRepository.save(transaction1);

        List<Transaction> history = tradingService.getTransactionHistory(testUser.getId());

        assertThat(history).hasSize(1);
        assertThat(history.get(0).getQuantity()).isEqualTo(10);
        assertThat(history.get(0).getType()).isEqualTo(TransactionType.BUY);
    }

    @Test
    void getTransactionHistory_emptyForNewUser() {
        User newUser = User.builder()
                .username("newuser")
                .email("newuser@example.com")
                .password("password")
                .build();
        newUser = userRepository.save(newUser);

        List<Transaction> history = tradingService.getTransactionHistory(newUser.getId());

        assertThat(history).isEmpty();
    }

    @Test
    void executeSellOrder_calculatesSimpleProfitLoss() {
        BuyOrderRequest buyRequest = new BuyOrderRequest();
        buyRequest.setSymbol("AAPL");
        buyRequest.setQuantity(10);
        buyRequest.setExpectedPrice(BigDecimal.valueOf(100.00));

        YahooQuoteDTO buyQuote = new YahooQuoteDTO("AAPL", 100.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(buyQuote);

        tradingService.executeBuyOrder(testUser.getId(), buyRequest);

        YahooQuoteDTO sellQuote = new YahooQuoteDTO("AAPL", 150.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(sellQuote);

        SellOrderRequest sellRequest = new SellOrderRequest();
        sellRequest.setSymbol("AAPL");
        sellRequest.setQuantity(5);
        sellRequest.setExpectedPrice(BigDecimal.valueOf(150.00));

        TradeExecutionResponse response = tradingService.executeSellOrder(testUser.getId(), sellRequest);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).containsIgnoringCase("successfully");

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByExecutedAtDesc(testUser.getId());
        Transaction sellTransaction = transactions.stream()
                .filter(t -> t.getType() == TransactionType.SELL)
                .findFirst()
                .orElseThrow();

        assertThat(sellTransaction.getProfitLoss()).isNotNull();
        assertThat(sellTransaction.getProfitLoss()).isEqualTo(BigDecimal.valueOf(250.00));
    }

    @Test
    void executeSellOrder_calculatesFIFOProfitLossWithMultiplePurchases() {
        YahooQuoteDTO buyQuote1 = new YahooQuoteDTO("AAPL", 100.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(buyQuote1);

        BuyOrderRequest buyRequest1 = new BuyOrderRequest();
        buyRequest1.setSymbol("AAPL");
        buyRequest1.setQuantity(10);
        buyRequest1.setExpectedPrice(BigDecimal.valueOf(100.00));

        tradingService.executeBuyOrder(testUser.getId(), buyRequest1);

        testWallet.setCashBalance(testWallet.getCashBalance().add(BigDecimal.valueOf(5000.00)));
        walletRepository.save(testWallet);

        YahooQuoteDTO buyQuote2 = new YahooQuoteDTO("AAPL", 120.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(buyQuote2);

        BuyOrderRequest buyRequest2 = new BuyOrderRequest();
        buyRequest2.setSymbol("AAPL");
        buyRequest2.setQuantity(5);
        buyRequest2.setExpectedPrice(BigDecimal.valueOf(120.00));

        tradingService.executeBuyOrder(testUser.getId(), buyRequest2);

        YahooQuoteDTO sellQuote = new YahooQuoteDTO("AAPL", 150.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(sellQuote);

        SellOrderRequest sellRequest = new SellOrderRequest();
        sellRequest.setSymbol("AAPL");
        sellRequest.setQuantity(12);
        sellRequest.setExpectedPrice(BigDecimal.valueOf(150.00));

        TradeExecutionResponse response = tradingService.executeSellOrder(testUser.getId(), sellRequest);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).containsIgnoringCase("successfully");

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByExecutedAtDesc(testUser.getId());
        Transaction sellTransaction = transactions.stream()
                .filter(t -> t.getType() == TransactionType.SELL)
                .findFirst()
                .orElseThrow();

        assertThat(sellTransaction.getProfitLoss()).isNotNull();
        assertThat(sellTransaction.getProfitLoss()).isEqualTo(BigDecimal.valueOf(560.00));
    }

    @Test
    void executeSellOrder_calculatesLossCorrectly() {
        YahooQuoteDTO buyQuote = new YahooQuoteDTO("AAPL", 150.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(buyQuote);

        BuyOrderRequest buyRequest = new BuyOrderRequest();
        buyRequest.setSymbol("AAPL");
        buyRequest.setQuantity(10);
        buyRequest.setExpectedPrice(BigDecimal.valueOf(150.00));

        tradingService.executeBuyOrder(testUser.getId(), buyRequest);

        YahooQuoteDTO sellQuote = new YahooQuoteDTO("AAPL", 130.00, 2.50, 1.69, "USD", 2400000.0, 147.5, 151.0, 149.0,
                1200000.0);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(sellQuote);

        SellOrderRequest sellRequest = new SellOrderRequest();
        sellRequest.setSymbol("AAPL");
        sellRequest.setQuantity(8);
        sellRequest.setExpectedPrice(BigDecimal.valueOf(130.00));

        TradeExecutionResponse response = tradingService.executeSellOrder(testUser.getId(), sellRequest);

        assertThat(response).isNotNull();
        assertThat(response.getMessage()).containsIgnoringCase("successfully");

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByExecutedAtDesc(testUser.getId());
        Transaction sellTransaction = transactions.stream()
                .filter(t -> t.getType() == TransactionType.SELL)
                .findFirst()
                .orElseThrow();

        assertThat(sellTransaction.getProfitLoss()).isNotNull();
        assertThat(sellTransaction.getProfitLoss()).isEqualTo(BigDecimal.valueOf(-160.00));
    }

    @Test
    void executeBuyOrder_doesNotSetProfitLoss() {
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);
        request.setExpectedPrice(BigDecimal.valueOf(150.00));

        TradeExecutionResponse response = tradingService.executeBuyOrder(testUser.getId(), request);

        assertThat(response).isNotNull();

        List<Transaction> transactions = transactionRepository.findByUserIdOrderByExecutedAtDesc(testUser.getId());
        Transaction buyTransaction = transactions.stream()
                .filter(t -> t.getType() == TransactionType.BUY)
                .findFirst()
                .orElseThrow();

        assertThat(buyTransaction.getProfitLoss()).isNull();
    }
}
