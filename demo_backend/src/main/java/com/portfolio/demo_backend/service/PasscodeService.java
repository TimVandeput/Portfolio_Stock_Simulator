package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.user.InvalidPasscodeException;
import com.portfolio.demo_backend.model.Passcode;
import com.portfolio.demo_backend.repository.PasscodeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasscodeService {
    private final PasscodeRepository repo;
    private final PasswordEncoder encoder;

    public PasscodeService(PasscodeRepository repo, PasswordEncoder encoder) {
        this.repo = repo;
        this.encoder = encoder;
    }

    public void validate(String rawPasscode) {
        if (rawPasscode == null || rawPasscode.isBlank()) {
            throw new InvalidPasscodeException();
        }
        Passcode active = repo.findFirstByActiveTrue()
                .orElseThrow(InvalidPasscodeException::new);
        if (!encoder.matches(rawPasscode, active.getCodeHash())) {
            throw new InvalidPasscodeException();
        }
    }
}
