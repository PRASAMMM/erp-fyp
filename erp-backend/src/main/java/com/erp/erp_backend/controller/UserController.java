package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.User;
import com.erp.erp_backend.model.Subject;
import com.erp.erp_backend.repository.UserRepository;
import com.erp.erp_backend.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(
            userRepository.findAll().stream().map(this::sanitize).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok((Object) sanitize(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getStudents() {
        List<User> students = new ArrayList<>();
        students.addAll(userRepository.findByRole("STUDENT"));
        students.addAll(userRepository.findByRole("student"));
        Map<String, User> unique = new LinkedHashMap<>();
        students.forEach(s -> unique.put(s.getId(), s));
        return ResponseEntity.ok(unique.values().stream().map(this::sanitize).collect(Collectors.toList()));
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<Map<String, Object>>> getFaculty() {
        List<User> faculty = new ArrayList<>();
        faculty.addAll(userRepository.findByRole("FACULTY"));
        faculty.addAll(userRepository.findByRole("faculty"));
        Map<String, User> unique = new LinkedHashMap<>();
        faculty.forEach(f -> unique.put(f.getId(), f));
        return ResponseEntity.ok(unique.values().stream().map(this::sanitize).collect(Collectors.toList()));
    }

    /**
     * GET /api/users/my-faculty?className=CSE-A&role=STUDENT
     *
     * - STUDENT callers: returns only faculty whose className matches the
     *   value passed in the ?className= param (i.e. the student's own class).
     * - ADMIN / FACULTY callers: role param is not STUDENT, so all faculty
     *   are returned (useful for admin views that call this same endpoint).
     * - If className is blank or missing for a STUDENT call, falls back to
     *   returning all faculty so the page is never completely empty.
     */
    @GetMapping("/my-faculty")
    public ResponseEntity<List<Map<String, Object>>> getMyFaculty(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String role) {

        // Collect all faculty (handles mixed-case roles in DB)
        List<User> allFaculty = new ArrayList<>();
        allFaculty.addAll(userRepository.findByRole("FACULTY"));
        allFaculty.addAll(userRepository.findByRole("faculty"));
        Map<String, User> unique = new LinkedHashMap<>();
        allFaculty.forEach(f -> unique.put(f.getId(), f));
        List<User> facultyList = new ArrayList<>(unique.values());

        // Only filter when the caller is a STUDENT and className is provided
        boolean isStudent = "STUDENT".equalsIgnoreCase(role);
        boolean hasClass  = className != null && !className.isBlank();

        if (isStudent && hasClass) {
            facultyList = facultyList.stream()
                    .filter(f -> className.equalsIgnoreCase(f.getClassName()))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(facultyList.stream().map(this::sanitize).collect(Collectors.toList()));
    }

    /**
     * GET /api/users/faculty/{facultyId}/students
     * 
     * Returns a unique list of students enrolled in all subjects taught by the given faculty.
     */
    @GetMapping("/faculty/{facultyId}/students")
    public ResponseEntity<List<Map<String, Object>>> getFacultyStudents(
            @PathVariable String facultyId,
            @RequestParam(required = false) String subjectId) {
        
        List<Subject> subjects;
        if (subjectId != null && !subjectId.isBlank()) {
            subjects = subjectRepository.findById(subjectId)
                .filter(s -> facultyId.equals(s.getFacultyId()))
                .map(Collections::singletonList)
                .orElse(Collections.emptyList());
        } else {
            subjects = subjectRepository.findByFacultyId(facultyId);
        }
        if (subjects == null || subjects.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        Set<String> uniqueStudentIds = subjects.stream()
                .filter(s -> s.getStudentIds() != null)
                .flatMap(s -> s.getStudentIds().stream())
                .collect(Collectors.toSet());

        List<Map<String, Object>> students = uniqueStudentIds.stream()
                .map(sid -> userRepository.findById(sid).orElse(null))
                .filter(Objects::nonNull)
                .map(this::sanitize)
                .collect(Collectors.toList());

        return ResponseEntity.ok(students);
    }

    @GetMapping("/student/reg/{regNo}")
    public ResponseEntity<?> getByRegNo(@PathVariable String regNo) {
        return userRepository.findByRegistrationNumber(regNo)
                .map(u -> ResponseEntity.ok((Object) sanitize(u)))
                .orElse(ResponseEntity.status(404).body(
                    Map.of("message", "No student found with registration number: " + regNo)
                ));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<User> opt = userRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
        if (updates.containsKey("name"))               u.setName((String) updates.get("name"));
        if (updates.containsKey("email"))              u.setEmail((String) updates.get("email"));
        if (updates.containsKey("phone"))              u.setPhone((String) updates.get("phone"));
        if (updates.containsKey("department"))         u.setDepartment((String) updates.get("department"));
        if (updates.containsKey("className"))          u.setClassName((String) updates.get("className"));
        if (updates.containsKey("designation"))        u.setDesignation((String) updates.get("designation"));
        if (updates.containsKey("registrationNumber")) u.setRegistrationNumber((String) updates.get("registrationNumber"));
        return ResponseEntity.ok(sanitize(userRepository.save(u)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    private Map<String, Object> sanitize(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("name", u.getName());
        m.put("username", u.getUsername());
        m.put("email", u.getEmail());
        m.put("phone", u.getPhone());
        m.put("role", u.getRole() != null ? u.getRole().toUpperCase() : "STUDENT");
        m.put("department", u.getDepartment());
        m.put("className", u.getClassName());
        m.put("designation", u.getDesignation());
        m.put("registrationNumber", u.getRegistrationNumber());
        return m;
    }
}
