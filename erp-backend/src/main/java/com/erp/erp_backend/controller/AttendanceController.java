package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.Attendance;
import com.erp.erp_backend.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    // GET all attendance records
    @GetMapping
    public ResponseEntity<List<Attendance>> getAllAttendance() {
        return ResponseEntity.ok(attendanceRepository.findAll());
    }

    // GET attendance by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceRepository.findByStudentId(studentId));
    }

    // GET attendance by subject
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<Attendance>> getBySubject(@PathVariable String subjectId) {
        return ResponseEntity.ok(attendanceRepository.findBySubjectId(subjectId));
    }

    // GET attendance by student AND subject
    @GetMapping("/student/{studentId}/subject/{subjectId}")
    public ResponseEntity<List<Attendance>> getByStudentAndSubject(
            @PathVariable String studentId,
            @PathVariable String subjectId) {
        return ResponseEntity.ok(attendanceRepository.findByStudentIdAndSubjectId(studentId, subjectId));
    }

    // GET single attendance record
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return attendanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create attendance record
    @PostMapping
    public ResponseEntity<Attendance> createAttendance(@RequestBody Attendance attendance) {
        if (attendance.getClassesAttended() != null && attendance.getTotalClasses() != null
                && attendance.getTotalClasses() > 0) {
            double pct = ((double) attendance.getClassesAttended() / attendance.getTotalClasses()) * 100;
            attendance.setPercentage(Math.round(pct * 10.0) / 10.0);
        }
        return ResponseEntity.ok(attendanceRepository.save(attendance));
    }

    // PUT update attendance
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAttendance(@PathVariable String id, @RequestBody Map<String, Object> updates) {
        Optional<Attendance> opt = attendanceRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();

        Attendance att = opt.get();
        if (updates.containsKey("classesAttended"))
            att.setClassesAttended(Integer.valueOf(updates.get("classesAttended").toString()));
        if (updates.containsKey("totalClasses"))
            att.setTotalClasses(Integer.valueOf(updates.get("totalClasses").toString()));
        if (updates.containsKey("subjectId"))
            att.setSubjectId((String) updates.get("subjectId"));

        if (att.getClassesAttended() != null && att.getTotalClasses() != null && att.getTotalClasses() > 0) {
            double pct = ((double) att.getClassesAttended() / att.getTotalClasses()) * 100;
            att.setPercentage(Math.round(pct * 10.0) / 10.0);
        }

        return ResponseEntity.ok(attendanceRepository.save(att));
    }

    // DELETE attendance record
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAttendance(@PathVariable String id) {
        if (!attendanceRepository.existsById(id)) return ResponseEntity.notFound().build();
        attendanceRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Attendance record deleted"));
    }
}
