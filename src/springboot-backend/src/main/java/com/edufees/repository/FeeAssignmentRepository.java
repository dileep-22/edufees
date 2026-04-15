package com.edufees.repository;

import com.edufees.entity.FeeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeAssignmentRepository extends JpaRepository<FeeAssignment, Long> {

    List<FeeAssignment> findByStudentId(Long studentId);

    List<FeeAssignment> findByFeeStructureId(Long feeStructureId);

    Optional<FeeAssignment> findByStudentIdAndFeeStructureId(Long studentId, Long feeStructureId);

    List<FeeAssignment> findByStudentIdAndStatus(Long studentId, com.edufees.enums.PaymentStatus status);
}
