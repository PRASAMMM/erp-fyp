package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.Attendance;
import com.erp.erp_backend.model.Marks;
import com.erp.erp_backend.model.User;
import com.erp.erp_backend.repository.AttendanceRepository;
import com.erp.erp_backend.repository.MarksRepository;
import com.erp.erp_backend.repository.UserRepository;
import com.erp.erp_backend.repository.SubjectRepository;
import com.erp.erp_backend.service.MLService;
import com.erp.erp_backend.service.MLService.StudentMLRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * MLPredictionController
 *
 * Endpoints:
 * POST /api/ml/predict — predict for any student (body: studentId + optional
 * overrides)
 * GET /api/ml/predict/{studentId} — auto-pull data from DB, predict
 * GET /api/ml/at-risk — list all at-risk students (admin/faculty)
 * GET /api/ml/health — check Flask ML service status
 */
@RestController
@RequestMapping("/api/ml")
@CrossOrigin(origins = "*")
public class MLPredictionController {

    @Autowired
    private MLService mlService;
    @Autowired
    private AttendanceRepository attendanceRepo;
    @Autowired
    private MarksRepository marksRepo;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubjectRepository subjectRepository;

    // ─── POST /api/ml/predict — manual payload ─────────────────────────────

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predict(
            @RequestBody Map<String, Object> body) {

        StudentMLRequest req = new StudentMLRequest(
                toDouble(body.get("avg_attendance"), 75.0),
                toDouble(body.get("midterm_score"), 60.0),
                toDouble(body.get("assignment_score"), 70.0),
                toInt(body.get("missed_deadlines"), 1),
                toDouble(body.get("study_hours_daily"), 3.0),
                toInt(body.get("subject_count"), 5));
        return ResponseEntity.ok(mlService.getFullPrediction(req));
    }

    // ─── GET /api/ml/predict/{studentId} — auto-pull from DB ───────────────

    @GetMapping("/predict/{studentId}")
    public ResponseEntity<Map<String, Object>> predictForStudent(
            @PathVariable String studentId) {

        // Pull attendance records for this student
        List<Attendance> attendances = attendanceRepo.findByStudentId(studentId);
        List<Marks> marksList = marksRepo.findByStudentId(studentId);

        double avgAttendance = attendances.stream()
                .mapToDouble(a -> {
                    if (a.getTotalClasses() == null || a.getTotalClasses() == 0)
                        return 0;
                    return (a.getClassesAttended() * 100.0) / a.getTotalClasses();
                })
                .average().orElse(75.0);

        // Calculate overall average as a smart fallback
        double overallAvg = marksList.stream()
                .mapToDouble(m -> m.getTotalMarks() != null && m.getTotalMarks() > 0
                        ? ((m.getMarksObtained() != null ? m.getMarksObtained() : 0.0) * 100.0) / m.getTotalMarks()
                        : 0)
                .average().orElse(60.0); // Absolute fallback if NO marks exist

        // Split marks by exam type
        double midtermAvg = marksList.stream()
                .filter(m -> {
                    String t = m.getExamType();
                    return t != null && (t.equalsIgnoreCase("Mid-Semester") || t.toLowerCase().startsWith("internal"));
                })
                .mapToDouble(m -> m.getTotalMarks() != null && m.getTotalMarks() > 0
                        ? ((m.getMarksObtained() != null ? m.getMarksObtained() : 0.0) * 100.0) / m.getTotalMarks()
                        : 0)
                .average().orElse(overallAvg);

        double assignmentAvg = marksList.stream()
                .filter(m -> {
                    String t = m.getExamType();
                    return t != null && (t.equalsIgnoreCase("Assignment") || t.equalsIgnoreCase("Practical") || t.equalsIgnoreCase("Quiz") || t.equalsIgnoreCase("End-Semester"));
                })
                .mapToDouble(m -> m.getTotalMarks() != null && m.getTotalMarks() > 0
                        ? ((m.getMarksObtained() != null ? m.getMarksObtained() : 0.0) * 100.0) / m.getTotalMarks()
                        : 0)
                .average().orElse(overallAvg);

        int subjectCount = (int) marksList.stream()
                .map(Marks::getSubject).filter(Objects::nonNull).distinct().count();
        if (subjectCount == 0)
            subjectCount = 5;

        StudentMLRequest req = new StudentMLRequest(
                Math.round(avgAttendance * 10.0) / 10.0,
                Math.round(midtermAvg * 10.0) / 10.0,
                Math.round(assignmentAvg * 10.0) / 10.0,
                0, // missed_deadlines — extend when Assignment model is done
                3.0, // study_hours_daily — extend when student logs this
                subjectCount);

        Map<String, Object> prediction = mlService.getFullPrediction(req);

        // Attach the raw features used so frontend can show them
        Map<String, Object> features = new LinkedHashMap<>();
        features.put("avg_attendance", req.avgAttendance);
        features.put("midterm_score", req.midtermScore);
        features.put("assignment_score", req.assignmentScore);
        features.put("missed_deadlines", req.missedDeadlines);
        features.put("study_hours_daily", req.studyHoursDaily);
        features.put("subject_count", req.subjectCount);
        prediction.put("input_features", features);
        prediction.put("student_id", studentId);

        return ResponseEntity.ok(prediction);
    }

    // ─── GET /api/ml/at-risk — batch predict all students ──────────────────

    @GetMapping("/at-risk")
    public ResponseEntity<Map<String, Object>> getAllAtRisk(
            @RequestParam(required = false) String facultyId) {
        
        List<User> targetStudents = new ArrayList<>();
        
        if (facultyId != null && !facultyId.isBlank()) {
            // Fetch students taught by this faculty
            List<com.erp.erp_backend.model.Subject> subjects = subjectRepository.findByFacultyId(facultyId);
            if (subjects != null && !subjects.isEmpty()) {
                Set<String> studentIds = subjects.stream()
                        .filter(s -> s.getStudentIds() != null)
                        .flatMap(s -> s.getStudentIds().stream())
                        .collect(Collectors.toSet());
                for (String sid : studentIds) {
                    userRepository.findById(sid).ifPresent(targetStudents::add);
                }
            }
        } else {
            // Fetch all students (Admin view)
            targetStudents.addAll(userRepository.findByRole("STUDENT"));
            targetStudents.addAll(userRepository.findByRole("student"));
        }
        
        // Remove duplicates just in case
        Map<String, User> uniqueStudents = new LinkedHashMap<>();
        for (User u : targetStudents) {
            uniqueStudents.put(u.getId(), u);
        }
        targetStudents = new ArrayList<>(uniqueStudents.values());

        List<Map<String, Object>> atRiskStudents = new ArrayList<>();
        List<Map<String, Object>> allPredictions = new ArrayList<>();

        for (User student : targetStudents) {
            String sid = student.getId();
            ResponseEntity<Map<String, Object>> resp = predictForStudent(sid);
            Map<String, Object> pred = resp.getBody();
            if (pred == null)
                continue;

            allPredictions.add(pred);

            @SuppressWarnings("unchecked")
            Map<String, Object> risk = (Map<String, Object>) pred.get("risk");
            if (risk != null && Boolean.TRUE.equals(risk.get("is_at_risk"))) {
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("student_id", sid);
                entry.put("name", student.getName());
                entry.put("registrationNumber", student.getRegistrationNumber() != null ? student.getRegistrationNumber() : student.getUsername());
                entry.put("risk_level", risk.get("risk_level"));
                entry.put("confidence", risk.get("confidence"));

                @SuppressWarnings("unchecked")
                Map<String, Object> perf = (Map<String, Object>) pred.get("performance");
                if (perf != null) {
                    entry.put("predicted_score", perf.get("predicted_score"));
                    entry.put("grade", perf.get("grade"));
                }
                @SuppressWarnings("unchecked")
                Map<String, Object> inp = (Map<String, Object>) pred.get("input_features");
                if (inp != null)
                    entry.put("avg_attendance", inp.get("avg_attendance"));

                atRiskStudents.add(entry);
            }
        }

        // Sort by risk confidence descending
        atRiskStudents.sort((a, b) -> {
            double ca = toDouble(a.get("confidence"), 0);
            double cb = toDouble(b.get("confidence"), 0);
            return Double.compare(cb, ca);
        });

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("total_students", targetStudents.size());
        result.put("at_risk_count", atRiskStudents.size());
        result.put("at_risk_percent", targetStudents.isEmpty() ? 0
                : Math.round(atRiskStudents.size() * 100.0 / targetStudents.size()));
        result.put("at_risk_students", atRiskStudents);
        return ResponseEntity.ok(result);
    }

    // ─── GET /api/ml/health ─────────────────────────────────────────────────

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        boolean up = mlService.isMLServiceHealthy();
        Map<String, Object> res = new HashMap<>();
        res.put("ml_service_status", up ? "UP" : "DOWN");
        res.put("ml_service_url", "http://localhost:5000");
        res.put("message", up
                ? "Flask ML service is running and ready."
                : "Flask ML service is unreachable. Start with: python app.py");
        return ResponseEntity.ok(res);
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private double toDouble(Object v, double def) {
        if (v == null)
            return def;
        try {
            return Double.parseDouble(v.toString());
        } catch (Exception e) {
            return def;
        }
    }

    private int toInt(Object v, int def) {
        if (v == null)
            return def;
        try {
            return (int) Double.parseDouble(v.toString());
        } catch (Exception e) {
            return def;
        }
    }
}
