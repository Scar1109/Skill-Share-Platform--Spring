package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.Notification;
import com.sliit.skillsharingplatform.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // ✅ GET /api/notifications
    @GetMapping
    public ResponseEntity<List<Notification>> getUserNotifications(Principal principal) {
        String userId = principal.getName(); // assumes user's ID or email is in Principal
        List<Notification> notifications = notificationService.getNotificationsForUser(userId);
        return ResponseEntity.ok(notifications);
    }

    // ✅ POST /api/notifications/{id}/mark-as-read
    @PostMapping("/{id}/mark-as-read")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable String id, Principal principal) {
        String userId = principal.getName();
        boolean success = notificationService.markAsRead(id, userId);

        if (success) {
            return ResponseEntity.ok("Notification marked as read");
        } else {
            return ResponseEntity.badRequest().body("Notification not found or not authorized");
        }
    }

    // ✅ POST /api/notifications/mark-all-as-read
    @PostMapping("/mark-all-as-read")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        String userId = principal.getName();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok("All notifications marked as read");
    }
}
