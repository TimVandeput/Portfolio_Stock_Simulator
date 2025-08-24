package com.portfolio.demo_backend.bootstrap;

import com.portfolio.demo_backend.config.RegistrationProperties;
import com.portfolio.demo_backend.model.Passcode;
import com.portfolio.demo_backend.repository.PasscodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PasscodeInitializer implements CommandLineRunner {

    private final PasscodeRepository passcodeRepository;
    private final PasswordEncoder passwordEncoder;
    private final RegistrationProperties regProps;

    @Override
    public void run(String... args) {
        seedIfNeeded();
    }

    void seedIfNeeded() {
        int attempts = 5;
        while (attempts-- > 0) {
            try {
                if (passcodeRepository.count() > 0) {
                    return;
                }
                break;
            } catch (org.springframework.dao.DataAccessException e) {
                log.warn("Passcode table not available yet (attempt {}), retrying...: {}", 6 - attempts,
                        e.getMessage());
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ignored) {
                    Thread.currentThread().interrupt();
                    return;
                }
            }
        }

        String raw = regProps.getPasscode();
        if (raw == null || raw.isBlank()) {
            log.warn("No passcode found (app.reg.passcode). Registration will be blocked.");
            return;
        }

        try {
            passcodeRepository.save(
                    Passcode.builder()
                            .codeHash(passwordEncoder.encode(raw))
                            .active(true)
                            .build());
            log.info("Seeded initial registration passcode.");
        } catch (org.springframework.dao.DataAccessException e) {
            log.error("Failed to seed passcode after retries: {}", e.getMessage());
        }
    }
}
