package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.CollegeInfo;
import com.erp.erp_backend.repository.CollegeInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/college")
@CrossOrigin(origins = "*")
public class CollegeInfoController {

    @Autowired
    private CollegeInfoRepository collegeInfoRepository;

    /** GET /api/college — returns the saved college info */
    @GetMapping
    public ResponseEntity<?> get() {
        return collegeInfoRepository.findTopByOrderByUpdatedAtDesc()
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.ok(new CollegeInfo()));
    }

    /** POST /api/college — save/update college info (admin only) */
    @PostMapping
    public ResponseEntity<?> save(@RequestBody CollegeInfo info) {
        // Always overwrite the single existing record
        collegeInfoRepository.findTopByOrderByUpdatedAtDesc().ifPresent(existing -> {
            info.setId(existing.getId());
        });
        info.setUpdatedAt(LocalDateTime.now());
        CollegeInfo saved = collegeInfoRepository.save(info);
        return ResponseEntity.ok(saved);
    }
}
