package com.portfolio.demo_backend.bootstrap;

import com.portfolio.demo_backend.config.RegistrationProperties;
import com.portfolio.demo_backend.model.Passcode;
import com.portfolio.demo_backend.repository.PasscodeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PasscodeInitializerUnitTest {

    @Mock
    PasscodeRepository repo;
    @Mock
    PasswordEncoder encoder;

    RegistrationProperties props;

    PasscodeInitializer initializer;

    @BeforeEach
    void setUp() {
        props = new RegistrationProperties();
        initializer = new PasscodeInitializer(repo, encoder, props);
    }

    @Test
    void whenAlreadySeeded_doesNothing() throws Exception {
        when(repo.count()).thenReturn(1L);

        initializer.run();

        verify(repo, never()).save(any());
        verifyNoInteractions(encoder);
    }

    @Test
    void whenNoPasscodeConfigured_doesNothing() throws Exception {
        when(repo.count()).thenReturn(0L);
        props.setPasscode(null);

        initializer.run();

        verify(repo, never()).save(any());
        verifyNoInteractions(encoder);
    }

    @Test
    void whenPasscodeConfigured_savesEncodedActiveTrue() throws Exception {
        when(repo.count()).thenReturn(0L);
        props.setPasscode("LetMeIn2025");
        when(encoder.encode("LetMeIn2025")).thenReturn("ENCODED");

        initializer.run();

        ArgumentCaptor<Passcode> captor = ArgumentCaptor.forClass(Passcode.class);
        verify(repo).save(captor.capture());

        Passcode saved = captor.getValue();
        assertThat(saved.getCodeHash()).isEqualTo("ENCODED");
        assertThat(saved.isActive()).isTrue();
    }
}
