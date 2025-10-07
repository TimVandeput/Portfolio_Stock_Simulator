package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.repository.WalletRepository;
import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * Wallet domain service for balance retrieval and updates.
 * <p>
 * Responsibilities:
 * - Resolve and return a user's {@link Wallet}
 * - Update wallet cash balance in a transactional way
 * - Provide a compact balance view model for API responses
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserService userService;

    /**
     * Updates the user's wallet cash balance.
     *
     * This method validates the user exists, loads the wallet, updates the
     * balance and persists the change atomically.
     *
     * @param userId     the user id whose wallet should be updated
     * @param newBalance the new cash balance to set (non-null)
     * @throws com.portfolio.demo_backend.exception.trading.WalletNotFoundException if the wallet cannot be found
     */
    @Transactional
    public void updateWalletBalance(Long userId, BigDecimal newBalance) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        Wallet wallet = getUserWallet(userId, username);
        wallet.setCashBalance(newBalance);
        walletRepository.save(wallet);

        log.debug("Wallet balance updated for user: {}, new balance: {}", username, newBalance);
    }

    /**
     * Retrieves the user's wallet or throws if absent.
     *
     * @param userId   the user id
     * @param username the username (used for exception message context)
     * @return the user's wallet entity
     * @throws WalletNotFoundException if no wallet exists for the user
     */
    public Wallet getUserWallet(Long userId, String username) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));
    }

    /**
     * Returns a summarized wallet balance for a user.
     *
     * @param userId the user id
     * @return response model with cash, invested (currently 0) and total balances
     * @throws WalletNotFoundException if the user's wallet cannot be found
     */
    public WalletBalanceResponse getWalletBalance(Long userId) {
        User user = userService.getUserById(userId);
        Wallet wallet = getUserWallet(userId, user.getUsername());

        return new WalletBalanceResponse(
                wallet.getCashBalance(),
                BigDecimal.ZERO,
                wallet.getCashBalance());
    }
}
