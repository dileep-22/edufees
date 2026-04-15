package com.edufees.dto;

import lombok.*;
import com.edufees.enums.PaymentStatus;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentBalance {

    private Long studentId;
    private String studentName;
    private Long feeStructureId;
    private String feeStructureName;
    private Long totalAmount;
    private Long paidAmount;
    private Long outstandingAmount;
    private Long penaltyAmount;
    private Long totalWithPenalty;
    private PaymentStatus status;
    private Instant dueDate;
}
