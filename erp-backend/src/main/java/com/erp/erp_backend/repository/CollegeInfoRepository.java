package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.CollegeInfo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CollegeInfoRepository extends MongoRepository<CollegeInfo, String> {
    // We only ever store ONE document — the latest one
    Optional<CollegeInfo> findTopByOrderByUpdatedAtDesc();
}
