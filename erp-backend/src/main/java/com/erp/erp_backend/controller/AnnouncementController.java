package com.erp.erp_backend.controller;

import com.erp.erp_backend.model.Announcement;
import com.erp.erp_backend.repository.AnnouncementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    // GET all announcements (newest first)
    @GetMapping
    public ResponseEntity<List<Announcement>> getAll() {
        return ResponseEntity.ok(announcementRepository.findAllByOrderByCreatedAtDesc());
    }

    // GET single announcement
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return announcementRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create announcement
    @PostMapping
    public ResponseEntity<Announcement> create(@RequestBody Announcement announcement) {
        if (announcement.getTargetRole() == null) announcement.setTargetRole("ALL");
        if (announcement.getCategory() == null) announcement.setCategory("General");
        return ResponseEntity.ok(announcementRepository.save(announcement));
    }

    // DELETE announcement
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        if (!announcementRepository.existsById(id)) return ResponseEntity.notFound().build();
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Announcement deleted"));
    }
}
