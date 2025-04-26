package com.sliit.skillsharingplatform.service;

import com.sliit.skillsharingplatform.model.CourseProgress;
import com.sliit.skillsharingplatform.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    // Get all course progress records
    public List<CourseProgress> getAllCourseProgress() {
        return progressRepository.findAll();
    }

    // Create new course progress
    public CourseProgress createCourseProgress(CourseProgress courseProgress) {
        return progressRepository.save(courseProgress);
    }

    // Delete course progress by ID
    public void deleteCourseProgressById(String id) {
        progressRepository.deleteById(id);
    }

    // Update course progress
    public CourseProgress updateCourseProgress(String id, CourseProgress updatedProgress) {
        Optional<CourseProgress> existingProgress = progressRepository.findById(id);
        if (existingProgress.isPresent()) {
            CourseProgress courseProgress = existingProgress.get();
            courseProgress.setUserId(updatedProgress.getUserId());
            courseProgress.setCourseId(updatedProgress.getCourseId());
            courseProgress.setCompletedVideos(updatedProgress.getCompletedVideos());
            courseProgress.setOverallProgress(updatedProgress.getOverallProgress());
            return progressRepository.save(courseProgress);
        } else {
            return null; // Or throw an exception if not found
        }
    }

    // Get course progress by ID
    public Optional<CourseProgress> getCourseProgressById(String id) {
        return progressRepository.findById(id);
    }

    // Get course progress by user ID
    public List<CourseProgress> getCourseProgressByUserId(String userId) {
        return progressRepository.findByUserId(userId);
    }
}
