package com.sliit.skillsharingplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comment {
    @Id
    private String id; // Comment ID
    private String courseId; // The ID of the course to which the comment is related
    private String userId; // The ID of the user who made the comment
    private String comment; // The content of the comment

    // Constructors, Getters, and Setters
    public Comment() {
    }

    public Comment(String courseId, String userId, String comment) {
        this.courseId = courseId;
        this.userId = userId;
        this.comment = comment;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
