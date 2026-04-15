package com.edufees.controller;

import com.edufees.dto.RecordPaymentInput;
import com.edufees.entity.Payment;
import com.edufees.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> recordPayment(@Valid @RequestBody RecordPaymentInput input) {
        Payment payment = paymentService.recordPayment(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Payment>> getPaymentsByStudentId(@PathVariable Long studentId) {
        List<Payment> payments = paymentService.getPaymentsByStudentId(studentId);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/fee-structure/{feeStructureId}")
    public ResponseEntity<List<Payment>> getPaymentsByFeeStructureId(@PathVariable Long feeStructureId) {
        List<Payment> payments = paymentService.getPaymentsByFeeStructureId(feeStructureId);
        return ResponseEntity.ok(payments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
