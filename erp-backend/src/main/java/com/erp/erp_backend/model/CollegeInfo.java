package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "college_info")
public class CollegeInfo {

    @Id
    private String id;

    // Basic Identity
    private String collegeName;
    private String shortName;          // e.g. "MIT", "SPCE"
    private String established;        // e.g. "1962"
    private String affiliation;        // e.g. "Mumbai University"
    private String accreditation;      // e.g. "NAAC A+", "NBA"
    private String type;               // Government / Private / Autonomous
    private String location;           // Full address
    private String city;
    private String state;
    private String pincode;
    private String website;
    private String email;
    private String phone;

    // Academic Structure
    private String academicYear;       // e.g. "2025-2026"
    private String semester;           // e.g. "Semester 4"
    private java.util.List<String> departments;
    private java.util.List<String> courses;
    private java.util.List<String> facilities;

    // Timing & Rules
    private String collegeTimings;     // e.g. "8:00 AM - 5:00 PM"
    private String attendanceRequired; // e.g. "75%"
    private String examinationPattern; // e.g. "Internal 40 + External 60"
    private String gradingSystem;      // e.g. "10 point CGPA"

    // Key People
    private String principal;
    private String vicePrincipal;
    private String dean;
    private String examController;

    // Important Dates / Events
    private String upcomingEvents;     // free text block

    // Free-form additional info the admin can type anything
    private String additionalInfo;

    private LocalDateTime updatedAt = LocalDateTime.now();
}
