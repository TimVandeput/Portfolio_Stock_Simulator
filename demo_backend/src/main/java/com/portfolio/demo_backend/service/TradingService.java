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
import com.portfolio.demo_backend.exception.price.PriceUnavailableException;
import com.portfolio.demo_backend.exception.symbol.SymbolNotFoundException;
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
    public TradeExecutionResponse executeBuyOrder(Long userId, BuyOrderRequest request) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Executing buy order for user: {}, symbol: {}, quantity: {}",
                username, request.getSymbol(), request.getQuantity());

        BigDecimal currentPrice = getCurrentPrice(request.getSymbol());
        BigDecimal totalAmount = currentPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        Wallet wallet = getUserWallet(userId, username);
        if (wallet.getCashBalance().compareTo(totalAmount) < 0) {
            throw new InsufficientFundsException(username, "$" + totalAmount, "$" + wallet.getCashBalance());
        }

        wallet.setCashBalance(wallet.getCashBalance().subtract(totalAmount));
        walletRepository.save(wallet);

        Symbol symbol = getSymbolEntity(request.getSymbol());
        Portfolio portfolio = getOrCreatePortfolio(userId, request.getSymbol(), symbol);
        updatePortfolioForBuy(portfolio, request.getQuantity(), totalAmount);

        Transaction transaction = createTransaction(userId, symbol, TransactionType.BUY,
                request.getQuantity(), currentPrice, totalAmount);

        log.info("Buy order executed successfully for user: {}, symbol: {}, quantity: {}, price: {}",
                username, request.getSymbol(), request.getQuantity(), currentPrice);

        return TradingMapper.toTradeExecutionResponse(transaction, wallet.getCashBalance(),
                portfolio.getSharesOwned());
    }

    @Transactional
    public TradeExecutionResponse executeSellOrder(Long userId, SellOrderRequest request) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Executing sell order for user: {}, symbol: {}, quantity: {}",
                username, request.getSymbol(), request.getQuantity());

        BigDecimal currentPrice = getCurrentPrice(request.getSymbol());
        Portfolio portfolio = portfolioRepository.findByUserIdAndSymbol_Symbol(userId, request.getSymbol())
                .orElseThrow(() -> new PositionNotFoundException(request.getSymbol()));

        if (portfolio.getSharesOwned() < request.getQuantity()) {
            throw new InsufficientSharesException(request.getSymbol(), portfolio.getSharesOwned(),
                    request.getQuantity());
        }

        BigDecimal totalProceeds = currentPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        Wallet wallet = getUserWallet(userId, username);
        wallet.setCashBalance(wallet.getCashBalance().add(totalProceeds));
        walletRepository.save(wallet);

        updatePortfolioForSell(portfolio, request.getQuantity());

        Symbol symbol = getSymbolEntity(request.getSymbol());
        Transaction transaction = createTransaction(userId, symbol, TransactionType.SELL,
                request.getQuantity(), currentPrice, totalProceeds);

        log.info("Sell order executed successfully for user: {}, symbol: {}, quantity: {}, price: {}",
                username, request.getSymbol(), request.getQuantity(), currentPrice);

        return TradingMapper.toTradeExecutionResponse(transaction, wallet.getCashBalance(),
                portfolio.getSharesOwned());
    }

    public PortfolioSummaryDTO getPortfolioSummary(Long userId) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Getting portfolio summary for user: {}", username);

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));

        List<Portfolio> positions = portfolioRepository.findByUserId(userId);

        List<String> symbols = positions.stream()
                .map(portfolio -> portfolio.getSymbol().getSymbol())
                .collect(Collectors.toList());

        Map<String, BigDecimal> currentPrices = getCurrentPrices(symbols);

        return TradingMapper.toPortfolioSummaryDTO(wallet, positions, currentPrices);
    }

    public List<Transaction> getTransactionHistory(Long userId) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Getting transaction history for user: {}", username);

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

    private Wallet getUserWallet(Long userId, String username) {
        return walletRepository.findByUserId(userId)
                .orElseThrow(() -> new WalletNotFoundException(username));
    }

    private Symbol getSymbolEntity(String symbolStr) {
        return symbolRepository.findBySymbol(symbolStr)
                .orElseThrow(() -> new SymbolNotFoundException(symbolStr));
    }

    private Portfolio getOrCreatePortfolio(Long userId, String symbolStr, Symbol symbol) {
        return portfolioRepository.findByUserIdAndSymbol_Symbol(userId, symbolStr)
                .orElseGet(() -> {
                    Portfolio newPortfolio = new Portfolio();
                    newPortfolio.setUserId(userId);
                    newPortfolio.setSharesOwned(0);
                    newPortfolio.setAverageCostBasis(BigDecimal.ZERO);
                    newPortfolio.setSymbol(symbol);
                    return newPortfolio;
                });
    }

    private void updatePortfolioForBuy(Portfolio portfolio, int quantity, BigDecimal totalAmount) {
        BigDecimal totalCost = portfolio.getAverageCostBasis().multiply(BigDecimal.valueOf(portfolio.getSharesOwned()))
                .add(totalAmount);
        int newShares = portfolio.getSharesOwned() + quantity;
        BigDecimal newAverageCost = totalCost.divide(BigDecimal.valueOf(newShares), 4, RoundingMode.HALF_UP);

        portfolio.setSharesOwned(newShares);
        portfolio.setAverageCostBasis(newAverageCost);
        portfolioRepository.save(portfolio);
    }

    private void updatePortfolioForSell(Portfolio portfolio, int quantity) {
        int newShares = portfolio.getSharesOwned() - quantity;
        portfolio.setSharesOwned(newShares);

        if (newShares == 0) {
            portfolioRepository.delete(portfolio);
        } else {
            portfolioRepository.save(portfolio);
        }
    }

    private Transaction createTransaction(Long userId, Symbol symbol, TransactionType type,
            int quantity, BigDecimal pricePerShare, BigDecimal totalAmount) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setSymbol(symbol);
        transaction.setType(type);
        transaction.setQuantity(quantity);
        transaction.setPricePerShare(pricePerShare);
        transaction.setTotalAmount(totalAmount);
        transaction.setExecutedAt(Instant.now());
        return transactionRepository.save(transaction);
    }
}
