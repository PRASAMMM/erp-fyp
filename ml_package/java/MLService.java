package com.erp.erp_backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * MLService — Spring Boot service that calls the Flask ML microservice.
 *
 * The Flask service runs on http://localhost:5000 (same machine).
 * Called by MLPredictionController at /api/ml/predict/**
 */
@Service
public class MLService {

    @Value("${ml.service.url:http://localhost:5000}")
    private String mlServiceUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ─── Internal DTO for request ────────────────────────────────────────

    public static class StudentMLRequest {
        public double avgAttendance;
        public double midtermScore;
        public double assignmentScore;
        public int    missedDeadlines;
        public double studyHoursDaily;
        public int    subjectCount;

        public StudentMLRequest() {}
        public StudentMLRequest(double att, double mid, double asgn,
                                int missed, double study, int subjects) {
            this.avgAttendance   = att;
            this.midtermScore    = mid;
            this.assignmentScore = asgn;
            this.missedDeadlines = missed;
            this.studyHoursDaily = study;
            this.subjectCount    = subjects;
        }
    }

    // ─── Core method: calls /predict/full ────────────────────────────────

    /**
     * Calls the Flask /predict/full endpoint and returns the combined result.
     * Returns a fallback map if the ML service is unreachable.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getFullPrediction(StudentMLRequest req) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("avg_attendance",    req.avgAttendance);
            payload.put("midterm_score",     req.midtermScore);
            payload.put("assignment_score",  req.assignmentScore);
            payload.put("missed_deadlines",  req.missedDeadlines);
            payload.put("study_hours_daily", req.studyHoursDaily);
            payload.put("subject_count",     req.subjectCount);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                mlServiceUrl + "/predict/full", entity, Map.class);

            return response.getBody() != null ? response.getBody() : fallbackResponse();

        } catch (Exception e) {
            // Graceful fallback — ML service might be starting up
            System.err.println("[MLService] Flask unreachable: " + e.getMessage());
            return fallbackResponse();
        }
    }

    // ─── Health check ─────────────────────────────────────────────────────

    public boolean isMLServiceHealthy() {
        try {
            ResponseEntity<Map> r = restTemplate.getForEntity(
                mlServiceUrl + "/health", Map.class);
            return r.getStatusCode() == HttpStatus.OK;
        } catch (Exception e) {
            return false;
        }
    }

    // ─── Fallback if Flask is down ─────────────────────────────────────────

    @SuppressWarnings("unchecked")
    private Map<String, Object> fallbackResponse() {
        Map<String, Object> fallback = new HashMap<>();

        Map<String, Object> risk = new HashMap<>();
        risk.put("is_at_risk",  false);
        risk.put("risk_level",  "UNKNOWN");
        risk.put("label",       "ML SERVICE UNAVAILABLE");
        risk.put("confidence",  0.0);
        fallback.put("risk", risk);

        Map<String, Object> perf = new HashMap<>();
        perf.put("predicted_score", 0.0);
        perf.put("grade",           "N/A");
        perf.put("pass",            false);
        perf.put("interpretation",  "ML service is currently unavailable.");
        fallback.put("performance", perf);

        Map<String, Object> anomaly = new HashMap<>();
        anomaly.put("is_anomaly",    false);
        anomaly.put("anomaly_score", 0.0);
        fallback.put("anomaly", anomaly);

        fallback.put("summary", "ML service unavailable — predictions could not be generated.");
        fallback.put("fallback", true);
        return fallback;
    }
}
