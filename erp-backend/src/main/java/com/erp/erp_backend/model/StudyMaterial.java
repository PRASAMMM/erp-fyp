package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "study_materials")
public class StudyMaterial {

    @Id
    private String id;

    private String title;
    private String description;
    private String subject;
    private String department;
    private String targetClass;      // FY, SY, TY, LY or ALL
    private String uploadedBy;       // Faculty name
    private String facultyId;
    private String fileType;         // PDF, VIDEO, LINK, DOC, PPT
    private String fileUrl;          // external link or base64/filename
    private String fileName;
    private Long fileSizeBytes;
    private List<String> tags;
    private LocalDateTime createdAt = LocalDateTime.now();
}
