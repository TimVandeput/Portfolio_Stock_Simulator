package com.portfolio.demo_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "passcodes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Passcode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String codeHash;

    @Builder.Default
    @Column(nullable = false)
    private boolean active = true;

}
