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
        if (passcodeRepository.count() > 0)
            return;

        String raw = regProps.getPasscode();
        if (raw == null || raw.isBlank()) {
            log.warn("No passcode found (app.reg.passcode). Registration will be blocked.");
            return;
        }

        passcodeRepository.save(
                Passcode.builder()
                        .codeHash(passwordEncoder.encode(raw))
                        .active(true)
                        .build());
        log.info("Seeded initial registration passcode.");
    }
}
