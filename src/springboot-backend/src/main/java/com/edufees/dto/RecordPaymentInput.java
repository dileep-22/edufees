package com.edufees.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import com.edufees.enums.PaymentMethod;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordPaymentInput {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Fee structure ID is required")
    private Long feeStructureId;

    @NotNull(message = "Date is required")
    private Instant date;

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be non-negative")
    private Long amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod method;

    @NotBlank(message = "Receipt number is required")
    private String receiptNumber;

    private String notes;
}
