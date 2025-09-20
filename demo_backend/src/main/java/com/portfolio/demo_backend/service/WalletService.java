package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.wallet.WalletBalanceResponse;
import com.portfolio.demo_backend.mapper.TradingMapper;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.repository.WalletRepository;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.exception.price.PriceUnavailableException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WalletService {

    private final WalletRepository walletRepository;
    private final PortfolioRepository portfolioRepository;
    private final PriceService priceService;
    private final UserService userService;

    public PortfolioSummaryDTO getPortfolioSummary(Long userId) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Getting portfolio summary for user: {}", username);

        Wallet wallet = getUserWallet(userId, username);
        List<Portfolio> positions = portfolioRepository.findByUserId(userId);

        List<String> symbols = positions.stream()
                .map(portfolio -> portfolio.getSymbol().getSymbol())
                .collect(Collectors.toList());

        Map<String, BigDecimal> currentPrices = getCurrentPrices(symbols);

        return TradingMapper.toPortfolioSummaryDTO(wallet, positions, currentPrices);
    }

    @Transactional
    public void addCashToWallet(Long userId, BigDecimal amount, String reason) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Adding cash to wallet for user: {}, amount: {}, reason: {}", username, amount, reason);

        Wallet wallet = getUserWallet(userId, username);
        wallet.setCashBalance(wallet.getCashBalance().add(amount));
        walletRepository.save(wallet);

        log.info("Cash added successfully to wallet for user: {}, new balance: {}", username, wallet.getCashBalance());
    }

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

    private Map<String, BigDecimal> getCurrentPrices(List<String> symbols) {
        try {
            Map<String, YahooQuoteDTO> quotes = priceService.getAllCurrentPrices();
            return symbols.stream()
                    .filter(quotes::containsKey)
                    .collect(Collectors.toMap(
                            symbol -> symbol,
                            symbol -> BigDecimal.valueOf(quotes.get(symbol).getPrice())));
        } catch (Exception e) {
            log.error("Failed to get current prices for symbols: {}", symbols, e);
            throw new PriceUnavailableException("multiple symbols", e);
        }
    }
}
