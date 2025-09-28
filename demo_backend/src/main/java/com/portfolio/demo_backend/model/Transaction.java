package com.portfolio.demo_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.portfolio.demo_backend.model.enums.TransactionType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TransactionType type;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price_per_share", precision = 15, scale = 2, nullable = false)
    private BigDecimal pricePerShare;

    @Column(name = "total_amount", precision = 15, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "executed_at", nullable = false)
    private Instant executedAt;

    @Column(name = "profit_loss", precision = 15, scale = 2)
    private BigDecimal profitLoss;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "symbol", referencedColumnName = "symbol")
    private Symbol symbol;

    @PrePersist
    protected void onCreate() {
        this.executedAt = Instant.now();
        if (this.totalAmount == null && this.pricePerShare != null && this.quantity != null) {
            this.totalAmount = this.pricePerShare.multiply(new BigDecimal(this.quantity));
        }
    }
}
