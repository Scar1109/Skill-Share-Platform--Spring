package com.sliit.skillsharingplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "course_progress")
public class CourseProgress {

    @Id
    private String id;             
    private String userId;          
    private String courseId;       
    private List<Integer> completedVideos; 
    private double overallProgress;  

    // Constructors
    public CourseProgress() {
    }

    public CourseProgress(String userId, String courseId, List<Integer> completedVideos, double overallProgress) {
        this.userId = userId;
        this.courseId = courseId;
        this.completedVideos = completedVideos;
        this.overallProgress = overallProgress;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public List<Integer> getCompletedVideos() {
        return completedVideos;
    }

    public void setCompletedVideos(List<Integer> completedVideos) {
        this.completedVideos = completedVideos;
    }

    public double getOverallProgress() {
        return overallProgress;
    }

    public void setOverallProgress(double overallProgress) {
        this.overallProgress = overallProgress;
    }
}
