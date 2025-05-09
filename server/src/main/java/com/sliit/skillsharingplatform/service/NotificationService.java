package com.sliit.skillsharingplatform.service;

import com.sliit.skillsharingplatform.model.Notification;
import com.sliit.skillsharingplatform.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    // ✅ Create and save a new notification
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    // ✅ Get all notifications for a specific user
    public List<Notification> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
    }

    // ✅ Mark a single notification as read (String ID now)
    public boolean markAsRead(String notificationId, String userId) {
        Optional<Notification> optionalNotification = notificationRepository.findById(notificationId);

        if (optionalNotification.isPresent()) {
            Notification notification = optionalNotification.get();
            if (notification.getRecipientUserId().equals(userId)) {
                notification.setRead(true);
                notificationRepository.save(notification);
                return true; // successfully marked as read
            }
        }
        return false; // not found or not authorized
    }

    // ✅ Mark all notifications as read for a specific user
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByRecipientUserIdOrderByCreatedAtDesc(userId);
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }
}
