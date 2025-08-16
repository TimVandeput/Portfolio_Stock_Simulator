package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.user.InvalidPasscodeException;
import com.portfolio.demo_backend.model.Passcode;
import com.portfolio.demo_backend.repository.PasscodeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PasscodeServiceUnitTest {

    @Mock
    PasscodeRepository repo;
    @Mock
    PasswordEncoder encoder;

    @InjectMocks
    PasscodeService service;

    @Test
    void validate_null_throws() {
        assertThatThrownBy(() -> service.validate(null))
                .isInstanceOf(InvalidPasscodeException.class);
    }

    @Test
    void validate_blank_throws() {
        assertThatThrownBy(() -> service.validate("   "))
                .isInstanceOf(InvalidPasscodeException.class);
    }

    @Test
    void validate_noActive_inDb_throws() {
        when(repo.findFirstByActiveTrue()).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.validate("code"))
                .isInstanceOf(InvalidPasscodeException.class);
    }

    @Test
    void validate_mismatch_throws() {
        Passcode pc = Passcode.builder().codeHash("HASH").active(true).build();
        when(repo.findFirstByActiveTrue()).thenReturn(Optional.of(pc));
        when(encoder.matches("wrong", "HASH")).thenReturn(false);

        assertThatThrownBy(() -> service.validate("wrong"))
                .isInstanceOf(InvalidPasscodeException.class);
    }

    @Test
    void validate_match_ok() {
        Passcode pc = Passcode.builder().codeHash("HASH").active(true).build();
        when(repo.findFirstByActiveTrue()).thenReturn(Optional.of(pc));
        when(encoder.matches("right", "HASH")).thenReturn(true);

        service.validate("right");
    }
}
