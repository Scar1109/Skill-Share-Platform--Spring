package com.sliit.skillsharingplatform.service;

import com.sliit.skillsharingplatform.model.CourseProgress;
import com.sliit.skillsharingplatform.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    // Get all course progress
    public List<CourseProgress> getAllProgress() {
        return progressRepository.findAll();
    }

    // Get course progress by ID
    public CourseProgress getProgressById(String id) {
        return progressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Progress not found"));
    }

    // Get course progress by course ID
    public List<CourseProgress> getProgressByCourseId(String courseId) {
        return progressRepository.findByCourseId(courseId);
    }

    // Create or update course progress
    public CourseProgress createOrUpdateProgress(CourseProgress courseProgress) {
        return progressRepository.save(courseProgress);
    }

    // Delete course progress by ID
    public boolean deleteProgress(String id) {
        if (progressRepository.existsById(id)) {
            progressRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
