package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "subjects")
public class Subject {

    @Id
    private String id;

    private String name;           // e.g. "DSA", "OOPS", "Mathematics"
    private String code;           // e.g. "CS301" (optional)
    private String department;     // e.g. "Computer Science"
    private String semester;       // e.g. "3", "5"

    // The faculty member who teaches this subject
    private String facultyId;
    private String facultyName;    // denormalized for display speed

    // Students enrolled in this subject
    private List<String> studentIds = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
}
