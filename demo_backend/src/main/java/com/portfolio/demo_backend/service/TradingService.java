package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.trading.BuyOrderRequest;
import com.portfolio.demo_backend.dto.trading.SellOrderRequest;

import com.portfolio.demo_backend.model.*;
import com.portfolio.demo_backend.model.enums.TransactionType;
import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.TransactionRepository;
import com.portfolio.demo_backend.service.data.TradeExecutionData;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.exception.price.PriceUnavailableException;
import com.portfolio.demo_backend.exception.symbol.SymbolNotFoundException;
import com.portfolio.demo_backend.exception.trading.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TradingService {

    private final PortfolioRepository portfolioRepository;
    private final TransactionRepository transactionRepository;
    private final SymbolRepository symbolRepository;
    private final PriceService priceService;
    private final UserService userService;
    private final WalletService walletService;
    private final NotificationService notificationService;

    @Transactional
    public TradeExecutionData executeBuy(Long userId, BuyOrderRequest request) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Executing buy order for user: {}, symbol: {}, quantity: {}",
                username, request.getSymbol(), request.getQuantity());

        BigDecimal currentPrice = getCurrentPrice(request.getSymbol());
        BigDecimal totalAmount = currentPrice.multiply(BigDecimal.valueOf(request.getQuantity()));

        Wallet wallet = walletService.getUserWallet(userId, username);
        if (wallet.getCashBalance().compareTo(totalAmount) < 0) {
            throw new InsufficientFundsException(username, "$" + totalAmount, "$" + wallet.getCashBalance());
        }

        BigDecimal newBalance = wallet.getCashBalance().subtract(totalAmount);
        walletService.updateWalletBalance(userId, newBalance);

        Symbol symbol = getSymbolEntity(request.getSymbol());
        Portfolio portfolio = getOrCreatePortfolio(userId, request.getSymbol(), symbol);
        updatePortfolioForBuy(portfolio, request.getQuantity(), totalAmount);

        Transaction transaction = createTransaction(userId, symbol, TransactionType.BUY,
                request.getQuantity(), currentPrice, totalAmount);

        log.info("Buy order executed successfully for user: {}, symbol: {}, quantity: {}, price: {}",
                username, request.getSymbol(), request.getQuantity(), currentPrice);

        sendTradeNotification(userId, "buy", request.getSymbol(), request.getQuantity(), currentPrice, totalAmount,
                null);

        return new TradeExecutionData(transaction, newBalance,
                portfolio.getSharesOwned());
    }

    @Transactional
    public TradeExecutionData executeSell(Long userId,
            SellOrderRequest request) {
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

        Wallet wallet = walletService.getUserWallet(userId, username);
        BigDecimal newBalance = wallet.getCashBalance().add(totalProceeds);
        walletService.updateWalletBalance(userId, newBalance);

        updatePortfolioForSell(portfolio, request.getQuantity());

        Symbol symbol = getSymbolEntity(request.getSymbol());

        BigDecimal profitLoss = calculateProfitLoss(userId, request.getSymbol(), request.getQuantity(), currentPrice);

        Transaction transaction = createTransaction(userId, symbol, TransactionType.SELL,
                request.getQuantity(), currentPrice, totalProceeds, profitLoss);

        log.info("Sell order executed successfully for user: {}, symbol: {}, quantity: {}, price: {}",
                username, request.getSymbol(), request.getQuantity(), currentPrice);

        sendTradeNotification(userId, "sell", request.getSymbol(), request.getQuantity(), currentPrice, totalProceeds,
                profitLoss);

        return new TradeExecutionData(transaction, newBalance,
                portfolio.getSharesOwned());
    }

    public List<Transaction> getTransactionHistory(Long userId) {
        User user = userService.getUserById(userId);
        String username = user.getUsername();

        log.info("Getting transaction history for user: {}", username);

        return transactionRepository.findByUserIdWithSymbolOrderByExecutedAtDesc(userId);
    }

    private BigDecimal getCurrentPrice(String symbol) {
        try {
            YahooQuoteDTO quote = priceService.getCurrentPrice(symbol);
            if (ObjectUtils.isEmpty(quote)) {
                throw new PriceUnavailableException(symbol);
            }
            return BigDecimal.valueOf(quote.getPrice());
        } catch (Exception e) {
            log.error("Failed to get current price for symbol: {}", symbol, e);
            throw new PriceUnavailableException(symbol, e);
        }
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
        return createTransaction(userId, symbol, type, quantity, pricePerShare, totalAmount, null);
    }

    private Transaction createTransaction(Long userId, Symbol symbol, TransactionType type,
            int quantity, BigDecimal pricePerShare, BigDecimal totalAmount, BigDecimal profitLoss) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setSymbol(symbol);
        transaction.setType(type);
        transaction.setQuantity(quantity);
        transaction.setPricePerShare(pricePerShare);
        transaction.setTotalAmount(totalAmount);
        transaction.setProfitLoss(profitLoss);
        transaction.setExecutedAt(Instant.now());
        return transactionRepository.save(transaction);
    }

    private BigDecimal calculateProfitLoss(Long userId, String symbol, Integer sellQuantity, BigDecimal sellPrice) {
        List<Transaction> symbolTransactions = transactionRepository
                .findByUserIdAndSymbolOrderByExecutedAtAsc(userId, symbol);

        if (symbolTransactions.isEmpty()) {
            return null;
        }

        int remainingShares = sellQuantity;
        BigDecimal totalCostBasis = BigDecimal.ZERO;

        for (Transaction transaction : symbolTransactions) {
            if (transaction.getType() == TransactionType.BUY && remainingShares > 0) {
                int sharesToUse = Math.min(remainingShares, transaction.getQuantity());
                BigDecimal costForShares = transaction.getPricePerShare()
                        .multiply(BigDecimal.valueOf(sharesToUse));
                totalCostBasis = totalCostBasis.add(costForShares);
                remainingShares -= sharesToUse;
            }
        }

        if (remainingShares > 0) {
            log.warn("Insufficient purchase history to calculate profit/loss for user: {}, symbol: {}, quantity: {}",
                    userId, symbol, sellQuantity);
            return null;
        }

        BigDecimal sellValue = sellPrice.multiply(BigDecimal.valueOf(sellQuantity));
        return sellValue.subtract(totalCostBasis);
    }

    private void sendTradeNotification(Long userId, String tradeType, String symbol, Integer quantity,
            BigDecimal pricePerShare, BigDecimal totalAmount, BigDecimal profitLoss) {
        try {
            Long systemUserId = getSystemUserId();
            String action = tradeType.equalsIgnoreCase("buy") ? "purchased" : "sold";
            String emoji = tradeType.equalsIgnoreCase("buy") ? "📈" : "📉";

            String subject = String.format("%s Trade Executed - %s", emoji, symbol.toUpperCase());

            StringBuilder bodyBuilder = new StringBuilder();
            bodyBuilder.append(String.format("Your %s order has been successfully executed! %s<br><br>",
                    tradeType.toLowerCase(), emoji));
            bodyBuilder.append("<strong>Trade Details:</strong><br>");
            bodyBuilder.append(String.format("• Symbol: <strong>%s</strong><br>", symbol.toUpperCase()));
            bodyBuilder.append(String.format("• Action: %s<br>", action));
            bodyBuilder.append(String.format("• Quantity: %,d shares<br>", quantity));
            bodyBuilder.append(String.format("• Price per Share: $%.2f<br>", pricePerShare));
            bodyBuilder.append(String.format("• Total Amount: $%.2f<br>", totalAmount));

            if (profitLoss != null) {
                String profitColor = profitLoss.compareTo(BigDecimal.ZERO) >= 0 ? "green" : "red";
                String profitSymbol = profitLoss.compareTo(BigDecimal.ZERO) >= 0 ? "+" : "";
                bodyBuilder.append(String.format("• <span style='color: %s'>Profit/Loss: %s$%.2f</span><br>",
                        profitColor, profitSymbol, profitLoss));
            }

            bodyBuilder.append(
                    "<br>You can view your updated portfolio in your <a href='/portfolio'>Portfolio</a>.<br><br>");
            bodyBuilder.append("Happy trading! 🚀<br><br>");
            bodyBuilder.append("Best regards,<br>");
            bodyBuilder.append("<strong>Stock Simulator Team</strong>");

            notificationService.sendToUser(systemUserId, userId, subject, bodyBuilder.toString());
        } catch (Exception e) {
            log.error("Failed to send trade notification for user {} after {} trade of {}: {}",
                    userId, tradeType, symbol, e.getMessage());
        }
    }

    private Long getSystemUserId() {
        return userService.getAllUsers().stream()
                .filter(user -> user.getRoles().contains(com.portfolio.demo_backend.model.enums.Role.ROLE_ADMIN))
                .findFirst()
                .map(User::getId)
                .orElse(1L);
    }
}
