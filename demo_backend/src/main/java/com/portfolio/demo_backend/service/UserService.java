package com.portfolio.demo_backend.service;

import com.portfolio.demo_backend.exception.user.EmailAlreadyExistsException;
import com.portfolio.demo_backend.exception.user.UserAlreadyExistsException;
import com.portfolio.demo_backend.exception.user.UserNotFoundException;
import com.portfolio.demo_backend.exception.user.WeakPasswordException;
import com.portfolio.demo_backend.model.enums.Role;
import com.portfolio.demo_backend.model.User;
import com.portfolio.demo_backend.model.Wallet;

import com.portfolio.demo_backend.repository.UserRepository;
import com.portfolio.demo_backend.repository.WalletRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import java.util.EnumSet;

import java.util.List;
import java.util.regex.Pattern;

/**
 * User domain service for registration and retrieval.
 * <p>
 * Responsibilities:
 * - Create users with password validation and encoding
 * - Initialize a wallet for each new user
 * - Provide lookup operations
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final WalletRepository walletRepository;

    private static final Pattern PWD_RULE = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d).{8,128}$");

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
            WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.walletRepository = walletRepository;
    }

    /**
     * Creates a new user with unique username and email, validates password strength,
     * assigns default roles, persists the user and initializes a wallet.
     *
     * @param user user aggregate to create; must contain username, email and password
     * @return the persisted user
     * @throws com.portfolio.demo_backend.exception.user.UserAlreadyExistsException if username exists
     * @throws com.portfolio.demo_backend.exception.user.EmailAlreadyExistsException if email exists
     * @throws com.portfolio.demo_backend.exception.user.WeakPasswordException if password doesn't match policy
     */
    @Transactional
    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException(user.getUsername());
        }

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException(user.getEmail());
        }

        validateAndEncodePassword(user);

        if (ObjectUtils.isEmpty(user.getRoles())) {
            user.setRoles(EnumSet.of(Role.ROLE_USER));
        } else {
            user.setRoles(EnumSet.copyOf(user.getRoles()));
        }

        User savedUser = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        walletRepository.save(wallet);

        return savedUser;
    }

    /**
     * Lists all users.
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Fetches a user by id.
     *
     * @param id identifier
     * @return user if found
     * @throws com.portfolio.demo_backend.exception.user.UserNotFoundException if not found
     */
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));
    }

    /**
    * Validates the supplied password against the policy and encodes it in place.
    *
    * @param user user aggregate containing the raw password
    * @throws com.portfolio.demo_backend.exception.user.WeakPasswordException if the password doesn't match policy
    */
    private void validateAndEncodePassword(User user) {
        String rawPassword = user.getPassword();
        if (!PWD_RULE.matcher(rawPassword).matches()) {
            throw new WeakPasswordException();
        }
        user.setPassword(passwordEncoder.encode(rawPassword));
    }
}
