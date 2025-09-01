package com.portfolio.demo_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Table(name = "symbols", indexes = {
        @Index(name = "ix_symbols_symbol", columnList = "symbol", unique = true),
        @Index(name = "ix_symbols_enabled", columnList = "enabled")
})
@Data
public class SymbolEntity {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, length = 20, unique = true)
    private String symbol;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 80)
    private String exchange;

    @Column(length = 10)
    private String currency;

    @Column(length = 20)
    private String mic;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void prePersist() {
        this.createdAt = this.updatedAt = Instant.now();
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
