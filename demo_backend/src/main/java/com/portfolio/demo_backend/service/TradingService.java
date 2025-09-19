package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.PortfolioSummaryDTO;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;
import com.portfolio.demo_backend.dto.trading.TradeExecutionResponse;
import com.portfolio.demo_backend.mapper.TradingMapper;
import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.repository.WalletRepository;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.TransactionRepository;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.trading.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TradingService {

    private final WalletRepository walletRepository;
    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;
    private final SymbolRepository symbolRepository;
    private final PriceService priceService;
    private final UserService userService;

    @Transactional
    public TradeExecutionResponse executeBuyOrder(BuyOrderRequest request, String username) {
        log.info("Executing buy order for user: {}, symbol: {}, quantity: {}",
                username, request.getSymbol(), request.getQuantity());

        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        Long userId = user.getId();

        BigDecimal currentPrice = getCurrentPrice(request.getSymbol());

        BigDecimal totalAmount = currentPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));

        if (wallet.getCashBalance().compareTo(totalAmount) < 0) {
            throw new InsufficientFundsException(username, "$" + totalAmount, "$" + wallet.getCashBalance());
        }

        wallet.setCashBalance(wallet.getCashBalance().subtract(totalAmount));
        walletRepository.save(wallet);

        Symbol symbol = symbolRepository.findBySymbol(request.getSymbol())
                .orElseThrow(() -> new SymbolNotFoundException(request.getSymbol()));

        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(userId, request.getSymbol())
                .orElseGet(() -> {
                    Portfolio newPortfolio = new Portfolio();
                    newPortfolio.setUserId(userId);
                    newPortfolio.setSharesOwned(0);
                    newPortfolio.setAverageCostBasis(BigDecimal.ZERO);
                    newPortfolio.setSymbol(symbol);
                    return newPortfolio;
                });

        BigDecimal totalCost = portfolio.getAverageCostBasis().multiply(BigDecimal.valueOf(portfolio.getSharesOwned()))
                .add(totalAmount);
        int newShares = portfolio.getSharesOwned() + request.getQuantity();
        BigDecimal newAverageCost = totalCost.divide(BigDecimal.valueOf(newShares), 4, RoundingMode.HALF_UP);

        portfolio.setSharesOwned(newShares);
        portfolio.setAverageCostBasis(newAverageCost);
        portfolioRepository.save(portfolio);

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setSymbol(symbol);
        transaction.setType(TransactionType.BUY);
        transaction.setQuantity(request.getQuantity());
        transaction.setPricePerShare(currentPrice);
        transaction.setTotalAmount(totalAmount);
        transaction.setExecutedAt(Instant.now());
        transactionRepository.save(transaction);

        log.info("Buy order executed successfully for user: {}, symbol: {}, quantity: {}, price: {}",
                username, request.getSymbol(), request.getQuantity(), currentPrice);

        return TradingMapper.toTradeExecutionResponse(transaction, wallet.getCashBalance(), newShares);
    }

    @Transactional
    public TradeExecutionResponse executeSellOrder(SellOrderRequest request, String username) {
        log.info("Executing sell order for user: {}, symbol: {}, quantity: {}",
                username, request.getSymbol(), request.getQuantity());

        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        Long userId = user.getId();

        BigDecimal currentPrice = getCurrentPrice(request.getSymbol());

        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(userId, request.getSymbol())
                .orElseThrow(() -> new PositionNotFoundException(request.getSymbol()));

        if (portfolio.getSharesOwned() < request.getQuantity()) {
            throw new InsufficientSharesException(request.getSymbol(), portfolio.getSharesOwned(),
                    request.getQuantity());
        }

        BigDecimal totalProceeds = currentPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));

        wallet.setCashBalance(wallet.getCashBalance().add(totalProceeds));
        walletRepository.save(wallet);

        int newShares = portfolio.getSharesOwned() - request.getQuantity();
        portfolio.setSharesOwned(newShares);

        if (newShares == 0) {
            portfolioRepository.delete(portfolio);
        } else {
            portfolioRepository.save(portfolio);
        }

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        Symbol symbol = symbolRepository.findBySymbol(request.getSymbol())
                .orElseThrow(() -> new SymbolNotFoundException(request.getSymbol()));
        transaction.setSymbol(symbol);
        transaction.setType(TransactionType.SELL);
        transaction.setQuantity(request.getQuantity());
        transaction.setPricePerShare(currentPrice);
        transaction.setTotalAmount(totalProceeds);
        transaction.setExecutedAt(Instant.now());
        transactionRepository.save(transaction);

        log.info("Sell order executed successfully for user: {}, symbol: {}, quantity: {}, price: {}",
                username, request.getSymbol(), request.getQuantity(), currentPrice);

        return TradingMapper.toTradeExecutionResponse(transaction, wallet.getCashBalance(), newShares);
    }

    public PortfolioSummaryDTO getPortfolioSummary(String username) {
        log.info("Getting portfolio summary for user: {}", username);

        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        Long userId = user.getId();

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));

        List<Portfolio> positions = portfolioRepository.findByUserId(userId);

        List<String> symbols = positions.stream()
                .map(portfolio -> portfolio.getSymbol().getSymbol())
                .collect(Collectors.toList());

        Map<String, BigDecimal> currentPrices = getCurrentPrices(symbols);

        return TradingMapper.toPortfolioSummaryDTO(wallet, positions, currentPrices);
    }

    public List<Transaction> getTransactionHistory(String username) {
        log.info("Getting transaction history for user: {}", username);

        User user = userService.findByUsername(username);
        if (user == null) {
            throw new UserNotFoundException(username);
        }
        Long userId = user.getId();

        return transactionRepository.findByUserIdOrderByExecutedAtDesc(userId);
    }

    private BigDecimal getCurrentPrice(String symbol) {
        try {
            YahooQuoteDTO quote = priceService.getCurrentPrice(symbol);
            if (quote == null) {
                throw new PriceUnavailableException(symbol);
            }
            return BigDecimal.valueOf(quote.getPrice());
        } catch (Exception e) {
            log.error("Failed to get current price for symbol: {}", symbol, e);
            throw new PriceUnavailableException(symbol, e);
        }
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
