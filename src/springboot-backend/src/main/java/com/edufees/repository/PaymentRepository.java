package com.edufees.repository;

import com.edufees.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByReceiptNumber(String receiptNumber);

    boolean existsByReceiptNumber(String receiptNumber);

    List<Payment> findByStudentId(Long studentId);

    List<Payment> findByFeeStructureId(Long feeStructureId);

    List<Payment> findByDateBetween(java.time.Instant fromDate, java.time.Instant toDate);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.student.id = :studentId AND p.feeStructure.id = :feeStructureId")
    long sumByStudentIdAndFeeStructureId(@Param("studentId") Long studentId, @Param("feeStructureId") Long feeStructureId);
}
