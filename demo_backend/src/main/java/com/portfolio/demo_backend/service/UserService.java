package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.user.UserAlreadyExistsException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.user.WeakPasswordException;
import com.portfolio.demo_backend.model.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.EnumSet;

import java.util.List;
import java.util.regex.Pattern;
import com.portfolio.demo_backend.dto.MysteryPageDTO;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MysteryPageService mysteryPageService;

    private static final Pattern PWD_RULE = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d).{8,128}$");

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            MysteryPageService mysteryPageService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.mysteryPageService = mysteryPageService;
    }

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        validateAndEncodePassword(user);

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            user.setRoles(EnumSet.of(Role.ROLE_USER, Role.ROLE_ADMIN));
        } else {
            user.setRoles(EnumSet.copyOf(user.getRoles()));
        }

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    public User updateUser(Long id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        if (updatedUser.getUsername() != null) {
            String newUsername = updatedUser.getUsername().trim();
            if (!newUsername.equals(user.getUsername())
                    && userRepository.findByUsername(newUsername).isPresent()) {
                throw new UserAlreadyExistsException(newUsername);
            }
            user.setUsername(newUsername);
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            validateAndEncodePassword(updatedUser);
            user.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        userRepository.deleteById(id);
    }

    public MysteryPageDTO createOrUpdateMysteryPageDto(Long userId, String title) {
        return mysteryPageService.createOrUpdateMysteryPageDto(userId, title);
    }

    private void validateAndEncodePassword(User user) {
        String rawPassword = user.getPassword();
        if (!PWD_RULE.matcher(rawPassword).matches()) {
            throw new WeakPasswordException();
        }
        user.setPassword(passwordEncoder.encode(rawPassword));
    }
}
