package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.portfolio.PortfolioHoldingResponseDTO;
import com.portfolio.demo_backend.dto.portfolio.PortfolioResponseDTO;
import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumSet;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PortfolioServiceIntegrationTest {

    @Autowired
    private PortfolioService portfolioService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private SymbolRepository symbolRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    private User testUser;
    private Wallet testWallet;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .password("encodedpassword")
                .roles(EnumSet.of(Role.ROLE_USER))
                .build();
        testUser = userRepository.save(testUser);

        testWallet = new Wallet();
        testWallet.setUser(testUser);
        testWallet.setCashBalance(BigDecimal.valueOf(5000.00));
        testWallet = walletRepository.save(testWallet);
    }

    @Test
    void getUserPortfolio_withEmptyPortfolio_returnsCorrectStructure() {
        PortfolioResponseDTO portfolio = portfolioService.getUserPortfolio(testUser.getId());

        assertThat(portfolio).isNotNull();
        assertThat(portfolio.getHoldings()).isEmpty();
        assertThat(portfolio.getWalletBalance().getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(5000.00));
        assertThat(portfolio.getWalletBalance().getTotalInvested()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(portfolio.getSummary()).isNotNull();
    }

    @Test
    void getUserPortfolio_withHoldings_returnsCorrectData() {
        Symbol symbol = new Symbol();
        symbol.setSymbol("AAPL");
        symbol.setName("Apple Inc.");
        symbol.setEnabled(true);
        symbol = symbolRepository.save(symbol);

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setUser(testUser);
        portfolio.setSymbol(symbol);
        portfolio.setSharesOwned(10);
        portfolio.setAverageCostBasis(BigDecimal.valueOf(150.00));
        portfolioRepository.save(portfolio);

        PortfolioResponseDTO result = portfolioService.getUserPortfolio(testUser.getId());

        assertThat(result).isNotNull();
        assertThat(result.getHoldings()).hasSize(1);

        PortfolioHoldingResponseDTO holding = result.getHoldings().get(0);
        assertThat(holding.getSymbol()).isEqualTo("AAPL");
        assertThat(holding.getQuantity()).isEqualTo(10);
        assertThat(holding.getAvgCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(holding.getTotalCost()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));

        assertThat(result.getWalletBalance().getTotalInvested()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));
    }

    @Test
    void getUserHolding_existingSymbol_returnsHolding() {
        Symbol symbol = new Symbol();
        symbol.setSymbol("GOOGL");
        symbol.setName("Alphabet Inc.");
        symbol.setEnabled(true);
        symbol = symbolRepository.save(symbol);

        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(testUser.getId());
        portfolio.setUser(testUser);
        portfolio.setSymbol(symbol);
        portfolio.setSharesOwned(5);
        portfolio.setAverageCostBasis(BigDecimal.valueOf(120.00));
        portfolioRepository.save(portfolio);

        PortfolioHoldingResponseDTO holding = portfolioService.getUserHolding(testUser.getId(), "GOOGL");

        assertThat(holding).isNotNull();
        assertThat(holding.getSymbol()).isEqualTo("GOOGL");
        assertThat(holding.getQuantity()).isEqualTo(5);
        assertThat(holding.getAvgCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(120.00));
        assertThat(holding.getTotalCost()).isEqualByComparingTo(BigDecimal.valueOf(600.00));
    }

    @Test
    void getUserHolding_nonExistentSymbol_returnsEmptyHolding() {
        PortfolioHoldingResponseDTO holding = portfolioService.getUserHolding(testUser.getId(), "NONEXISTENT");

        assertThat(holding).isNotNull();
        assertThat(holding.getSymbol()).isEqualTo("NONEXISTENT");
        assertThat(holding.getQuantity()).isEqualTo(0);
        assertThat(holding.getAvgCostBasis()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(holding.getTotalCost()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(holding.getLastTradeDate()).isNull();
    }
}
