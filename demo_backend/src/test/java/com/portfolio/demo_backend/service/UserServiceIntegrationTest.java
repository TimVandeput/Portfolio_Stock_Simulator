package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.user.UserAlreadyExistsException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserServiceIntegrationTest {

    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepository;

    @Test
    void createUser_persists_andEncodesPassword() {
        User u = User.builder().username("tim").password("Pass1234").build();

        User saved = userService.createUser(u);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPassword()).isNotEqualTo("Pass1234");
        assertThat(saved.getPassword()).startsWith("$2");
    }

    @Test
    void createUser_duplicateUsername_throws() {
        userService.createUser(User.builder().username("tim").password("Pass1234").build());

        assertThatThrownBy(() -> userService.createUser(User.builder().username("tim").password("Newpass1").build()))
                .isInstanceOf(UserAlreadyExistsException.class);
    }

    @Test
    void getUserById_found_and_notFound() {
        User saved = userService.createUser(User.builder().username("tim").password("Pass1234").build());

        assertThat(userService.getUserById(saved.getId()).getUsername()).isEqualTo("tim");
        assertThatThrownBy(() -> userService.getUserById(999L))
                .isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void updateUser_username_and_password() {
        User saved = userService.createUser(User.builder().username("tim").password("Pass1234").build());

        User patch = User.builder().username("timnieuw").password("Newpass1").build();
        User updated = userService.updateUser(saved.getId(), patch);

        assertThat(updated.getUsername()).isEqualTo("timnieuw");
        assertThat(updated.getPassword()).isNotEqualTo("Newpass1");
        assertThat(updated.getPassword()).startsWith("$2");
    }

    @Test
    void updateUser_partial_nulls_doNotOverwrite() {
        User saved = userService.createUser(User.builder().username("tim").password("Pass1234").build());
        String oldHash = saved.getPassword();

        userService.updateUser(saved.getId(), User.builder().username("onlyname").build());
        User after1 = userRepository.findById(saved.getId()).orElseThrow();
        assertThat(after1.getUsername()).isEqualTo("onlyname");
        assertThat(after1.getPassword()).isEqualTo(oldHash);

        userService.updateUser(saved.getId(), User.builder().password("Newpass1").build());
        User after2 = userRepository.findById(saved.getId()).orElseThrow();
        assertThat(after2.getUsername()).isEqualTo("onlyname");
        assertThat(after2.getPassword()).isNotEqualTo(oldHash);
        assertThat(after2.getPassword()).startsWith("$2");
    }

    @Test
    void deleteUser_works_and_notFoundThrows() {
        User saved = userService.createUser(User.builder().username("tim").password("Pass1234").build());
        userService.deleteUser(saved.getId());
        assertThatThrownBy(() -> userService.getUserById(saved.getId()))
                .isInstanceOf(UserNotFoundException.class);
    }
}
