package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.user.UserAlreadyExistsException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.user.WeakPasswordException;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;
import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.repository.WalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceUnitTest {

    @Mock
    UserRepository userRepository;
    @Mock
    PasswordEncoder passwordEncoder;
    @Mock
    WalletRepository walletRepository;

    @InjectMocks
    UserService userService;

    private User user;

    @BeforeEach
    void setup() {
        user = User.builder()
                .id(1L)
                .username("tim")
                .password("Pass1234")
                .build();
    }

    @Test
    void createUser_happyPath_encodesPassword_andSaves() {
        when(userRepository.findByUsername("tim")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("Pass1234")).thenReturn("ENCODED");

        User savedUser = User.builder()
                .id(1L)
                .username("tim")
                .password("ENCODED")
                .build();
        when(userRepository.save(any(User.class)))
                .thenReturn(savedUser);

        User saved = userService.createUser(user);

        assertThat(saved.getPassword()).isEqualTo("ENCODED");
        verify(userRepository).findByUsername("tim");
        verify(passwordEncoder).encode("Pass1234");
        verify(userRepository).save(any(User.class));

        ArgumentCaptor<Wallet> walletCaptor = ArgumentCaptor.forClass(Wallet.class);
        verify(walletRepository).save(walletCaptor.capture());

        Wallet createdWallet = walletCaptor.getValue();
        assertThat(createdWallet.getUser()).isEqualTo(savedUser);
    }

    @Test
    void createUser_duplicateUsername_throws() {
        when(userRepository.findByUsername("tim")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> userService.createUser(user))
                .isInstanceOf(UserAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void createUser_weakPassword_throws() {
        user.setPassword("short1");
        when(userRepository.findByUsername("tim")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.createUser(user))
                .isInstanceOf(WeakPasswordException.class);

        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void getUserById_found_returnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User found = userService.getUserById(1L);

        assertThat(found).isEqualTo(user);
    }

    @Test
    void getUserById_notFound_throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(99L))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void getAllUsers_returnsList() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        List<User> all = userService.getAllUsers();

        assertThat(all).containsExactly(user);
    }


}
