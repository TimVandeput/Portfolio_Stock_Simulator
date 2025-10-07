package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.exception.price.PriceUnavailableException;
import com.portfolio.demo_backend.exception.symbol.SymbolNotFoundException;
import com.portfolio.demo_backend.exception.trading.InsufficientFundsException;
import com.portfolio.demo_backend.exception.trading.InsufficientSharesException;
import com.portfolio.demo_backend.exception.trading.PositionNotFoundException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.repository.TransactionRepository;
import com.portfolio.demo_backend.service.data.TradeExecutionData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link TradingService}.
 * 
 * These tests verify individual methods in isolation using mocked dependencies.
 * Focuses on business logic validation without database interactions.
 *
 * @author Portfolio Team
 * @since 1.0
 */
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
    private NotificationService notificationService;

    @InjectMocks
    private TradingService tradingService;

    private User testUser;
    private Symbol testSymbol;
    private Wallet testWallet;
    private Portfolio testPortfolio;
    private YahooQuoteDTO testQuote;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testSymbol = new Symbol();
        testSymbol.setId(1L);
        testSymbol.setSymbol("AAPL");
        testSymbol.setName("Apple Inc.");

        testWallet = new Wallet();
        testWallet.setUserId(1L);
        testWallet.setCashBalance(new BigDecimal("5000.00"));

        testPortfolio = new Portfolio();
        testPortfolio.setUserId(1L);
        testPortfolio.setSymbol(testSymbol);
        testPortfolio.setSharesOwned(10);
        testPortfolio.setAverageCostBasis(new BigDecimal("150.00"));

        testQuote = new YahooQuoteDTO();
        testQuote.setSymbol("AAPL");
        testQuote.setPrice(160.0);
    }

    // ================ EXECUTE BUY - HAPPY PATH ================

    /**
     * Tests successful execution of a buy order with sufficient funds.
     */
    @Test
    void executeBuy_withSufficientFunds_completesSuccessfully() {
        // Given: User with sufficient funds and valid symbol
        Long userId = 1L;
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(userId, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(userId, "AAPL"))
                .thenReturn(Optional.of(testPortfolio));

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(1L);
        savedTransaction.setUserId(userId);
        savedTransaction.setSymbol(testSymbol);
        savedTransaction.setType(TransactionType.BUY);
        savedTransaction.setQuantity(5);
        savedTransaction.setPricePerShare(new BigDecimal("160.00"));
        savedTransaction.setTotalAmount(new BigDecimal("800.00"));

        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        // When: Buy order is executed
        TradeExecutionData result = tradingService.executeBuy(userId, request);

        // Then: Transaction is created and portfolio is updated
        assertThat(result).isNotNull();
        assertThat(result.getTransaction()).isNotNull();
        assertThat(result.getTransaction().getType()).isEqualTo(TransactionType.BUY);
        assertThat(result.getTransaction().getQuantity()).isEqualTo(5);
        assertThat(result.getTransaction().getPricePerShare()).isEqualByComparingTo(new BigDecimal("160.00"));
        assertThat(result.getNewCashBalance()).isEqualByComparingTo(new BigDecimal("4200.00"));
        assertThat(result.getNewSharesOwned()).isEqualTo(15);

        verify(walletService).updateWalletBalance(userId, new BigDecimal("4200.00"));
        verify(portfolioRepository).save(any(Portfolio.class));
        verify(transactionRepository).save(any(Transaction.class));
    }

    /**
     * Verifies a buy order creates a new portfolio position when none exists.
     */
    @Test
    void executeBuy_newPosition_createsPortfolio() {
        // Given: Valid user, symbol and no existing portfolio position
        Long userId = 1L;
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(userId, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(userId, "AAPL"))
                .thenReturn(Optional.empty());

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(1L);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        // When: Buy order is executed
        TradeExecutionData result = tradingService.executeBuy(userId, request);

        // Then: A new portfolio is created and persisted
        assertThat(result).isNotNull();
        verify(portfolioRepository).save(argThat(portfolio -> portfolio.getUserId().equals(userId) &&
                portfolio.getSymbol().equals(testSymbol) &&
                portfolio.getSharesOwned() == 10 &&
                portfolio.getAverageCostBasis().compareTo(new BigDecimal("160.0000")) == 0));
    }

    // ================ EXECUTE BUY - UNHAPPY PATH ================

    /**
     * Ensures buy order fails when wallet cash balance is insufficient.
     */
    @Test
    void executeBuy_withInsufficientFunds_throwsException() {
        // Given: User with insufficient funds
        Long userId = 1L;
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(100);

        testWallet.setCashBalance(new BigDecimal("1000.00"));
        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(walletService.getUserWallet(userId, "testuser")).thenReturn(testWallet);

        // When/Then: Buy order execution throws InsufficientFundsException
        assertThatThrownBy(() -> tradingService.executeBuy(userId, request))
                .isInstanceOf(InsufficientFundsException.class);

        verify(walletService, never()).updateWalletBalance(anyLong(), any(BigDecimal.class));
        verify(portfolioRepository, never()).save(any(Portfolio.class));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    /**
     * Ensures buy order fails for a non-existing user.
     */
    @Test
    void executeBuy_withInvalidUser_throwsException() {
        // Given: Invalid user id
        Long userId = 999L;
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId))
                .thenThrow(new UserNotFoundException("User with id " + userId + " not found"));

        // When/Then: Buy order execution throws UserNotFoundException
        assertThatThrownBy(() -> tradingService.executeBuy(userId, request))
                .isInstanceOf(UserNotFoundException.class);

        verify(priceService, never()).getCurrentPrice(anyString());
    }

    /**
     * Ensures buy order fails when the provided symbol cannot be resolved.
     */
    @Test
    void executeBuy_withInvalidSymbol_throwsException() {
        Long userId = 1L;
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("INVALID");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("INVALID")).thenReturn(testQuote);
        when(walletService.getUserWallet(userId, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("INVALID")).thenReturn(Optional.empty());

        // When/Then: Buy order execution throws SymbolNotFoundException
        assertThatThrownBy(() -> tradingService.executeBuy(userId, request))
                .isInstanceOf(SymbolNotFoundException.class);
    }

    /**
     * Ensures price provider failures are mapped to PriceUnavailableException on
     * buy.
     */
    @Test
    void executeBuy_withPriceUnavailable_throwsException() {
        // Given: Price service throws an error
        Long userId = 1L;
        BuyOrderRequest request = new BuyOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenThrow(new RuntimeException("Price service error"));

        // When/Then: Execution throws PriceUnavailableException
        assertThatThrownBy(() -> tradingService.executeBuy(userId, request))
                .isInstanceOf(PriceUnavailableException.class);
    }

    // ================ EXECUTE SELL - HAPPY PATH ================

    /**
     * Tests successful sell order execution when the user has enough shares.
     */
    @Test
    void executeSell_withSufficientShares_completesSuccessfully() {
        // Given: Existing portfolio with sufficient shares
        Long userId = 1L;
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(userId, "AAPL"))
                .thenReturn(Optional.of(testPortfolio));
        when(walletService.getUserWallet(userId, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL"))
                .thenReturn(List.of());

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(1L);
        savedTransaction.setType(TransactionType.SELL);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        // When: Sell order is executed
        TradeExecutionData result = tradingService.executeSell(userId, request);

        // Then: Cash balance increases and shares owned decrease
        assertThat(result).isNotNull();
        assertThat(result.getTransaction().getType()).isEqualTo(TransactionType.SELL);
        assertThat(result.getNewCashBalance()).isEqualByComparingTo(new BigDecimal("5800.00"));
        assertThat(result.getNewSharesOwned()).isEqualTo(5);

        verify(walletService).updateWalletBalance(userId, new BigDecimal("5800.00"));
        verify(portfolioRepository).save(any(Portfolio.class));
        verify(transactionRepository).save(any(Transaction.class));
    }

    /**
     * Verifies selling all shares deletes the portfolio position.
     */
    @Test
    void executeSell_allShares_deletesPortfolio() {
        // Given: Existing portfolio where requested quantity equals owned shares
        Long userId = 1L;
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(10); // Sell all shares

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(userId, "AAPL"))
                .thenReturn(Optional.of(testPortfolio));
        when(walletService.getUserWallet(userId, "testuser")).thenReturn(testWallet);
        when(symbolRepository.findBySymbol("AAPL")).thenReturn(Optional.of(testSymbol));
        when(transactionRepository.findByUserIdAndSymbolOrderByExecutedAtAsc(userId, "AAPL"))
                .thenReturn(List.of());

        Transaction savedTransaction = new Transaction();
        savedTransaction.setId(1L);
        when(transactionRepository.save(any(Transaction.class))).thenReturn(savedTransaction);

        // When: Sell order is executed
        TradeExecutionData result = tradingService.executeSell(userId, request);

        // Then: Portfolio position is removed
        assertThat(result).isNotNull();
        assertThat(result.getNewSharesOwned()).isEqualTo(0);
        verify(portfolioRepository).delete(testPortfolio);
        verify(portfolioRepository, never()).save(any(Portfolio.class));
    }

    // ================ EXECUTE SELL - UNHAPPY PATH ================

    /**
     * Ensures sell order fails when user attempts to sell more shares than owned.
     */
    @Test
    void executeSell_withInsufficientShares_throwsException() {
        // Given: Existing portfolio with fewer shares than requested
        Long userId = 1L;
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(20); // More than owned

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(userId, "AAPL"))
                .thenReturn(Optional.of(testPortfolio));

        // When/Then: Execution throws InsufficientSharesException
        assertThatThrownBy(() -> tradingService.executeSell(userId, request))
                .isInstanceOf(InsufficientSharesException.class);

        verify(walletService, never()).updateWalletBalance(anyLong(), any(BigDecimal.class));
        verify(transactionRepository, never()).save(any(Transaction.class));
    }

    /**
     * Ensures sell order fails when the user has no position for the symbol.
     */
    @Test
    void executeSell_withNoPosition_throwsException() {
        // Given: No existing portfolio for the symbol
        Long userId = 1L;
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(testQuote);
        when(portfolioRepository.findByUserIdAndSymbol_Symbol(userId, "AAPL"))
                .thenReturn(Optional.empty());

        // When/Then: Execution throws PositionNotFoundException
        assertThatThrownBy(() -> tradingService.executeSell(userId, request))
                .isInstanceOf(PositionNotFoundException.class);
    }

    /**
     * Ensures sell order fails for a non-existing user.
     */
    @Test
    void executeSell_withInvalidUser_throwsException() {
        // Given: Invalid user id
        Long userId = 999L;
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenThrow(new UserNotFoundException("User not found"));

        // When/Then: Execution throws UserNotFoundException
        assertThatThrownBy(() -> tradingService.executeSell(userId, request))
                .isInstanceOf(UserNotFoundException.class);
    }

    /**
     * Ensures price provider failures are mapped to PriceUnavailableException on
     * sell.
     */
    @Test
    void executeSell_withPriceUnavailable_throwsException() {
        // Given: Price service returns null/invalid
        Long userId = 1L;
        SellOrderRequest request = new SellOrderRequest();
        request.setSymbol("AAPL");
        request.setQuantity(5);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(null);

        // When/Then: Execution throws PriceUnavailableException
        assertThatThrownBy(() -> tradingService.executeSell(userId, request))
                .isInstanceOf(PriceUnavailableException.class);
    }

    // ================ GET TRANSACTION HISTORY ================

    /**
     * Verifies transaction history returns a list of transactions for a valid user.
     */
    @Test
    void getTransactionHistory_returnsTransactions() {
        // Given: Existing transactions for user
        Long userId = 1L;
        Transaction transaction1 = new Transaction();
        transaction1.setId(1L);
        transaction1.setUserId(userId);
        transaction1.setType(TransactionType.BUY);

        Transaction transaction2 = new Transaction();
        transaction2.setId(2L);
        transaction2.setUserId(userId);
        transaction2.setType(TransactionType.SELL);

        List<Transaction> expectedTransactions = List.of(transaction1, transaction2);

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(transactionRepository.findByUserIdWithSymbolOrderByExecutedAtDesc(userId))
                .thenReturn(expectedTransactions);

        // When: Fetching transaction history
        List<Transaction> result = tradingService.getTransactionHistory(userId);

        // Then: Returns expected ordered list
        assertThat(result).isNotNull();
        assertThat(result).hasSize(2);
        assertThat(result).containsExactly(transaction1, transaction2);
    }

    /**
     * Ensures fetching history fails for a non-existing user.
     */
    @Test
    void getTransactionHistory_withInvalidUser_throwsException() {
        // Given: Invalid user id
        Long userId = 999L;
        when(userService.getUserById(userId)).thenThrow(new UserNotFoundException("User not found"));

        // When/Then: Fetching history throws UserNotFoundException
        assertThatThrownBy(() -> tradingService.getTransactionHistory(userId))
                .isInstanceOf(UserNotFoundException.class);

        verify(transactionRepository, never()).findByUserIdWithSymbolOrderByExecutedAtDesc(anyLong());
    }

    /**
     * Verifies empty history returns an empty list for a valid user.
     */
    @Test
    void getTransactionHistory_emptyHistory_returnsEmptyList() {
        // Given: No transactions for user
        Long userId = 1L;
        when(userService.getUserById(userId)).thenReturn(testUser);
        when(transactionRepository.findByUserIdWithSymbolOrderByExecutedAtDesc(userId))
                .thenReturn(List.of());

        // When: Fetching transaction history
        List<Transaction> result = tradingService.getTransactionHistory(userId);

        // Then: Returns empty list
        assertThat(result).isNotNull();
        assertThat(result).isEmpty();
    }
}