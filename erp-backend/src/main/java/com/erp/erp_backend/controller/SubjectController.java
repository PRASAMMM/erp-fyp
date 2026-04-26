package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.Subject;
import com.erp.erp_backend.model.User;
import com.erp.erp_backend.repository.SubjectRepository;
import com.erp.erp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private UserRepository userRepository;

    // ── GET all subjects (Admin view) ─────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(
            subjectRepository.findAll().stream()
                .map(this::enrich)
                .collect(Collectors.toList())
        );
    }

    // ── GET subjects for the logged-in user ───────────────────────────────────
    // role=FACULTY → subjects they teach
    // role=STUDENT → subjects they are enrolled in
    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMine(
            @RequestParam String userId,
            @RequestParam String role) {

        List<Subject> subjects;
        if ("FACULTY".equalsIgnoreCase(role)) {
            subjects = subjectRepository.findByFacultyId(userId);
        } else {
            subjects = subjectRepository.findByStudentId(userId);
        }
        return ResponseEntity.ok(subjects.stream().map(this::enrich).collect(Collectors.toList()));
    }

    // ── GET single subject ────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return subjectRepository.findById(id)
                .map(s -> ResponseEntity.ok((Object) enrich(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    // ── POST create subject (Admin) ───────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        Subject s = new Subject();
        s.setName((String) body.get("name"));
        s.setCode((String) body.get("code"));
        s.setDepartment((String) body.get("department"));
        s.setSemester((String) body.get("semester"));

        // Assign faculty if provided
        String facultyId = (String) body.get("facultyId");
        if (facultyId != null && !facultyId.isBlank()) {
            s.setFacultyId(facultyId);
            userRepository.findById(facultyId)
                    .ifPresent(f -> s.setFacultyName(f.getName()));
        }

        // Enroll initial students if provided
        @SuppressWarnings("unchecked")
        List<String> studentIds = (List<String>) body.get("studentIds");
        if (studentIds != null) {
            s.setStudentIds(new ArrayList<>(studentIds));
        }

        return ResponseEntity.ok(enrich(subjectRepository.save(s)));
    }

    // ── PUT update subject details (Admin) ────────────────────────────────────
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<Subject> opt = subjectRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Subject s = opt.get();
        if (body.containsKey("name"))       s.setName((String) body.get("name"));
        if (body.containsKey("code"))       s.setCode((String) body.get("code"));
        if (body.containsKey("department")) s.setDepartment((String) body.get("department"));
        if (body.containsKey("semester"))   s.setSemester((String) body.get("semester"));

        if (body.containsKey("facultyId")) {
            String facultyId = (String) body.get("facultyId");
            s.setFacultyId(facultyId);
            if (facultyId != null && !facultyId.isBlank()) {
                userRepository.findById(facultyId)
                        .ifPresent(f -> s.setFacultyName(f.getName()));
            } else {
                s.setFacultyName(null);
            }
        }

        return ResponseEntity.ok(enrich(subjectRepository.save(s)));
    }

    // ── PUT enroll students (Admin sets the full list) ────────────────────────
    // Body: { "studentIds": ["id1", "id2", ...] }
    @PutMapping("/{id}/students")
    public ResponseEntity<?> setStudents(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Optional<Subject> opt = subjectRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Subject s = opt.get();
        @SuppressWarnings("unchecked")
        List<String> studentIds = (List<String>) body.get("studentIds");
        s.setStudentIds(studentIds != null ? new ArrayList<>(studentIds) : new ArrayList<>());

        return ResponseEntity.ok(enrich(subjectRepository.save(s)));
    }

    // ── DELETE subject (Admin) ────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!subjectRepository.existsById(id)) return ResponseEntity.notFound().build();
        subjectRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Subject deleted"));
    }

    // ── Enrich: attach enrolled student details for frontend display ──────────
    private Map<String, Object> enrich(Subject s) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id",          s.getId());
        m.put("name",        s.getName());
        m.put("code",        s.getCode());
        m.put("department",  s.getDepartment());
        m.put("semester",    s.getSemester());
        m.put("facultyId",   s.getFacultyId());
        m.put("facultyName", s.getFacultyName());
        m.put("createdAt",   s.getCreatedAt());

        // Return enrolled student count + basic info
        List<String> ids = s.getStudentIds() != null ? s.getStudentIds() : List.of();
        m.put("studentIds",   ids);
        m.put("studentCount", ids.size());

        // Fetch enrolled student names for the detail view
        if (!ids.isEmpty()) {
            List<Map<String, Object>> students = ids.stream()
                .map(sid -> userRepository.findById(sid).orElse(null))
                .filter(Objects::nonNull)
                .map(u -> {
                    Map<String, Object> student = new LinkedHashMap<>();
                    student.put("id",                 u.getId());
                    student.put("name",               u.getName());
                    student.put("username",           u.getUsername());
                    student.put("registrationNumber", u.getRegistrationNumber());
                    student.put("email",              u.getEmail());
                    return student;
                })
                .collect(Collectors.toList());
            m.put("students", students);
        } else {
            m.put("students", List.of());
        }

        return m;
    }
}
