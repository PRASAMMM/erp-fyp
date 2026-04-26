package com.erp.erp_backend.service;

import com.erp.erp_backend.model.Announcement;
import com.erp.erp_backend.model.Assignment;
import com.erp.erp_backend.model.Attendance;
import com.erp.erp_backend.model.CollegeInfo;
import com.erp.erp_backend.model.Marks;
import com.erp.erp_backend.model.StudyMaterial;
import com.erp.erp_backend.model.User;
import com.erp.erp_backend.repository.AnnouncementRepository;
import com.erp.erp_backend.repository.AssignmentRepository;
import com.erp.erp_backend.repository.AttendanceRepository;
import com.erp.erp_backend.repository.CollegeInfoRepository;
import com.erp.erp_backend.repository.MarksRepository;
import com.erp.erp_backend.repository.StudyMaterialRepository;
import com.erp.erp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AIService {

    // ── Groq config ───────────────────────────────────────────────────────────
    // Free API key from https://console.groq.com  (takes 30 seconds to get)
    // Set as env var GROQ_API_KEY on Railway for deployment
    @Value("${groq.api.key:NOT_SET}")
    private String groqApiKey;

    // Groq free models (pick one):
    //   llama-3.3-70b-versatile  ← smartest, still very fast, recommended
    //   llama3-8b-8192           ← lighter, good for simple queries
    //   mixtral-8x7b-32768       ← great for long context
    //   gemma2-9b-it             ← Google's model, fast
    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String groqModel;

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    @Autowired private UserRepository         userRepository;
    @Autowired private AssignmentRepository   assignmentRepository;
    @Autowired private AnnouncementRepository announcementRepository;
    @Autowired private MarksRepository        marksRepository;
    @Autowired private AttendanceRepository   attendanceRepository;

    @Autowired(required = false)
    private CollegeInfoRepository collegeInfoRepository;

    @Autowired(required = false)
    private StudyMaterialRepository materialRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // ─────────────────────────────────────────────────────────────────────────
    // MAIN ENTRY POINT
    // ─────────────────────────────────────────────────────────────────────────

    public String chat(String message, String username, String role) {
        if ("NOT_SET".equals(groqApiKey) || groqApiKey.isBlank()) {
            return "⚠️ Groq API key not configured.\n\n"
                 + "1. Go to https://console.groq.com → API Keys → Create key\n"
                 + "2. Add to application.properties:\n"
                 + "   groq.api.key=gsk_...\n"
                 + "3. Restart the backend";
        }

        String systemPrompt = buildSystemPrompt(username, role, message);
        return callGroq(systemPrompt, message);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // REMINDERS — deadline list for frontend badge/widget
    // ─────────────────────────────────────────────────────────────────────────

    public List<Map<String, Object>> getReminders(String username) {
        List<Assignment> all = assignmentRepository.findAll();
        LocalDate today = LocalDate.now();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<Map<String, Object>> out = new ArrayList<>();

        for (Assignment a : all) {
            if ("GRADED".equalsIgnoreCase(a.getStatus())) continue;
            if (a.getDueDate() == null || a.getDueDate().isBlank()) continue;
            try {
                LocalDate due  = LocalDate.parse(a.getDueDate(), fmt);
                long      days = java.time.temporal.ChronoUnit.DAYS.between(today, due);
                String urgency;
                String msg;
                if      (days < 0)  { urgency = "HIGH";   msg = "Overdue by " + Math.abs(days) + " day(s)!"; }
                else if (days == 0) { urgency = "HIGH";   msg = "Due TODAY — submit now!"; }
                else if (days <= 2) { urgency = "HIGH";   msg = "Only " + days + " day(s) left!"; }
                else if (days <= 7) { urgency = "MEDIUM"; msg = days + " days left. Plan ahead."; }
                else               { urgency = "LOW";    msg = days + " days remaining."; }

                Map<String, Object> r = new LinkedHashMap<>();
                r.put("title",    safe(a.getTitle()));
                r.put("subject",  safe(a.getSubject()));
                r.put("dueDate",  safe(a.getDueDate()));
                r.put("urgency",  urgency);
                r.put("message",  msg);
                r.put("daysLeft", days);
                out.add(r);
            } catch (Exception ignored) {}
        }

        out.sort((x, y) -> {
            int u = urgencyRank((String) x.get("urgency"))
                  - urgencyRank((String) y.get("urgency"));
            return u != 0 ? u : Long.compare((Long) x.get("daysLeft"), (Long) y.get("daysLeft"));
        });
        return out;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // SYSTEM PROMPT — college data + role scope injected here
    // Groq properly respects system prompts unlike local models
    // ─────────────────────────────────────────────────────────────────────────

    private String buildSystemPrompt(String username, String role, String userMessage) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are EduERP AI — the official AI assistant for this college ERP system.\n");
        prompt.append("You have access to LIVE, REAL data from the college database provided below.\n");
        prompt.append("Answer questions using this data. Be helpful, clear, and conversational.\n");
        prompt.append("Use bullet points for lists. Keep responses focused.\n\n");

        // Role-based scope
        if ("ADMIN".equals(role)) {
            prompt.append("USER ROLE: ADMINISTRATOR\n");
            prompt.append("You may share ALL data: all student records, marks, attendance, faculty info, campus stats.\n");
            prompt.append("Be comprehensive and analytical. Provide summaries and statistics when asked.\n\n");
        } else if ("FACULTY".equals(role)) {
            prompt.append("USER ROLE: FACULTY MEMBER\n");
            prompt.append("You may share all student records, marks, and attendance to help with teaching.\n");
            prompt.append("Help the faculty manage students, check performance, and plan academics.\n\n");
        } else {
            prompt.append("USER ROLE: STUDENT\n");
            prompt.append("Only discuss THIS student's own marks, attendance, and assignments.\n");
            prompt.append("Do NOT reveal other students' private data under any circumstances.\n");
            prompt.append("Be encouraging, supportive, and student-friendly.\n\n");
        }

        // College institutional info
        prompt.append(buildCollegeInfoBlock());

        // Live DB data
        prompt.append(buildLiveDataBlock(username, role, userMessage));

        return prompt.toString();
    }

    // ── College info from DB ──────────────────────────────────────────────────

    private String buildCollegeInfoBlock() {
        StringBuilder s = new StringBuilder();
        s.append("=== COLLEGE INFORMATION ===\n");

        if (collegeInfoRepository != null) {
            Optional<CollegeInfo> opt = collegeInfoRepository.findTopByOrderByUpdatedAtDesc();
            if (opt.isPresent()) {
                CollegeInfo c = opt.get();
                appendLine(s, "Name",             c.getCollegeName());
                appendLine(s, "Short Name",       c.getShortName());
                appendLine(s, "Established",      c.getEstablished());
                appendLine(s, "Affiliation",      c.getAffiliation());
                appendLine(s, "Accreditation",    c.getAccreditation());
                appendLine(s, "Type",             c.getType());
                appendLine(s, "Location",         c.getLocation());
                appendLine(s, "City",             c.getCity());
                appendLine(s, "Website",          c.getWebsite());
                appendLine(s, "Email",            c.getEmail());
                appendLine(s, "Phone",            c.getPhone());
                appendLine(s, "Academic Year",    c.getAcademicYear());
                appendLine(s, "Semester",         c.getSemester());
                appendLine(s, "Timings",          c.getCollegeTimings());
                appendLine(s, "Min Attendance",   c.getAttendanceRequired());
                appendLine(s, "Exam Pattern",     c.getExaminationPattern());
                appendLine(s, "Grading",          c.getGradingSystem());
                appendLine(s, "Principal",        c.getPrincipal());
                appendLine(s, "Vice Principal",   c.getVicePrincipal());
                appendLine(s, "Dean",             c.getDean());
                appendLine(s, "Exam Controller",  c.getExamController());
                if (c.getDepartments() != null && !c.getDepartments().isEmpty())
                    s.append("Departments: ").append(String.join(", ", c.getDepartments())).append("\n");
                if (c.getCourses() != null && !c.getCourses().isEmpty())
                    s.append("Courses: ").append(String.join(", ", c.getCourses())).append("\n");
                if (c.getFacilities() != null && !c.getFacilities().isEmpty())
                    s.append("Facilities: ").append(String.join(", ", c.getFacilities())).append("\n");
                appendLine(s, "Events",           c.getUpcomingEvents());
                appendLine(s, "Additional Info",  c.getAdditionalInfo());
            } else {
                s.append("(Admin has not filled in college info yet)\n");
            }
        }
        s.append("\n");
        return s.toString();
    }

    // ── Live DB data ──────────────────────────────────────────────────────────

    private String buildLiveDataBlock(String username, String role, String userMessage) {
        StringBuilder s = new StringBuilder();
        s.append("=== LIVE CAMPUS DATA (").append(LocalDate.now()).append(") ===\n");

        try {
            // Students and faculty
            List<User> students = new ArrayList<>();
            students.addAll(userRepository.findByRole("STUDENT"));
            students.addAll(userRepository.findByRole("student"));

            List<User> faculty = new ArrayList<>();
            faculty.addAll(userRepository.findByRole("FACULTY"));
            faculty.addAll(userRepository.findByRole("faculty"));

            s.append("Enrollment: ").append(students.size())
             .append(" students, ").append(faculty.size()).append(" faculty\n\n");

            // Faculty list
            s.append("Faculty:\n");
            for (User f : faculty) {
                s.append("  • ").append(safe(f.getName()))
                 .append(" | Dept: ").append(safe(f.getDepartment()));
                if (f.getDesignation() != null) s.append(" | ").append(f.getDesignation());
                s.append("\n");
            }

            // All students (for admin/faculty)
            if ("ADMIN".equals(role) || "FACULTY".equals(role)) {
                s.append("\nAll Students:\n");
                for (User st : students) {
                    s.append("  • ").append(safe(st.getName()))
                     .append(" | RegNo: ").append(safe(st.getRegistrationNumber()))
                     .append(" | Dept: ").append(safe(st.getDepartment()))
                     .append(" | Class: ").append(safe(st.getClassName()))
                     .append("\n");
                }

                // All marks
                s.append("\nAll Marks Records:\n");
                List<Marks> allMarks = marksRepository.findAll();
                int mc = 0;
                for (Marks m : allMarks) {
                    if (mc++ >= 30) { s.append("  ...and ").append(allMarks.size() - mc).append(" more\n"); break; }
                    s.append("  • ").append(safe(m.getStudentName()))
                     .append(" | ").append(safe(m.getSubject()))
                     .append(": ").append(m.getMarksObtained())
                     .append("/").append(m.getTotalMarks() != null ? m.getTotalMarks() : 100)
                     .append(" (").append(safe(m.getExamType())).append(")\n");
                }

                // All attendance
                s.append("\nAll Attendance:\n");
                List<Attendance> allAtt = attendanceRepository.findAll();
                int ac = 0;
                for (Attendance a : allAtt) {
                    if (ac++ >= 30) { s.append("  ...and ").append(allAtt.size() - ac).append(" more\n"); break; }
                    s.append("  • ").append(safe(a.getStudentName()))
                     .append(" | ").append(safe(a.getSubject()))
                     .append(": ").append(a.getPercentage()).append("%")
                     .append(a.getPercentage() != null && a.getPercentage() < 75 ? " ⚠️ LOW" : "")
                     .append("\n");
                }
            }

            // Announcements
            s.append("\nAnnouncements:\n");
            List<Announcement> anns = announcementRepository.findAllByOrderByCreatedAtDesc();
            int al = Math.min(5, anns.size());
            for (int i = 0; i < al; i++) {
                s.append("  • ").append(safe(anns.get(i).getTitle()))
                 .append(": ").append(safe(anns.get(i).getContent())).append("\n");
            }

            // Active assignments
            s.append("\nActive Assignments:\n");
            int asgCount = 0;
            for (Assignment a : assignmentRepository.findAll()) {
                if (asgCount >= 8) break;
                if ("GRADED".equalsIgnoreCase(a.getStatus())) continue;
                s.append("  • ").append(safe(a.getTitle()))
                 .append(" | ").append(safe(a.getSubject()))
                 .append(" | Due: ").append(safe(a.getDueDate())).append("\n");
                asgCount++;
            }

            // Study materials
            if (materialRepository != null) {
                List<StudyMaterial> mats = materialRepository.findAllByOrderByCreatedAtDesc();
                if (!mats.isEmpty()) {
                    s.append("\nStudy Materials:\n");
                    int ml = Math.min(6, mats.size());
                    for (int i = 0; i < ml; i++) {
                        s.append("  • ").append(safe(mats.get(i).getTitle()))
                         .append(" (").append(safe(mats.get(i).getSubject())).append(")\n");
                    }
                }
            }

            // Registration number lookup in user's message
            String regLookup = lookupRegNumber(userMessage);
            if (!regLookup.isEmpty()) {
                s.append("\n").append(regLookup);
            }

            // Current user personal data
            User currentUser = findUser(username);
            if (currentUser != null) {
                s.append("\n=== CURRENT USER ===\n");
                s.append("Name: ").append(safe(currentUser.getName())).append("\n");
                s.append("Role: ").append(safe(currentUser.getRole())).append("\n");
                s.append("Dept: ").append(safe(currentUser.getDepartment())).append("\n");
                s.append("Class: ").append(safe(currentUser.getClassName())).append("\n");
                s.append("RegNo: ").append(safe(currentUser.getRegistrationNumber())).append("\n");

                if ("STUDENT".equalsIgnoreCase(currentUser.getRole())) {
                    String uid = currentUser.getId();

                    List<Marks> marks = marksRepository.findByStudentId(uid);
                    if (!marks.isEmpty()) {
                        s.append("My Marks:\n");
                        for (Marks m : marks) {
                            s.append("  • ").append(safe(m.getSubject()))
                             .append(": ").append(m.getMarksObtained())
                             .append("/").append(m.getTotalMarks() != null ? m.getTotalMarks() : 100)
                             .append(" (").append(safe(m.getExamType())).append(")\n");
                        }
                    }

                    List<Attendance> att = attendanceRepository.findByStudentId(uid);
                    if (!att.isEmpty()) {
                        s.append("My Attendance:\n");
                        for (Attendance a : att) {
                            s.append("  • ").append(safe(a.getSubject()))
                             .append(": ").append(a.getPercentage()).append("%")
                             .append(a.getPercentage() != null && a.getPercentage() < 75 ? " ⚠️ LOW" : " ✓")
                             .append("\n");
                        }
                    }
                }
            }

        } catch (Exception e) {
            s.append("(Error loading data: ").append(e.getMessage()).append(")\n");
        }

        s.append("===================\n");
        return s.toString();
    }

    // ── Registration number auto-lookup ───────────────────────────────────────

    private String lookupRegNumber(String message) {
        if (message == null) return "";
        StringBuilder result = new StringBuilder();
        for (String word : message.split("\\s+")) {
            String cleaned = word.replaceAll("[^a-zA-Z0-9]", "");
            if (cleaned.length() >= 5 && cleaned.length() <= 15
                    && cleaned.matches(".*[0-9].*") && cleaned.matches(".*[a-zA-Z].*")) {
                try {
                    Optional<User> byReg = userRepository.findByRegistrationNumber(cleaned);
                    if (byReg.isPresent()) {
                        User st = byReg.get();
                        result.append("=== STUDENT LOOKUP: ").append(cleaned).append(" ===\n");
                        result.append("Name: ").append(safe(st.getName())).append("\n");
                        result.append("Dept: ").append(safe(st.getDepartment())).append("\n");
                        result.append("Class: ").append(safe(st.getClassName())).append("\n");
                        result.append("Email: ").append(safe(st.getEmail())).append("\n");

                        List<Marks> marks = marksRepository.findByStudentId(st.getId());
                        if (!marks.isEmpty()) {
                            result.append("Marks:\n");
                            for (Marks m : marks) {
                                result.append("  • ").append(safe(m.getSubject()))
                                      .append(": ").append(m.getMarksObtained())
                                      .append("/").append(m.getTotalMarks() != null ? m.getTotalMarks() : 100)
                                      .append("\n");
                            }
                        }

                        List<Attendance> att = attendanceRepository.findByStudentId(st.getId());
                        if (!att.isEmpty()) {
                            result.append("Attendance:\n");
                            for (Attendance a : att) {
                                result.append("  • ").append(safe(a.getSubject()))
                                      .append(": ").append(a.getPercentage()).append("%")
                                      .append(a.getPercentage() != null && a.getPercentage() < 75 ? " ⚠️ LOW" : "")
                                      .append("\n");
                            }
                        }
                        result.append("===================\n");
                    }
                } catch (Exception ignored) {}
            }
        }
        return result.toString();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // GROQ API CALL — OpenAI-compatible, fast, free, cloud-based
    // ─────────────────────────────────────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private String callGroq(String systemPrompt, String userMessage) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            // Messages array — Groq uses OpenAI chat format
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", systemPrompt));
            messages.add(Map.of("role", "user",   "content", userMessage));

            Map<String, Object> body = new LinkedHashMap<>();
            body.put("model",       groqModel);
            body.put("messages",    messages);
            body.put("max_tokens",  1024);
            body.put("temperature", 0.4);

            HttpEntity<Map<String, Object>> req = new HttpEntity<>(body, headers);
            ResponseEntity<Map> res = restTemplate.postForEntity(GROQ_API_URL, req, Map.class);

            if (res.getStatusCode().is2xxSuccessful() && res.getBody() != null) {
                Object choices = res.getBody().get("choices");
                if (choices instanceof List<?> list && !list.isEmpty()) {
                    Object first = list.get(0);
                    if (first instanceof Map<?, ?> choice) {
                        Object msgObj = choice.get("message");
                        if (msgObj instanceof Map<?, ?> msg) {
                            Object content = msg.get("content");
                            if (content != null) return content.toString().trim();
                        }
                    }
                }
            }
            return "Groq returned an empty response. Please try again.";

        } catch (org.springframework.web.client.HttpClientErrorException ex) {
            int code = ex.getStatusCode().value();
            if (code == 401) return "⚠️ Invalid Groq API key. Check application.properties → groq.api.key";
            if (code == 429) return "⚠️ Rate limit hit. Wait a moment and try again.";
            if (code == 400) return "⚠️ Bad request: " + ex.getResponseBodyAsString();
            return "Groq API error " + code + ": " + ex.getMessage();
        } catch (org.springframework.web.client.ResourceAccessException e) {
            return "⚠️ Cannot reach Groq API. Check your internet connection.";
        } catch (Exception e) {
            return "AI error: " + e.getMessage();
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────────────────────────────────

    private User findUser(String username) {
        if (username == null || username.trim().isEmpty()) return null;
        try {
            return userRepository.findByUsername(username.trim()).orElse(null);
        } catch (Exception ignored) { return null; }
    }

    private void appendLine(StringBuilder sb, String label, String value) {
        if (value != null && !value.isBlank())
            sb.append(label).append(": ").append(value).append("\n");
    }

    private String safe(String v) { return v != null ? v : "—"; }

    private int urgencyRank(String u) {
        if ("HIGH".equals(u))   return 0;
        if ("MEDIUM".equals(u)) return 1;
        return 2;
    }
}
