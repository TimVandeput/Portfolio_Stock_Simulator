package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.model.Portfolio;
import com.portfolio.demo_backend.model.Symbol;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.service.data.UserPortfolioData;
import com.portfolio.demo_backend.service.data.UserHoldingData;
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
        UserPortfolioData portfolio = portfolioService.getUserPortfolio(testUser.getId());

        assertThat(portfolio).isNotNull();
        assertThat(portfolio.getPortfolios()).isEmpty();
        assertThat(portfolio.getWallet().getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(5000.00));
        assertThat(portfolio.getTotalInvested()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(portfolio.getTotalValue()).isNotNull();
        assertThat(portfolio.getTotalPL()).isNotNull();
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

        UserPortfolioData result = portfolioService.getUserPortfolio(testUser.getId());

        assertThat(result).isNotNull();
        assertThat(result.getPortfolios()).hasSize(1);

        Portfolio holding = result.getPortfolios().get(0);
        assertThat(holding.getSymbol().getSymbol()).isEqualTo("AAPL");
        assertThat(holding.getSharesOwned()).isEqualTo(10);
        assertThat(holding.getAverageCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(150.00));
        assertThat(holding.getAverageCostBasis().multiply(BigDecimal.valueOf(holding.getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(1500.00));

        assertThat(result.getTotalInvested()).isEqualByComparingTo(BigDecimal.valueOf(1500.00));
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

        UserHoldingData holding = portfolioService.getUserHolding(testUser.getId(), "GOOGL");

        assertThat(holding).isNotNull();
        assertThat(holding.getSymbol()).isEqualTo("GOOGL");
        assertThat(holding.getPortfolio().getSharesOwned()).isEqualTo(5);
        assertThat(holding.getPortfolio().getAverageCostBasis()).isEqualByComparingTo(BigDecimal.valueOf(120.00));
        assertThat(holding.getPortfolio().getAverageCostBasis()
                .multiply(BigDecimal.valueOf(holding.getPortfolio().getSharesOwned())))
                .isEqualByComparingTo(BigDecimal.valueOf(600.00));
    }

    @Test
    void getUserHolding_nonExistentSymbol_returnsEmptyHolding() {
        UserHoldingData holding = portfolioService.getUserHolding(testUser.getId(), "NONEXISTENT");

        assertThat(holding).isNotNull();
        assertThat(holding.getSymbol()).isEqualTo("NONEXISTENT");
        assertThat(holding.isHasHolding()).isFalse();
        assertThat(holding.getPortfolio()).isNull();
    }
}
