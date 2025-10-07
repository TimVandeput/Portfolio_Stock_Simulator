package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.trading.WalletNotFoundException;

import com.portfolio.demo_backend.marketdata.dto.YahooQuoteDTO;
import com.portfolio.demo_backend.marketdata.service.PriceService;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;

import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.repository.WalletRepository;
import com.portfolio.demo_backend.repository.SymbolRepository;
import com.portfolio.demo_backend.repository.PortfolioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class WalletServiceIntegrationTest {

    @TestConfiguration
    static class MockPriceServiceConfig {
        @Bean
        @Primary
        public PriceService priceService() {
            return mock(PriceService.class);
        }
    }

    @Autowired
    WalletService walletService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    WalletRepository walletRepository;
    @Autowired
    SymbolRepository symbolRepository;
    @Autowired
    PortfolioRepository portfolioRepository;

    @Autowired
    PriceService priceService;

    private User testUser;
    private Wallet testWallet;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .email("testuser@example.com")
                .password("encodedpassword")
                .build();
        testUser = userRepository.save(testUser);

        testWallet = new Wallet();
        testWallet.setUser(testUser);
        testWallet.setCashBalance(BigDecimal.valueOf(1000.00));
        testWallet = walletRepository.save(testWallet);

        reset(priceService);

        Map<String, YahooQuoteDTO> mockQuotes = new HashMap<>();
        mockQuotes.put("AAPL",
                new YahooQuoteDTO("AAPL", 175.50, 2.50, 1.45, "USD", 2800000.0, 173.0, 176.0, 174.0, 1000000.0));
        mockQuotes.put("GOOGL",
                new YahooQuoteDTO("GOOGL", 125.75, -1.25, -0.98, "USD", 1600000.0, 127.0, 128.0, 125.0, 800000.0));

        when(priceService.getAllCurrentPrices()).thenReturn(mockQuotes);
        when(priceService.getCurrentPrice("AAPL")).thenReturn(
                new YahooQuoteDTO("AAPL", 175.50, 2.50, 1.45, "USD", 2800000.0, 173.0, 176.0, 174.0, 1000000.0));
        when(priceService.getCurrentPrice("GOOGL")).thenReturn(
                new YahooQuoteDTO("GOOGL", 125.75, -1.25, -0.98, "USD", 1600000.0, 127.0, 128.0, 125.0, 800000.0));
    }

    @Test
    void getUserWallet_found_and_notFound() {
        Wallet found = walletService.getUserWallet(testUser.getId(), testUser.getUsername());

        assertThat(found).isNotNull();
        assertThat(found.getCashBalance()).isEqualByComparingTo(BigDecimal.valueOf(1000.00));
        assertThat(found.getUser().getId()).isEqualTo(testUser.getId());

        assertThatThrownBy(() -> walletService.getUserWallet(999L, "nonexistent"))
                .isInstanceOf(WalletNotFoundException.class);
    }



    @Test
    void updateWalletBalance_increasesBalance() {
        BigDecimal newBalance = BigDecimal.valueOf(1250.00);

        walletService.updateWalletBalance(testUser.getId(), newBalance);

        Wallet updatedWallet = walletRepository.findById(testWallet.getUserId()).orElseThrow();
        assertThat(updatedWallet.getCashBalance()).isEqualByComparingTo(newBalance);
    }

    @Test
    void updateWalletBalance_decreasesBalance() {
        BigDecimal newBalance = BigDecimal.valueOf(700.00);

        walletService.updateWalletBalance(testUser.getId(), newBalance);

        Wallet updatedWallet = walletRepository.findById(testWallet.getUserId()).orElseThrow();
        assertThat(updatedWallet.getCashBalance()).isEqualByComparingTo(newBalance);
    }


}
