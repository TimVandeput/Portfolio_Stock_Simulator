package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Repository for accessing and mutating {@link User} aggregates.
 * <p>
 * Notes:
 * - Unique constraints on username and email are enforced at the entity level.
 * - Case-sensitivity of string comparisons depends on database collation.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Finds a user by exact username.
     *
     * @param username the unique username; must not be null
     * @return the user if found, otherwise empty
     */
    Optional<User> findByUsername(String username);

    /**
     * Finds a user by exact email.
     *
     * @param email the unique email address; must not be null
     * @return the user if found, otherwise empty
     */
    Optional<User> findByEmail(String email);

    /**
     * Finds a user by username or email using an OR match.
     *
     * @param usernameOrEmail the username or email to match
     * @return the user if found, otherwise empty
     */
    @Query("SELECT u FROM User u WHERE u.username = :usernameOrEmail OR u.email = :usernameOrEmail")
    Optional<User> findByUsernameOrEmail(@Param("usernameOrEmail") String usernameOrEmail);

    /**
     * Returns users assigned the given role.
     *
     * @param role the role to filter by
     * @return list of users with the role (may be empty)
     */
    @Query("SELECT u FROM User u JOIN u.roles r WHERE r = :role")
    java.util.List<User> findByRole(
            @Param("role") com.portfolio.demo_backend.model.enums.Role role);

}
