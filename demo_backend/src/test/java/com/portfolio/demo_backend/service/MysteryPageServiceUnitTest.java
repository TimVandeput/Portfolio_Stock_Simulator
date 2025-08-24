package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.dto.MysteryPageDTO;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.mysteryPage;
import com.portfolio.demo_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MysteryPageServiceUnitTest {

    @Mock
    UserRepository userRepository;

    MysteryPageService service;

    @BeforeEach
    void setUp() {
        service = new MysteryPageService(userRepository) {
            @Override
            protected String fetchWikipediaExtract(String title) {
                return "FAKE CONTENT FOR: " + title;
            }
        };
    }

    @Test
    void whenUserNotFound_throws() {
        when(userRepository.findById(42L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> service.createOrUpdateMysteryPageDto(42L, "Test"));
    }

    @Test
    void whenNoPage_createsAndSaves() {
        User u = new User();
        u.setId(1L);
        u.setUsername("bob");

        when(userRepository.findById(1L)).thenReturn(Optional.of(u));

        MysteryPageDTO out = service.createOrUpdateMysteryPageDto(1L, "MyTitle");

        ArgumentCaptor<User> cap = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(cap.capture());

        User saved = cap.getValue();
        mysteryPage p = saved.getMysteryPage();
        assertThat(p).isNotNull();
        assertThat(p.getTitle()).isEqualTo("MyTitle");
        assertThat(p.getContent()).contains("FAKE CONTENT FOR: MyTitle");

        assertThat(out.getTitle()).isEqualTo("MyTitle");
        assertThat(out.getContent()).contains("FAKE CONTENT FOR: MyTitle");
    }

    @Test
    void whenPageExists_updatesAndSaves() {
        User u = new User();
        u.setId(2L);
        u.setUsername("alice");
        mysteryPage existing = new mysteryPage();
        existing.setId(2L);
        existing.setTitle("Old");
        existing.setContent("old content");
        existing.setUser(u);
        u.setMysteryPage(existing);

        when(userRepository.findById(2L)).thenReturn(Optional.of(u));

        MysteryPageDTO out = service.createOrUpdateMysteryPageDto(2L, "NewTitle");

        ArgumentCaptor<User> cap = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(cap.capture());

        User saved = cap.getValue();
        mysteryPage p = saved.getMysteryPage();
        assertThat(p.getTitle()).isEqualTo("NewTitle");
        assertThat(p.getContent()).contains("FAKE CONTENT FOR: NewTitle");

        assertThat(out.getTitle()).isEqualTo("NewTitle");
    }
}
