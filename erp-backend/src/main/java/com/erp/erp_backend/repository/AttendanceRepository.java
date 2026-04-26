package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findBySubject(String subject);
    List<Attendance> findBySubjectId(String subjectId);
    List<Attendance> findByStudentIdAndSubjectId(String studentId, String subjectId);
}
