package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.StudyMaterial;
import com.erp.erp_backend.repository.StudyMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/materials")
@CrossOrigin(origins = "*")
public class StudyMaterialController {

    @Autowired
    private StudyMaterialRepository materialRepository;

    // GET all materials (newest first)
    @GetMapping
    public ResponseEntity<List<StudyMaterial>> getAll() {
        return ResponseEntity.ok(materialRepository.findAllByOrderByCreatedAtDesc());
    }

    // GET materials by department (for students)
    @GetMapping("/department/{dept}")
    public ResponseEntity<List<StudyMaterial>> getByDept(@PathVariable String dept) {
        return ResponseEntity.ok(materialRepository.findByDepartment(dept));
    }

    // GET materials by subject
    @GetMapping("/subject/{subject}")
    public ResponseEntity<List<StudyMaterial>> getBySubject(@PathVariable String subject) {
        return ResponseEntity.ok(materialRepository.findBySubject(subject));
    }

    // GET materials uploaded by a faculty member
    @GetMapping("/faculty/{facultyId}")
    public ResponseEntity<List<StudyMaterial>> getByFaculty(@PathVariable String facultyId) {
        return ResponseEntity.ok(materialRepository.findByFacultyId(facultyId));
    }

    // GET single material
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return materialRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST upload material (faculty)
    @PostMapping
    public ResponseEntity<StudyMaterial> upload(@RequestBody StudyMaterial material) {
        if (material.getTargetClass() == null) material.setTargetClass("ALL");
        return ResponseEntity.ok(materialRepository.save(material));
    }

    // PUT update material
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<StudyMaterial> opt = materialRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        StudyMaterial m = opt.get();
        if (updates.containsKey("title"))       m.setTitle((String) updates.get("title"));
        if (updates.containsKey("description")) m.setDescription((String) updates.get("description"));
        if (updates.containsKey("subject"))     m.setSubject((String) updates.get("subject"));
        return ResponseEntity.ok(materialRepository.save(m));
    }

    // DELETE material
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!materialRepository.existsById(id)) return ResponseEntity.notFound().build();
        materialRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Material deleted"));
    }
}
