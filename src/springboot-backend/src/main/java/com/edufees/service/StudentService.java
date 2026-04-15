package com.edufees.service;

import com.edufees.dto.*;
import com.edufees.entity.FeeAssignment;
import com.edufees.entity.FeeStructure;
import com.edufees.entity.Student;
import com.edufees.enums.PaymentStatus;
import com.edufees.exception.ResourceNotFoundException;
import com.edufees.exception.DuplicateResourceException;
import com.edufees.repository.FeeAssignmentRepository;
import com.edufees.repository.FeeStructureRepository;
import com.edufees.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeeAssignmentRepository feeAssignmentRepository;

    @Transactional
    public Student createStudent(CreateStudentInput input) {
        if (studentRepository.findByStudentId(input.getStudentId()).isPresent()) {
            throw new DuplicateResourceException("Student with ID " + input.getStudentId() + " already exists");
        }
        if (studentRepository.findByEmail(input.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Student with email " + input.getEmail() + " already exists");
        }

        Student student = Student.builder()
                .studentId(input.getStudentId())
                .name(input.getName())
                .email(input.getEmail())
                .group(input.getGroup())
                .build();

        return studentRepository.save(student);
    }

    @Transactional
    public Student updateStudent(UpdateStudentInput input) {
        Student student = studentRepository.findById(input.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + input.getId()));

        if (!student.getStudentId().equals(input.getStudentId())) {
            if (studentRepository.findByStudentId(input.getStudentId()).isPresent()) {
                throw new DuplicateResourceException("Student with ID " + input.getStudentId() + " already exists");
            }
        }
        if (!student.getEmail().equals(input.getEmail())) {
            if (studentRepository.findByEmail(input.getEmail()).isPresent()) {
                throw new DuplicateResourceException("Student with email " + input.getEmail() + " already exists");
            }
        }

        student.setStudentId(input.getStudentId());
        student.setName(input.getName());
        student.setEmail(input.getEmail());
        student.setGroup(input.getGroup());

        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        studentRepository.delete(student);
    }

    @Transactional
    public ImportResult importStudents(MultipartFile file) {
        List<ImportRowError> errors = new ArrayList<>();
        Long imported = 0L;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            
            String line;
            int rowNumber = 0;
            
            while ((line = reader.readLine()) != null) {
                rowNumber++;
                
                // Skip header row
                if (rowNumber == 1) {
                    continue;
                }

                String[] parts = line.split(",");
                if (parts.length < 4) {
                    errors.add(ImportRowError.builder()
                            .row((long) rowNumber)
                            .field("row")
                            .value(line)
                            .message("Invalid format: expected 4 columns")
                            .build());
                    continue;
                }

                try {
                    CreateStudentInput input = CreateStudentInput.builder()
                            .name(parts[0].trim())
                            .studentId(parts[1].trim())
                            .email(parts[2].trim())
                            .group(parts[3].trim())
                            .build();
                    
                    createStudent(input);
                    imported++;
                } catch (DuplicateResourceException e) {
                    errors.add(ImportRowError.builder()
                            .row((long) rowNumber)
                            .field("studentId/email")
                            .value(line)
                            .message(e.getMessage())
                            .build());
                } catch (Exception e) {
                    errors.add(ImportRowError.builder()
                            .row((long) rowNumber)
                            .field("row")
                            .value(line)
                            .message(e.getMessage())
                            .build());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to import students: " + e.getMessage(), e);
        }

        return ImportResult.builder()
                .imported(imported)
                .errors(errors)
                .build();
    }

    @Transactional
    public FeeAssignment assignFeeToStudent(Long studentId, Long feeStructureId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        
        FeeStructure feeStructure = feeStructureRepository.findById(feeStructureId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee structure not found with id: " + feeStructureId));

        if (feeAssignmentRepository.findByStudentIdAndFeeStructureId(studentId, feeStructureId).isPresent()) {
            throw new DuplicateResourceException("Fee structure already assigned to student");
        }

        FeeAssignment assignment = FeeAssignment.builder()
                .student(student)
                .feeStructure(feeStructure)
                .status(PaymentStatus.PENDING)
                .build();

        return feeAssignmentRepository.save(assignment);
    }

    public List<FeeAssignment> getFeeAssignmentsForStudent(Long studentId) {
        return feeAssignmentRepository.findByStudentId(studentId);
    }

    public List<StudentBalance> getStudentBalances() {
        List<Student> students = studentRepository.findAll();
        return students.stream()
                .map(this::calculateStudentBalance)
                .collect(Collectors.toList());
    }

    public StudentBalance getStudentBalance(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return calculateStudentBalance(student);
    }

    private StudentBalance calculateStudentBalance(Student student) {
        List<FeeAssignment> assignments = feeAssignmentRepository.findByStudentId(student.getId());
        
        long totalAmount = 0;
        long paidAmount = 0;
        long penaltyAmount = 0;
        PaymentStatus overallStatus = PaymentStatus.PAID;
        Instant earliestDueDate = null;

        for (FeeAssignment assignment : assignments) {
            FeeStructure feeStructure = assignment.getFeeStructure();
            totalAmount += feeStructure.getAmount();

            if (earliestDueDate == null || feeStructure.getDueDate().isBefore(earliestDueDate)) {
                earliestDueDate = feeStructure.getDueDate();
            }

            // Calculate paid amount from payments
            // This would need a payment repository query in a real implementation
            
            if (assignment.getStatus() == PaymentStatus.PENDING) {
                overallStatus = PaymentStatus.PENDING;
            } else if (assignment.getStatus() == PaymentStatus.OVERDUE) {
                overallStatus = PaymentStatus.OVERDUE;
            }
        }

        long outstandingAmount = totalAmount - paidAmount;

        return StudentBalance.builder()
                .studentId(student.getId())
                .studentName(student.getName())
                .totalAmount(totalAmount)
                .paidAmount(paidAmount)
                .outstandingAmount(outstandingAmount)
                .penaltyAmount(penaltyAmount)
                .totalWithPenalty(outstandingAmount + penaltyAmount)
                .status(overallStatus)
                .dueDate(earliestDueDate)
                .build();
    }
}
