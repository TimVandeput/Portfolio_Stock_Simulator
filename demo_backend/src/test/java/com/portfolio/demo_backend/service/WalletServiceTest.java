package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;

import com.portfolio.demo_backend.model.*;

import com.portfolio.demo_backend.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link WalletService} covering wallet retrieval and balance
 * updates.
 *
 * Conventions applied: class/method Javadoc and inline Given/When/Then
 * comments.
 */
@ExtendWith(MockitoExtension.class)
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private WalletService walletService;

    private User testUser;
    private Wallet testWallet;
    private Symbol testSymbol;

    /**
     * Given fresh user, wallet and symbol fixtures for each test.
     */
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

    /**
     * Ensures updating a wallet balance persists the new value.
     *
     * Given a user and existing wallet
     * When updateWalletBalance is called
     * Then the cash balance is updated and saved
     */
    @Test
    void updateWalletBalance_setsNewBalance() {
        Long userId = 1L;
        BigDecimal newBalance = new BigDecimal("3500.00");

        when(userService.getUserById(userId)).thenReturn(testUser);
        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));

        // When: applying balance update
        walletService.updateWalletBalance(userId, newBalance);

        // Then: repository save is invoked and state updated
        assertEquals(newBalance, testWallet.getCashBalance());
        verify(walletRepository).save(testWallet);
    }

    /**
     * Verifies that requesting a missing wallet throws a domain exception.
     *
     * Given no wallet for the user
     * When getUserWallet is invoked
     * Then WalletNotFoundException is thrown with a descriptive message
     */
    @Test
    void getUserWallet_withMissingWallet_throws() {
        Long userId = 1L;
        String username = "testuser";

        when(walletRepository.findByUserId(1L)).thenReturn(Optional.empty());

        // When: fetching user wallet Then: exception is thrown
        WalletNotFoundException exception = assertThrows(WalletNotFoundException.class, () -> {
            walletService.getUserWallet(userId, username);
        });

        assertTrue(exception.getMessage().contains("Wallet not found for user: testuser"));
    }

    /**
     * Confirms an existing wallet is returned for a user.
     *
     * Given an existing wallet for user
     * When getUserWallet is called
     * Then the same instance is returned
     */
    @Test
    void getUserWallet_returnsWallet() {
        Long userId = 1L;
        String username = "testuser";

        when(walletRepository.findByUserId(1L)).thenReturn(Optional.of(testWallet));

        // When
        Wallet result = walletService.getUserWallet(userId, username);

        // Then
        assertNotNull(result);
        assertEquals(testWallet, result);
    }
}
