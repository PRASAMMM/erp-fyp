package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "assignments")
public class Assignment {
    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String title;
    private String subject;       // kept for display
    private String subjectId;     // NEW — references subjects collection
    private String description;
    private String dueDate;
    private String status; // PENDING, SUBMITTED, GRADED, LATE
    private String submittedAt;
    private LocalDateTime createdAt = LocalDateTime.now();
}
