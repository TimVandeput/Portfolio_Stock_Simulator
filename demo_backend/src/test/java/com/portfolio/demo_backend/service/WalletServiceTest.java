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
