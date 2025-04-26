package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.CourseProgress;
import com.sliit.skillsharingplatform.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    // Get all course progress
    @GetMapping
    public ResponseEntity<List<CourseProgress>> getAllProgress() {
        List<CourseProgress> progressList = progressService.getAllProgress();
        return new ResponseEntity<>(progressList, HttpStatus.OK);
    }

    // Get course progress by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseProgress> getProgressById(@PathVariable("id") String id) {
        CourseProgress progress = progressService.getProgressById(id);
        return progress != null ? new ResponseEntity<>(progress, HttpStatus.OK)
                                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Get course progress by course ID
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseProgress>> getProgressByCourseId(@PathVariable("courseId") String courseId) {
        List<CourseProgress> progressList = progressService.getProgressByCourseId(courseId);
        return new ResponseEntity<>(progressList, HttpStatus.OK);
    }

    // Create or update course progress
    @PostMapping
    public ResponseEntity<CourseProgress> createOrUpdateProgress(@RequestBody CourseProgress courseProgress) {
        CourseProgress createdProgress = progressService.createOrUpdateProgress(courseProgress);
        return new ResponseEntity<>(createdProgress, HttpStatus.CREATED);
    }

    // Delete course progress by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProgress(@PathVariable("id") String id) {
        boolean isDeleted = progressService.deleteProgress(id);
        return isDeleted ? new ResponseEntity<>("Progress record deleted successfully", HttpStatus.OK)
                         : new ResponseEntity<>("Progress record not found", HttpStatus.NOT_FOUND);
    }
}
