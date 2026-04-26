package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "attendance")
public class Attendance {
    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String subject;       // kept for display
    private String subjectId;     // NEW — references subjects collection
    private Integer classesAttended;
    private Integer totalClasses;
    private Double percentage;
    private String date;
    private LocalDateTime createdAt = LocalDateTime.now();
}
