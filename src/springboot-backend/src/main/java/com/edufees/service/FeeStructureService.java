package com.edufees.service;

import com.edufees.dto.*;
import com.edufees.entity.FeeStructure;
import com.edufees.exception.ResourceNotFoundException;
import com.edufees.repository.FeeStructureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FeeStructureService {

    private final FeeStructureRepository feeStructureRepository;

    @Transactional
    public FeeStructure createFeeStructure(CreateFeeStructureInput input) {
        FeeStructure feeStructure = FeeStructure.builder()
                .name(input.getName())
                .description(input.getDescription())
                .amount(input.getAmount())
                .period(input.getPeriod())
                .startDate(input.getStartDate())
                .endDate(input.getEndDate())
                .dueDate(input.getDueDate())
                .build();

        if (input.getLatePenalty() != null) {
            com.edufees.entity.LatePenalty penalty = new com.edufees.entity.LatePenalty();
            penalty.setType(com.edufees.entity.LatePenalty.PenaltyType.valueOf(input.getLatePenalty().getType()));
            penalty.setValue(input.getLatePenalty().getValue());
            feeStructure.setLatePenalty(penalty);
        }

        return feeStructureRepository.save(feeStructure);
    }

    @Transactional
    public FeeStructure updateFeeStructure(UpdateFeeStructureInput input) {
        FeeStructure feeStructure = feeStructureRepository.findById(input.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + input.getId()));

        feeStructure.setName(input.getName());
        feeStructure.setDescription(input.getDescription());
        feeStructure.setAmount(input.getAmount());
        feeStructure.setPeriod(input.getPeriod());
        feeStructure.setStartDate(input.getStartDate());
        feeStructure.setEndDate(input.getEndDate());
        feeStructure.setDueDate(input.getDueDate());

        if (input.getLatePenalty() != null) {
            com.edufees.entity.LatePenalty penalty = new com.edufees.entity.LatePenalty();
            penalty.setType(com.edufees.entity.LatePenalty.PenaltyType.valueOf(input.getLatePenalty().getType()));
            penalty.setValue(input.getLatePenalty().getValue());
            feeStructure.setLatePenalty(penalty);
        } else {
            feeStructure.setLatePenalty(null);
        }

        return feeStructureRepository.save(feeStructure);
    }

    public List<FeeStructure> getAllFeeStructures() {
        return feeStructureRepository.findAll();
    }

    public FeeStructure getFeeStructureById(Long id) {
        return feeStructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + id));
    }

    @Transactional
    public void deleteFeeStructure(Long id) {
        FeeStructure feeStructure = feeStructureRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + id));
        feeStructureRepository.delete(feeStructure);
    }
}
