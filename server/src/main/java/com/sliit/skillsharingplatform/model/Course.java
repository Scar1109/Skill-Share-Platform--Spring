package com.sliit.skillsharingplatform.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "courses")
public class Course {
    @Id
    private String id; // Course ID
    private String courseTitle; // Course Title
    private String courseDescription; // Course Description
    private String trainerUserId; // Trainer's User ID (linked to User entity)
    private List<String> courses; // List of course IDs (if it's a sub-course or module)
    private String courseDetail; // Additional course detail
    private Integer durationMinutes; // Duration in minutes (using Integer as requested)
    private String level; // Course level (e.g., Beginner, Intermediate, Expert)
    private Double targetCalery; // Target calery (change from targetSalary)
    private String thumbnail; // URL for the course thumbnail image
    private String category; // Course category (e.g., Programming, Design, etc.)
    private List<String> likedBy = new ArrayList<>();
    private List<String> savedBy = new ArrayList<>();

    // Constructors, Getters, and Setters

    public Course() {
    }

    public Course(String courseTitle, String courseDescription, String trainerUserId,
            List<String> courses, String courseDetail, Integer durationMinutes,
            String level, Double targetCalery, String thumbnail, String category) {
        this.courseTitle = courseTitle;
        this.courseDescription = courseDescription;
        this.trainerUserId = trainerUserId;
        this.courses = courses;
        this.courseDetail = courseDetail;
        this.durationMinutes = durationMinutes;
        this.level = level;
        this.targetCalery = targetCalery;
        this.thumbnail = thumbnail;
        this.category = category;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public String getTrainerUserId() {
        return trainerUserId;
    }

    public void setTrainerUserId(String trainerUserId) {
        this.trainerUserId = trainerUserId;
    }

    public List<String> getCourses() {
        return courses;
    }

    public void setCourses(List<String> courses) {
        this.courses = courses;
    }

    public String getCourseDetail() {
        return courseDetail;
    }

    public void setCourseDetail(String courseDetail) {
        this.courseDetail = courseDetail;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Double getTargetCalery() {
        return targetCalery;
    }

    public void setTargetCalery(Double targetCalery) {
        this.targetCalery = targetCalery;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    // Add these getters and setters
    public List<String> getLikedBy() {
        return likedBy == null ? new ArrayList<>() : likedBy;
    }

    public void setLikedBy(List<String> likedBy) {
        this.likedBy = likedBy;
    }

    public List<String> getSavedBy() {
        return savedBy == null ? new ArrayList<>() : savedBy;
    }

    public void setSavedBy(List<String> savedBy) {
        this.savedBy = savedBy;
    }
}
