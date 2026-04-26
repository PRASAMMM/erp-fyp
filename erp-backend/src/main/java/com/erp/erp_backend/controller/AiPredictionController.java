package com.erp.erp_backend.controller;

import com.erp.erp_backend.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiPredictionController {

    @Autowired
    private AIService aiService;

    @PostMapping("/predict")
    public String predict(@RequestBody Map<String, Double> data) {
        // Build a natural language message from the numeric inputs
        String message = String.format(
            "Predict student performance: attendance=%.1f%%, assignment score=%.1f, midterm=%.1f, study hours=%.1f per day.",
            data.getOrDefault("attendance", 0.0),
            data.getOrDefault("assignment", 0.0),
            data.getOrDefault("midterm", 0.0),
            data.getOrDefault("study_hours", 0.0)
        );
        return aiService.chat(message, "system", "ADMIN");
    }
}