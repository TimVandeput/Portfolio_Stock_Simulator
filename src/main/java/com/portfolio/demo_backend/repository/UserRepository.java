package com.portfolio.demo_backend.repository;

import com.portfolio.demo_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    
}
