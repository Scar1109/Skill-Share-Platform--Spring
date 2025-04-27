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

    // Update course progress by adding a completed video
    public CourseProgress updateProgress(String progressId, Integer videoIndex) {
        Optional<CourseProgress> existingProgressOpt = progressRepository.findById(progressId);

        if (existingProgressOpt.isPresent()) {
            CourseProgress existingProgress = existingProgressOpt.get();

            // Add the videoIndex to the completedVideos list if not already completed
            if (!existingProgress.getCompletedVideos().contains(videoIndex)) {
                existingProgress.getCompletedVideos().add(videoIndex);
            }

            // Recalculate overall progress
            double progress = (double) existingProgress.getCompletedVideos().size() / 5 * 100;  // Assuming 5 videos in total
            existingProgress.setOverallProgress(progress);

            // Save the updated progress back to the repository
            return progressRepository.save(existingProgress);
        } else {
            throw new RuntimeException("Progress not found");
        }
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
