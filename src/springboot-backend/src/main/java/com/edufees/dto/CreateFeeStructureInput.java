package com.edufees.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import com.edufees.enums.FeePeriod;
import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFeeStructureInput {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Amount is required")
    @Min(value = 0, message = "Amount must be non-negative")
    private Long amount;

    @NotNull(message = "Period is required")
    private FeePeriod period;

    @NotNull(message = "Start date is required")
    private Instant startDate;

    @NotNull(message = "End date is required")
    private Instant endDate;

    @NotNull(message = "Due date is required")
    private Instant dueDate;

    private LatePenaltyInput latePenalty;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
class LatePenaltyInput {

    private String type; // FIXED or PERCENTAGE
    private Long value;
}
