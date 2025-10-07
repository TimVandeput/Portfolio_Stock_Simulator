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

/**
 * Unit tests for {@link UserService} focusing on create and retrieval
 * scenarios.
 *
 * Applies Given/When/Then inline comments and method-level Javadoc for clarity.
 */
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

    /**
     * Given a default user fixture for tests.
     */
    @BeforeEach
    void setup() {
        user = User.builder()
                .id(1L)
                .username("tim")
                .password("Pass1234")
                .build();
    }

    /**
     * Given username not taken and a strong password
     * When createUser is called
     * Then password is encoded, user saved, and a wallet is created for the user
     */
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

        // When
        User saved = userService.createUser(user);

        // Then
        assertThat(saved.getPassword()).isEqualTo("ENCODED");
        verify(userRepository).findByUsername("tim");
        verify(passwordEncoder).encode("Pass1234");
        verify(userRepository).save(any(User.class));

        ArgumentCaptor<Wallet> walletCaptor = ArgumentCaptor.forClass(Wallet.class);
        verify(walletRepository).save(walletCaptor.capture());

        Wallet createdWallet = walletCaptor.getValue();
        assertThat(createdWallet.getUser()).isEqualTo(savedUser);
    }

    /**
     * Given username exists already
     * When createUser is invoked
     * Then UserAlreadyExistsException is thrown and user is not saved
     */
    @Test
    void createUser_duplicateUsername_throws() {
        when(userRepository.findByUsername("tim")).thenReturn(Optional.of(new User()));

        assertThatThrownBy(() -> userService.createUser(user))
                .isInstanceOf(UserAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }

    /**
     * Given a weak password
     * When createUser is invoked
     * Then WeakPasswordException is thrown and nothing is persisted
     */
    @Test
    void createUser_weakPassword_throws() {
        user.setPassword("short1");
        when(userRepository.findByUsername("tim")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.createUser(user))
                .isInstanceOf(WeakPasswordException.class);

        verify(userRepository, never()).save(any());
        verify(passwordEncoder, never()).encode(anyString());
    }

    /**
     * Given an existing user id
     * When getUserById is called
     * Then the user is returned
     */
    @Test
    void getUserById_found_returnsUser() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // When
        User found = userService.getUserById(1L);

        // Then
        assertThat(found).isEqualTo(user);
    }

    /**
     * Given a non-existing user id
     * When getUserById is called
     * Then UserNotFoundException is thrown
     */
    @Test
    void getUserById_notFound_throws() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(99L))
                .isInstanceOf(UserNotFoundException.class);
    }

    /**
     * Given repository returns a list
     * When getAllUsers is called
     * Then the list is returned unchanged
     */
    @Test
    void getAllUsers_returnsList() {
        when(userRepository.findAll()).thenReturn(List.of(user));

        // When
        List<User> all = userService.getAllUsers();

        // Then
        assertThat(all).containsExactly(user);
    }

}
