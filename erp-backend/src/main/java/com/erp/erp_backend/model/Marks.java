package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "marks")
public class Marks {
    @Id
    private String id;
    private String studentId;
    private String studentName;
    private String subject;      // kept for display (subject name string)
    private String subjectId;    // NEW — references subjects collection
    private String examType;
    private Double marksObtained;
    private Double totalMarks;
    private String remarks;
    private LocalDateTime createdAt = LocalDateTime.now();
}
