package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.Assignment;
import com.erp.erp_backend.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentRepository assignmentRepository;

    // GET all assignments
    @GetMapping
    public ResponseEntity<List<Assignment>> getAllAssignments() {
        return ResponseEntity.ok(assignmentRepository.findAll());
    }

    // GET assignments by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Assignment>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(assignmentRepository.findByStudentId(studentId));
    }

    // GET assignments by subject
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Assignment>> getBySubject(@PathVariable String subjectId) {
        return ResponseEntity.ok(assignmentRepository.findBySubjectId(subjectId));
    }

    // GET single assignment
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return assignmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create / submit assignment
    @PostMapping
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        if (assignment.getStatus() == null || assignment.getStatus().isBlank()) {
            assignment.setStatus("SUBMITTED");
        }
        return ResponseEntity.ok(assignmentRepository.save(assignment));
    }

    // PUT update assignment (e.g. grade it)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<Assignment> opt = assignmentRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Assignment asgn = opt.get();
        if (updates.containsKey("status"))      asgn.setStatus((String) updates.get("status"));
        if (updates.containsKey("title"))       asgn.setTitle((String) updates.get("title"));
        if (updates.containsKey("description")) asgn.setDescription((String) updates.get("description"));
        if (updates.containsKey("subject"))     asgn.setSubject((String) updates.get("subject"));
        if (updates.containsKey("subjectId"))   asgn.setSubjectId((String) updates.get("subjectId"));
        if (updates.containsKey("dueDate"))     asgn.setDueDate((String) updates.get("dueDate"));

        return ResponseEntity.ok(assignmentRepository.save(asgn));
    }

    // DELETE assignment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable String id) {
        if (!assignmentRepository.existsById(id)) return ResponseEntity.notFound().build();
        assignmentRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Assignment deleted"));
    }
}
