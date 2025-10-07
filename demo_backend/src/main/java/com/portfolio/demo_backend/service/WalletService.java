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

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserService userService;

    @Transactional
    public void updateWalletBalance(Long userId, BigDecimal newBalance) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        Wallet wallet = getUserWallet(userId, username);
        wallet.setCashBalance(newBalance);
        walletRepository.save(wallet);

        log.debug("Wallet balance updated for user: {}, new balance: {}", username, newBalance);
    }

    public Wallet getUserWallet(Long userId, String username) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));
    }

    public WalletBalanceResponse getWalletBalance(Long userId) {
        User user = userService.getUserById(userId);
        Wallet wallet = getUserWallet(userId, user.getUsername());

        return new WalletBalanceResponse(
                wallet.getCashBalance(),
                BigDecimal.ZERO,
                wallet.getCashBalance());
    }
}
