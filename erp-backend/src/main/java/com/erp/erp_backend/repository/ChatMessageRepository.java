package com.erp.erp_backend.repository;

import com.erp.erp_backend.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByUserIdOrderByCreatedAtDesc(String userId);
    List<ChatMessage> findBySessionIdOrderByCreatedAt(String sessionId);
}
