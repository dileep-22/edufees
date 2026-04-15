package com.edufees.entity;

import jakarta.persistence.*;
import lombok.*;
import com.edufees.enums.PaymentStatus;
import java.time.Instant;

@Entity
@Table(name = "fee_assignments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "fee_structure_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fee_structure_id", nullable = false)
    private FeeStructure feeStructure;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(columnDefinition = "TEXT")
    private String waivedReason;

    @Column(nullable = false, updatable = false)
    private Instant assignedAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        assignedAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}
