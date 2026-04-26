package com.erp.erp_backend.controller;

import com.erp.erp_backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    /**
     * POST /api/ai/chat
     * Body: { message, username, role }
     * Returns: { response: "..." }
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> body) {
        try {
            String message  = (String) body.getOrDefault("message",  "");
            String username = (String) body.getOrDefault("username", "anonymous");
            String role     = (String) body.getOrDefault("role",     "STUDENT");

            if (message.isBlank()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error",    "Message cannot be empty",
                                 "response", "Please type a message."));
            }

            System.out.println("[AI-Groq] user=" + username + " role=" + role + " → " + message);

            String reply = aiService.chat(message, username, role.toUpperCase());

            System.out.println("[AI-Groq] reply length=" + reply.length());

            return ResponseEntity.ok(Map.of("response", reply));

        } catch (Exception e) {
            System.err.println("[AI-Groq] ERROR: " + e.getMessage());
            return ResponseEntity.internalServerError().body(Map.of(
                "error",    e.getMessage(),
                "response", "Something went wrong. Please try again."
            ));
        }
    }

    /**
     * GET /api/ai/reminders?username=student1
     */
    @GetMapping("/reminders")
    public ResponseEntity<?> reminders(
            @RequestParam(defaultValue = "anonymous") String username) {
        try {
            return ResponseEntity.ok(aiService.getReminders(username));
        } catch (Exception e) {
            return ResponseEntity.ok(List.of());
        }
    }

    /**
     * GET /api/ai/status
     */
    @GetMapping("/status")
    public ResponseEntity<?> status() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "engine", "Groq Cloud AI (free, fast)",
            "note",   "Zero GPU usage on your laptop"
        ));
    }
}
