package com.erp.erp_backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String username;

    private String password;
    private String email;
    private String phone;
    private String role; // ADMIN, FACULTY, STUDENT
    private String department;
    private String className;
    private String designation;

    @Indexed(unique = true, sparse = true)
    private String registrationNumber;
}
