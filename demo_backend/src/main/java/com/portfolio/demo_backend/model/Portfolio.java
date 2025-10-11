package com.portfolio.demo_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * A user's position in a particular {@link Symbol}, tracking shares owned and
 * average cost basis. Unique per (user, symbol) pair.
 */
@Entity
@Table(name = "portfolios", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "symbol_id" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "shares_owned", nullable = false)
    private Integer sharesOwned;

    @Column(name = "average_cost_basis", precision = 15, scale = 2, nullable = false)
    private BigDecimal averageCostBasis;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symbol_id", referencedColumnName = "id")
    private Symbol symbol;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    /**
     * Calculates current position value.
     *
     * @param currentPrice the latest price per share; must be non-null
     * @return {@code currentPrice * sharesOwned}
     */
    public BigDecimal getTotalValue(BigDecimal currentPrice) {
        return currentPrice.multiply(new BigDecimal(this.sharesOwned));
    }

    /**
     * Calculates unrealized P/L:
     * {@code (currentPrice * shares) - (avgCost * shares)}.
     *
     * @param currentPrice the latest price per share; must be non-null
     * @return unrealized gain or loss (may be negative)
     */
    public BigDecimal getUnrealizedGainLoss(BigDecimal currentPrice) {
        BigDecimal totalCost = this.averageCostBasis.multiply(new BigDecimal(this.sharesOwned));
        BigDecimal currentValue = getTotalValue(currentPrice);
        return currentValue.subtract(totalCost);
    }
}
