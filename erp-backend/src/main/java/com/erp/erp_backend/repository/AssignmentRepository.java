package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.Assignment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AssignmentRepository extends MongoRepository<Assignment, String> {
    List<Assignment> findByStudentId(String studentId);
    List<Assignment> findByStatus(String status);
    List<Assignment> findBySubject(String subject);
    List<Assignment> findBySubjectId(String subjectId);
    List<Assignment> findByStudentIdAndSubjectId(String studentId, String subjectId);
}
