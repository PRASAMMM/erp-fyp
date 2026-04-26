package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface SubjectRepository extends MongoRepository<Subject, String> {

    // All subjects taught by a faculty member
    List<Subject> findByFacultyId(String facultyId);

    // All subjects a student is enrolled in
    @Query("{ 'studentIds': ?0 }")
    List<Subject> findByStudentId(String studentId);

    // By department
    List<Subject> findByDepartment(String department);
}
