package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Find notifications by recipient user ID, ordered by newest first
    List<Notification> findByRecipientUserIdOrderByCreatedAtDesc(String recipientUserId);
}
