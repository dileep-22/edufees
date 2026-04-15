package com.edufees.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImportResult {

    private Long imported;
    private List<ImportRowError> errors;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class ImportRowError {

    private Long row;
    private String field;
    private String value;
    private String message;
}
