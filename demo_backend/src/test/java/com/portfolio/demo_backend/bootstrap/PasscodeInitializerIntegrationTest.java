package com.portfolio.demo_backend.bootstrap;

import com.portfolio.demo_backend.model.Passcode;
import com.portfolio.demo_backend.repository.PasscodeRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PasscodeInitializerIntegrationTest {

    @Autowired
    PasscodeRepository repo;
    @Autowired
    PasswordEncoder encoder;

    @Test
    void seedsOnStartup_andStoresHashedPasscode() {
        assertThat(repo.count()).isEqualTo(1);

        Passcode pc = repo.findAll().get(0);
        assertThat(pc.isActive()).isTrue();

        assertThat(encoder.matches("ItWorks123", pc.getCodeHash())).isTrue();
    }
}
