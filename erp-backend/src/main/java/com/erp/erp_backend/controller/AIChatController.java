package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.*;
import com.erp.erp_backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class AIChatController {

    @Autowired private UserRepository userRepository;
    @Autowired private MarksRepository marksRepository;
    @Autowired private AttendanceRepository attendanceRepository;
    @Autowired private AssignmentRepository assignmentRepository;
    @Autowired private AnnouncementRepository announcementRepository;
    @Autowired private StudyMaterialRepository materialRepository;
    @Autowired private ChatMessageRepository chatMessageRepository;

    @PostMapping("/message")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> body) {
        String userId   = body.get("userId");
        String userRole = body.get("userRole");
        String message  = body.get("message");
        String sessionId = body.get("sessionId");

        if (message == null || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Message cannot be empty"));
        }

        String response = generateResponse(message.toLowerCase().trim(), userId, userRole);

        // Save chat history
        try {
            ChatMessage chat = new ChatMessage();
            chat.setUserId(userId);
            chat.setUserRole(userRole);
            chat.setUserMessage(message);
            chat.setBotResponse(response);
            chat.setSessionId(sessionId != null ? sessionId : UUID.randomUUID().toString());
            chatMessageRepository.save(chat);
        } catch (Exception ignored) {}

        return ResponseEntity.ok(Map.of("response", response, "timestamp", new Date().toString()));
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String userId) {
        return ResponseEntity.ok(chatMessageRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    private String generateResponse(String msg, String userId, String userRole) {
        String role = (userRole != null) ? userRole.toUpperCase() : "STUDENT";

        // ── GREETINGS ──
        if (msg.matches(".*(hello|hi|hey|greet|good morning|good evening|good afternoon).*")) {
            return "👋 Hello! I'm your EduERP AI assistant. I can help you with marks, attendance, assignments, study materials, and campus information. What would you like to know?";
        }

        // ── MARKS QUERIES ──
        if (msg.contains("mark") || msg.contains("score") || msg.contains("grade") || msg.contains("result")) {
            if (userId != null && (role.equals("STUDENT"))) {
                try {
                    List<Marks> marks = marksRepository.findByStudentId(userId);
                    if (marks.isEmpty()) return "📊 No marks have been recorded yet. Your faculty will update them soon!";
                    double avg = marks.stream().mapToDouble(m -> m.getMarksObtained() != null ? m.getMarksObtained() : 0).average().orElse(0);
                    String best = marks.stream().max(Comparator.comparingDouble(m -> m.getMarksObtained() != null ? m.getMarksObtained() : 0))
                            .map(m -> m.getSubject() + " (" + m.getMarksObtained() + "/" + (m.getTotalMarks() != null ? m.getTotalMarks() : 100) + ")")
                            .orElse("N/A");
                    int passed = (int) marks.stream().filter(m -> m.getMarksObtained() != null && m.getMarksObtained() >= 50).count();
                    return String.format("📊 **Your Academic Summary**\n• Total subjects recorded: %d\n• Average score: %.1f\n• Best subject: %s\n• Subjects passed: %d/%d\n\nVisit the Marks page for detailed breakdown!", marks.size(), avg, best, passed, marks.size());
                } catch (Exception e) {
                    return "📊 Visit your Marks section to see your detailed exam results.";
                }
            }
            if (role.equals("FACULTY") || role.equals("ADMIN")) {
                try {
                    List<Marks> allMarks = marksRepository.findAll();
                    double avg = allMarks.stream().mapToDouble(m -> m.getMarksObtained() != null ? m.getMarksObtained() : 0).average().orElse(0);
                    return String.format("📊 **Campus Marks Overview**\n• Total records: %d\n• Campus average: %.1f\n• Students scoring 75+: %d\n• Students below 50: %d",
                            allMarks.size(), avg,
                            (int) allMarks.stream().filter(m -> m.getMarksObtained() != null && m.getMarksObtained() >= 75).count(),
                            (int) allMarks.stream().filter(m -> m.getMarksObtained() != null && m.getMarksObtained() < 50).count());
                } catch (Exception e) {
                    return "📊 Visit the Marks Overview section for campus-wide results.";
                }
            }
        }

        // ── ATTENDANCE QUERIES ──
        if (msg.contains("attendance") || msg.contains("absent") || msg.contains("present") || msg.contains("bunk")) {
            if (userId != null && role.equals("STUDENT")) {
                try {
                    List<Attendance> att = attendanceRepository.findByStudentId(userId);
                    if (att.isEmpty()) return "📅 No attendance records found yet. Your faculty will update attendance soon!";
                    double avg = att.stream().mapToDouble(a -> a.getPercentage() != null ? a.getPercentage() : 0).average().orElse(0);
                    long low = att.stream().filter(a -> a.getPercentage() != null && a.getPercentage() < 75).count();
                    String warning = low > 0 ? "\n⚠️ **Warning:** " + low + " subject(s) below 75% — attend more classes!" : "\n✅ All subjects have good attendance!";
                    return String.format("📅 **Your Attendance Summary**\n• Subjects tracked: %d\n• Overall average: %.1f%%\n%s\n\nVisit the Attendance page for details.", att.size(), avg, warning);
                } catch (Exception e) {
                    return "📅 Check your Attendance page to see subject-wise details.";
                }
            }
            if (role.equals("FACULTY") || role.equals("ADMIN")) {
                try {
                    List<Attendance> all = attendanceRepository.findAll();
                    long critical = all.stream().filter(a -> a.getPercentage() != null && a.getPercentage() < 75).count();
                    return String.format("📅 **Campus Attendance**\n• Total records: %d\n• Students below 75%%: %d\n• Average attendance: %.1f%%",
                            all.size(), critical,
                            all.stream().mapToDouble(a -> a.getPercentage() != null ? a.getPercentage() : 0).average().orElse(0));
                } catch (Exception e) {
                    return "📅 Visit the Attendance section to see campus-wide records.";
                }
            }
        }

        // ── ASSIGNMENTS ──
        if (msg.contains("assignment") || msg.contains("homework") || msg.contains("submit") || msg.contains("due")) {
            if (userId != null && role.equals("STUDENT")) {
                try {
                    List<Assignment> asgns = assignmentRepository.findByStudentId(userId);
                    long submitted = asgns.stream().filter(a -> "SUBMITTED".equalsIgnoreCase(a.getStatus()) || "GRADED".equalsIgnoreCase(a.getStatus())).count();
                    long graded = asgns.stream().filter(a -> "GRADED".equalsIgnoreCase(a.getStatus())).count();
                    return String.format("📝 **Your Assignments**\n• Total submitted: %d\n• Graded: %d\n• Pending: %d\n\nGo to Assignments to upload new work.", submitted, graded, asgns.size() - submitted);
                } catch (Exception e) {
                    return "📝 Visit your Assignments page to upload and track submissions.";
                }
            }
        }

        // ── STUDY MATERIALS ──
        if (msg.contains("material") || msg.contains("note") || msg.contains("resource") || msg.contains("study") || msg.contains("pdf") || msg.contains("video")) {
            try {
                List<StudyMaterial> mats = materialRepository.findAllByOrderByCreatedAtDesc();
                if (mats.isEmpty()) return "📚 No study materials uploaded yet. Faculty will upload resources soon!";
                String recent = mats.stream().limit(3).map(m -> "• " + m.getTitle() + " (" + m.getSubject() + ")").collect(Collectors.joining("\n"));
                return "📚 **Recent Study Materials**\n" + recent + "\n\nVisit the Study Materials section to download all resources!";
            } catch (Exception e) {
                return "📚 Visit the Study Materials section to access all uploaded resources.";
            }
        }

        // ── ANNOUNCEMENTS ──
        if (msg.contains("announcement") || msg.contains("notice") || msg.contains("news") || msg.contains("update") || msg.contains("event")) {
            try {
                List<Announcement> anns = announcementRepository.findAllByOrderByCreatedAtDesc();
                if (anns.isEmpty()) return "📢 No announcements posted yet. Check back later!";
                String latest = anns.stream().limit(3).map(a -> "• **" + a.getTitle() + "**: " + (a.getContent() != null ? a.getContent().substring(0, Math.min(60, a.getContent().length())) + "..." : "")).collect(Collectors.joining("\n"));
                return "📢 **Latest Announcements**\n" + latest + "\n\nCheck your Dashboard for full announcements!";
            } catch (Exception e) {
                return "📢 Visit your Dashboard to see the latest campus announcements.";
            }
        }

        // ── STUDENT COUNT (ADMIN/FACULTY) ──
        if ((msg.contains("how many student") || msg.contains("total student") || msg.contains("number of student")) && !role.equals("STUDENT")) {
            try {
                long count = userRepository.findByRole("STUDENT").size();
                return "👥 There are currently **" + count + " students** enrolled in the system.";
            } catch (Exception e) {
                return "👥 Visit the Students section to see enrollment numbers.";
            }
        }

        // ── PERFORMANCE (STUDENT) ──
        if (msg.contains("performance") || msg.contains("cgpa") || msg.contains("gpa") || msg.contains("how am i doing")) {
            if (role.equals("STUDENT") && userId != null) {
                try {
                    List<Marks> marks = marksRepository.findByStudentId(userId);
                    List<Attendance> att = attendanceRepository.findByStudentId(userId);
                    double avgM = marks.stream().mapToDouble(m -> m.getMarksObtained() != null ? m.getMarksObtained() : 0).average().orElse(0);
                    double avgA = att.stream().mapToDouble(a -> a.getPercentage() != null ? a.getPercentage() : 0).average().orElse(0);
                    double cgpa = avgM >= 90 ? 10 : avgM >= 80 ? 9 : avgM >= 70 ? 8 : avgM >= 60 ? 7 : avgM >= 50 ? 6 : 5;
                    String rating = avgM >= 80 ? "🌟 Excellent" : avgM >= 65 ? "👍 Good" : avgM >= 50 ? "⚠️ Average" : "❗ Needs Improvement";
                    return String.format("🎯 **Your Performance Analysis**\n• Average Marks: %.1f/100\n• Estimated CGPA: %.1f\n• Avg Attendance: %.1f%%\n• Overall Rating: %s\n\nVisit Performance Analytics for full details!", avgM, cgpa, avgA, rating);
                } catch (Exception e) {
                    return "🎯 Visit your Performance Analytics page for a complete analysis!";
                }
            }
        }

        // ── HELP ──
        if (msg.contains("help") || msg.contains("what can you") || msg.contains("what do you")) {
            String base = "🤖 **I can help you with:**\n• 📊 Marks & grades\n• 📅 Attendance status\n• 📝 Assignment tracking\n• 📚 Study materials\n• 📢 Announcements\n• 🎯 Performance analysis\n";
            if (role.equals("FACULTY") || role.equals("ADMIN")) base += "• 👥 Student statistics\n• 📈 Campus overview\n";
            return base + "\nJust ask me anything about your academic data!";
        }

        // ── TIMETABLE / SCHEDULE ──
        if (msg.contains("timetable") || msg.contains("schedule") || msg.contains("class time") || msg.contains("when is")) {
            return "📋 Timetable management is coming soon! For now, please check with your department coordinator for the class schedule.";
        }

        // ── FEES ──
        if (msg.contains("fee") || msg.contains("payment") || msg.contains("tuition")) {
            return "💰 For fee-related queries, please contact the accounts office or your admin. Fee management is on our roadmap for the next update!";
        }

        // ── DEFAULT SMART FALLBACK ──
        return "🤖 I understand you're asking about **\"" + (msg.length() > 50 ? msg.substring(0, 50) + "..." : msg) + "\"**.\n\nI can currently help with:\n• Marks & grades\n• Attendance\n• Assignments\n• Study materials\n• Performance analytics\n\nTry asking something like *\"What are my marks?\"* or *\"Show my attendance\"*!";
    }
}
