package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.portfolio.PortfolioDataException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;
import com.portfolio.demo_backend.service.util.PortfolioCalculations;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.service.data.UserPortfolioData;
import com.portfolio.demo_backend.service.data.UserHoldingData;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserService userService;
    private final WalletService walletService;

    public UserPortfolioData getUserPortfolio(Long userId) {
        if (ObjectUtils.isEmpty(userId)) {
            throw new IllegalArgumentException("User ID cannot be null");
        }

        try {
            User user = userService.getUserById(userId);
            log.info("Getting portfolio for user: {}", user.getUsername());

            Wallet wallet = walletService.getUserWallet(userId, user.getUsername());
            if (ObjectUtils.isEmpty(wallet)) {
                throw new WalletNotFoundException(user.getUsername());
            }

            List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

            BigDecimal totalInvested = PortfolioCalculations.calculateTotalInvested(portfolios);
            BigDecimal totalValue = wallet.getCashBalance().add(totalInvested);
            BigDecimal totalPL = totalValue.subtract(wallet.getCashBalance()).subtract(totalInvested);

            return new UserPortfolioData(portfolios, wallet, totalInvested, totalValue, totalPL);

        } catch (UserNotFoundException e) {
            log.error("User not found when retrieving portfolio: userId={}", userId);
            throw e;
        } catch (WalletNotFoundException e) {
            log.error("Wallet not found when retrieving portfolio: userId={}", userId);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while retrieving portfolio for userId={}: {}", userId, e.getMessage(), e);
            throw new PortfolioDataException("Failed to retrieve portfolio data", e);
        }
    }

    public UserHoldingData getUserHolding(Long userId, String symbol) {
        if (ObjectUtils.isEmpty(userId)) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (!StringUtils.hasText(symbol)) {
            throw new IllegalArgumentException("Symbol cannot be null or empty");
        }

        String normalizedSymbol = symbol.trim().toUpperCase();

        try {
            User user = userService.getUserById(userId);
            log.info("Getting holding for symbol {} for user: {}", normalizedSymbol, user.getUsername());

            Optional<Portfolio> portfolioOpt = portfolioRepository.findByUserIdAndSymbol_Symbol(userId,
                    normalizedSymbol);

            if (portfolioOpt.isEmpty()) {
                log.debug("No holding found for user {} and symbol {}", user.getUsername(), normalizedSymbol);
                return new UserHoldingData(null, normalizedSymbol, false);
            }

            return new UserHoldingData(portfolioOpt.get(), normalizedSymbol, true);

        } catch (UserNotFoundException e) {
            log.error("User not found when retrieving holding: userId={}, symbol={}", userId, normalizedSymbol);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while retrieving holding for userId={}, symbol={}: {}",
                    userId, normalizedSymbol, e.getMessage(), e);
            throw new PortfolioDataException("Failed to retrieve holding data for symbol: " + normalizedSymbol, e);
        }
    }
}
