package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.Marks;
import com.erp.erp_backend.repository.MarksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/marks")
@CrossOrigin(origins = "*")
public class MarksController {

    @Autowired
    private MarksRepository marksRepository;

    // GET all marks
    @GetMapping
    public ResponseEntity<List<Marks>> getAllMarks() {
        return ResponseEntity.ok(marksRepository.findAll());
    }

    // GET marks by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Marks>> getMarksByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(marksRepository.findByStudentId(studentId));
    }

    // GET marks by subject (subjectId)
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Marks>> getMarksBySubject(@PathVariable String subjectId) {
        return ResponseEntity.ok(marksRepository.findBySubjectId(subjectId));
    }

    // GET marks by student AND subject — for student's per-subject view
    @GetMapping("/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<List<Marks>> getMarksByStudentAndSubject(
            @PathVariable String studentId,
            @PathVariable String subjectId) {
        return ResponseEntity.ok(marksRepository.findByStudentIdAndSubjectId(studentId, subjectId));
    }

    // GET single marks record
    @GetMapping("/{id}")
    public ResponseEntity<?> getMarksById(@PathVariable String id) {
        return marksRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create marks
    @PostMapping
    public ResponseEntity<Marks> createMarks(@RequestBody Marks marks) {
        return ResponseEntity.ok(marksRepository.save(marks));
    }

    // PUT update marks
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMarks(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<Marks> optMarks = marksRepository.findById(id);
        if (optMarks.isEmpty()) return ResponseEntity.notFound().build();

        Marks marks = optMarks.get();
        if (updates.containsKey("marksObtained"))
            marks.setMarksObtained(Double.valueOf(updates.get("marksObtained").toString()));
        if (updates.containsKey("totalMarks"))
            marks.setTotalMarks(Double.valueOf(updates.get("totalMarks").toString()));
        if (updates.containsKey("remarks"))
            marks.setRemarks((String) updates.get("remarks"));
        if (updates.containsKey("subjectId"))
            marks.setSubjectId((String) updates.get("subjectId"));

        return ResponseEntity.ok(marksRepository.save(marks));
    }

    // DELETE marks
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMarks(@PathVariable String id) {
        if (!marksRepository.existsById(id)) return ResponseEntity.notFound().build();
        marksRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Marks deleted successfully"));
    }
}
