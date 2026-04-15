package com.edufees.controller;

import com.edufees.dto.*;
import com.edufees.entity.FeeAssignment;
import com.edufees.entity.Student;
import com.edufees.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    @PostMapping
    public ResponseEntity<Student> createStudent(@Valid @RequestBody CreateStudentInput input) {
        Student student = studentService.createStudent(input);
        return ResponseEntity.status(HttpStatus.CREATED).body(student);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStudentInput input) {
        input.setId(id);
        Student student = studentService.updateStudent(input);
        return ResponseEntity.ok(student);
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable Long id) {
        Student student = studentService.getStudentById(id);
        return ResponseEntity.ok(student);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/import")
    public ResponseEntity<ImportResult> importStudents(@RequestParam("file") MultipartFile file) {
        ImportResult result = studentService.importStudents(file);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{studentId}/assign-fee/{feeStructureId}")
    public ResponseEntity<FeeAssignment> assignFeeToStudent(
            @PathVariable Long studentId,
            @PathVariable Long feeStructureId) {
        FeeAssignment assignment = studentService.assignFeeToStudent(studentId, feeStructureId);
        return ResponseEntity.status(HttpStatus.CREATED).body(assignment);
    }

    @GetMapping("/{studentId}/fee-assignments")
    public ResponseEntity<List<FeeAssignment>> getFeeAssignmentsForStudent(@PathVariable Long studentId) {
        List<FeeAssignment> assignments = studentService.getFeeAssignmentsForStudent(studentId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/balances")
    public ResponseEntity<List<StudentBalance>> getStudentBalances() {
        List<StudentBalance> balances = studentService.getStudentBalances();
        return ResponseEntity.ok(balances);
    }

    @GetMapping("/{studentId}/balance")
    public ResponseEntity<StudentBalance> getStudentBalance(@PathVariable Long studentId) {
        StudentBalance balance = studentService.getStudentBalance(studentId);
        return ResponseEntity.ok(balance);
    }
}
