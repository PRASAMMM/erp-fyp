package com.erp.erp_backend.config;

import com.erp.erp_backend.model.User;
import com.erp.erp_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) {
        new Thread(() -> {
            try {
                seedUser("Administrator", "admin", "admin123", "admin@eduerp.com", "ADMIN", null, null, null, null);
                // seedUser("Dr. Anita Sharma", "faculty1", "faculty123", "anita@eduerp.com", "FACULTY", "Computer Science", null, "Professor", null);
                // seedUser("Prof. Rajan Mehta", "faculty2", "faculty123", "rajan@eduerp.com", "FACULTY", "Mathematics", null, "Associate Professor", null);
                // seedUser("Rahul Verma", "student1", "student123", "rahul@student.com", "STUDENT", "Computer Science", "TY", null, "2024CS001");
                // seedUser("Priya Patel", "student2", "student123", "priya@student.com", "STUDENT", "Computer Science", "SY", null, "2024CS002");
                // seedUser("Arjun Singh", "student3", "student123", "arjun@student.com", "STUDENT", "Mathematics", "FY", null, "2024MA001");
                // seedUser("Sneha Kulkarni", "student4", "student123", "sneha@student.com", "STUDENT", "Physics", "TY", null, "2024PH001");

                System.out.println("✅ EduERP seed data loaded successfully");
                System.out.println("   Admin:   admin / admin123");
                // System.out.println("   Faculty: faculty1 / faculty123");
                // System.out.println("   Student: student1 / student123");
            } catch (Exception e) {
                System.err.println("⚠️ Warning: Data seeding failed (MongoDB may be unreachable): " + e.getMessage());
            }
        }).start();
    }

    private void seedUser(String name, String username, String password, String email,
                          String role, String department, String className,
                          String designation, String regNo) {
        if (userRepository.existsByUsername(username)) return;

        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        user.setRole(role);
        user.setDepartment(department);
        user.setClassName(className);
        user.setDesignation(designation);
        user.setRegistrationNumber(regNo);
        userRepository.save(user);
    }
}
