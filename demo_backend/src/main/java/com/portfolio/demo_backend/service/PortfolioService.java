package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.exception.portfolio.PortfolioDataException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;
import com.portfolio.demo_backend.mapper.PortfolioMapper;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

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

    public PortfolioResponseDTO getUserPortfolio(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }

        try {
            User user = userService.getUserById(userId);
            log.info("Getting portfolio for user: {}", user.getUsername());

            Wallet wallet = walletService.getUserWallet(userId, user.getUsername());
            if (wallet == null) {
                throw new WalletNotFoundException(user.getUsername());
            }

            List<Portfolio> portfolios = portfolioRepository.findByUserId(userId);

            List<PortfolioHoldingResponseDTO> holdings = PortfolioMapper.toPortfolioHoldingResponseDTOList(portfolios);

            BigDecimal totalInvested = PortfolioMapper.calculateTotalInvested(portfolios);

            PortfolioResponseDTO.WalletBalanceDTO walletBalance = PortfolioMapper.toWalletBalanceDTO(wallet,
                    totalInvested);
            if (walletBalance == null) {
                throw new PortfolioDataException("Failed to calculate wallet balance for user: " + user.getUsername());
            }

            BigDecimal totalValue = wallet.getCashBalance().add(totalInvested);
            PortfolioResponseDTO.PortfolioSummaryDetailsDTO summary = PortfolioMapper
                    .toPortfolioSummaryDetailsDTO(totalValue);

            return PortfolioMapper.toPortfolioResponseDTO(holdings, walletBalance, summary);

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

    public PortfolioHoldingResponseDTO getUserHolding(Long userId, String symbol) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("User ID must be a positive number");
        }
        if (symbol == null || symbol.trim().isEmpty()) {
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
                return PortfolioMapper.toEmptyPortfolioHoldingResponseDTO(normalizedSymbol);
            }

            return PortfolioMapper.toPortfolioHoldingResponseDTO(portfolioOpt.get());

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
