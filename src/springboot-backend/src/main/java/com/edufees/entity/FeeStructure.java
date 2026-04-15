package com.edufees.entity;

import jakarta.persistence.*;
import lombok.*;
import com.edufees.enums.FeePeriod;
import java.time.Instant;

@Entity
@Table(name = "fee_structures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Long amount; // in cents

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FeePeriod period;

    @Column(nullable = false)
    private Instant startDate;

    @Column(nullable = false)
    private Instant endDate;

    @Column(nullable = false)
    private Instant dueDate;

    @Embedded
    private LatePenalty latePenalty;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
class LatePenalty {

    @Enumerated(EnumType.STRING)
    private PenaltyType type;

    private Long value; // fixed amount in cents or percentage in basis points

    public enum PenaltyType {
        FIXED,
        PERCENTAGE
    }
}
