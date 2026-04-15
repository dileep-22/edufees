package com.edufees.service;

import com.edufees.dto.RecordPaymentInput;
import com.edufees.entity.FeeAssignment;
import com.edufees.entity.FeeStructure;
import com.edufees.entity.Payment;
import com.edufees.entity.Student;
import com.edufees.enums.PaymentStatus;
import com.edufees.exception.ResourceNotFoundException;
import com.edufees.exception.DuplicateResourceException;
import com.edufees.repository.FeeAssignmentRepository;
import com.edufees.repository.FeeStructureRepository;
import com.edufees.repository.PaymentRepository;
import com.edufees.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeeAssignmentRepository feeAssignmentRepository;

    @Transactional
    public Payment recordPayment(RecordPaymentInput input) {
        Student student = studentRepository.findById(input.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + input.getStudentId()));

        FeeStructure feeStructure = feeStructureRepository.findById(input.getFeeStructureId())
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + input.getFeeStructureId()));

        if (paymentRepository.findByReceiptNumber(input.getReceiptNumber()).isPresent()) {
            throw new DuplicateResourceException("Payment with receipt number " + input.getReceiptNumber() + " already exists");
        }

        Payment payment = Payment.builder()
                .student(student)
                .feeStructure(feeStructure)
                .date(input.getDate())
                .amount(input.getAmount())
                .method(input.getMethod())
                .receiptNumber(input.getReceiptNumber())
                .notes(input.getNotes())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Update fee assignment status
        updateFeeAssignmentStatus(student.getId(), feeStructure.getId());

        return savedPayment;
    }

    private void updateFeeAssignmentStatus(Long studentId, Long feeStructureId) {
        FeeAssignment assignment = feeAssignmentRepository
                .findByStudentIdAndFeeStructureId(studentId, feeStructureId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee assignment not found"));

        FeeStructure feeStructure = assignment.getFeeStructure();
        long totalPaid = paymentRepository.sumByStudentIdAndFeeStructureId(studentId, feeStructureId);

        if (totalPaid >= feeStructure.getAmount()) {
            assignment.setStatus(PaymentStatus.PAID);
        } else if (Instant.now().isAfter(feeStructure.getDueDate())) {
            assignment.setStatus(PaymentStatus.OVERDUE);
        } else {
            assignment.setStatus(PaymentStatus.PENDING);
        }

        feeAssignmentRepository.save(assignment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Payment getPaymentById(Long id) {
        return paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
    }

    public List<Payment> getPaymentsByStudentId(Long studentId) {
        return paymentRepository.findByStudentId(studentId);
    }

    public List<Payment> getPaymentsByFeeStructureId(Long feeStructureId) {
        return paymentRepository.findByFeeStructureId(feeStructureId);
    }

    @Transactional
    public void deletePayment(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id: " + id));
        
        Long studentId = payment.getStudent().getId();
        Long feeStructureId = payment.getFeeStructure().getId();
        
        paymentRepository.delete(payment);
        
        // Update fee assignment status after deletion
        updateFeeAssignmentStatus(studentId, feeStructureId);
    }
}
