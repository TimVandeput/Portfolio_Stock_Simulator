package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.Passcode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasscodeRepository extends JpaRepository<Passcode, Long> {
    Optional<Passcode> findFirstByActiveTrue();
}
