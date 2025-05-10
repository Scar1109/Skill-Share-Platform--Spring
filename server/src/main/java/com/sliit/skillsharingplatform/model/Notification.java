package com.sliit.skillsharingplatform.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private String recipientUserId; // who receives the notification
    private String senderUserId;    // who triggered the action
    private String type;            // "like", "comment"
    private String courseId;        // the course affected
    private String message;         // message like "Alice liked your course"
    private boolean read = false;

    @CreatedDate
    private Date createdAt;         // ✅ auto-filled by Spring Data

    // Constructors
    public Notification() {
    }

    public Notification(String recipientUserId, String senderUserId, String type,
                        String courseId, String message, boolean read) {
        this.recipientUserId = recipientUserId;
        this.senderUserId = senderUserId;
        this.type = type;
        this.courseId = courseId;
        this.message = message;
        this.read = read;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRecipientUserId() {
        return recipientUserId;
    }

    public void setRecipientUserId(String recipientUserId) {
        this.recipientUserId = recipientUserId;
    }

    public String getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(String senderUserId) {
        this.senderUserId = senderUserId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
