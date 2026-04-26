package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.Marks;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MarksRepository extends MongoRepository<Marks, String> {
    List<Marks> findByStudentId(String studentId);
    List<Marks> findBySubject(String subject);
    List<Marks> findBySubjectId(String subjectId);
    List<Marks> findByStudentIdAndSubjectId(String studentId, String subjectId);
}
