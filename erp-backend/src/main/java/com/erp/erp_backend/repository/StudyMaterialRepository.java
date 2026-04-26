package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.StudyMaterial;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface StudyMaterialRepository extends MongoRepository<StudyMaterial, String> {
    List<StudyMaterial> findByFacultyId(String facultyId);
    List<StudyMaterial> findBySubject(String subject);
    List<StudyMaterial> findByDepartment(String department);
    List<StudyMaterial> findByDepartmentAndTargetClass(String department, String targetClass);
    List<StudyMaterial> findAllByOrderByCreatedAtDesc();
}
