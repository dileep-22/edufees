package com.edufees.controller;

import com.edufees.dto.CreateFeeStructureInput;
import com.edufees.dto.UpdateFeeStructureInput;
import com.edufees.entity.FeeStructure;
import com.edufees.service.FeeStructureService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-structures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeeStructureController {

    private final FeeStructureService feeStructureService;

    @PostMapping
    public ResponseEntity<FeeStructure> createFeeStructure(@Valid @RequestBody CreateFeeStructureInput input) {
        FeeStructure feeStructure = feeStructureService.createFeeStructure(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(feeStructure);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeeStructure> updateFeeStructure(
            @PathVariable Long id,
            @Valid @RequestBody UpdateFeeStructureInput input) {
        input.setId(id);
        FeeStructure feeStructure = feeStructureService.updateFeeStructure(input);
        return ResponseEntity.ok(feeStructure);
    }

    @GetMapping
    public ResponseEntity<List<FeeStructure>> getAllFeeStructures() {
        List<FeeStructure> feeStructures = feeStructureService.getAllFeeStructures();
        return ResponseEntity.ok(feeStructures);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeStructure> getFeeStructureById(@PathVariable Long id) {
        FeeStructure feeStructure = feeStructureService.getFeeStructureById(id);
        return ResponseEntity.ok(feeStructure);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeeStructure(@PathVariable Long id) {
        feeStructureService.deleteFeeStructure(id);
        return ResponseEntity.noContent().build();
    }
}
