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

    @Test
    void updateUser_changeUsername_onlyWhenUnique() {
        User existing = User.builder().id(1L).username("tim").password("HASH").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.findByUsername("timnieuw")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User patch = User.builder().username("timnieuw").build();
        User updated = userService.updateUser(1L, patch);

        assertThat(updated.getUsername()).isEqualTo("timnieuw");
        assertThat(updated.getPassword()).isEqualTo("HASH");
    }

    @Test
    void updateUser_changeUsername_toExisting_throws() {
        User existing = User.builder().id(1L).username("tim").password("HASH").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.findByUsername("taken")).thenReturn(Optional.of(new User()));

        User patch = User.builder().username("taken").build();

        assertThatThrownBy(() -> userService.updateUser(1L, patch))
                .isInstanceOf(UserAlreadyExistsException.class);

        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_changePassword_validatesAndEncodes() {
        User existing = User.builder().id(1L).username("tim").password("OLDHASH").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(passwordEncoder.encode("Newpass1")).thenReturn("NEWHASH");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User patch = User.builder().password("Newpass1").build();
        User updated = userService.updateUser(1L, patch);

        assertThat(updated.getPassword()).isEqualTo("NEWHASH");
        verify(passwordEncoder).encode("Newpass1");
    }

    @Test
    void updateUser_passwordNull_keepsOld() {
        User existing = User.builder().id(1L).username("tim").password("OLDHASH").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User patch = User.builder().password(null).build();
        User updated = userService.updateUser(1L, patch);

        assertThat(updated.getPassword()).isEqualTo("OLDHASH");
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void updateUser_passwordBlank_keepsOld() {
        User existing = User.builder().id(1L).username("tim").password("OLDHASH").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User patch = User.builder().password("   ").build();
        User updated = userService.updateUser(1L, patch);

        assertThat(updated.getPassword()).isEqualTo("OLDHASH");
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void updateUser_noFieldsProvided_keepsAll() {
        User existing = User.builder().id(1L).username("tim").password("HASH").build();
        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User patch = new User();
        User updated = userService.updateUser(1L, patch);

        assertThat(updated.getUsername()).isEqualTo("tim");
        assertThat(updated.getPassword()).isEqualTo("HASH");
    }

    @Test
    void deleteUser_exists_deletes() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.deleteUser(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_notFound_throws() {
        when(userRepository.existsById(1L)).thenReturn(false);

        assertThatThrownBy(() -> userService.deleteUser(1L))
                .isInstanceOf(UserNotFoundException.class);

        verify(userRepository, never()).deleteById(anyLong());
    }
}
