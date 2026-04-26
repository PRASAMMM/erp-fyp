package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.Announcement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AnnouncementRepository extends MongoRepository<Announcement, String> {
    List<Announcement> findByTargetRole(String targetRole);
    List<Announcement> findAllByOrderByCreatedAtDesc();
}
