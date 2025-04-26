package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.CourseProgress;
import com.sliit.skillsharingplatform.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    // Get all course progress records
    @GetMapping
    public ResponseEntity<List<CourseProgress>> getAllCourseProgress() {
        List<CourseProgress> progressList = progressService.getAllCourseProgress();
        return new ResponseEntity<>(progressList, HttpStatus.OK);
    }

    // Get course progress by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseProgress> getCourseProgressById(@PathVariable String id) {
        Optional<CourseProgress> courseProgress = progressService.getCourseProgressById(id);
        return courseProgress.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get course progress by user ID
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CourseProgress>> getCourseProgressByUserId(@PathVariable String userId) {
        List<CourseProgress> courseProgress = progressService.getCourseProgressByUserId(userId);
        return new ResponseEntity<>(courseProgress, HttpStatus.OK);
    }

    // Create new course progress
    @PostMapping
    public ResponseEntity<CourseProgress> createCourseProgress(@RequestBody CourseProgress courseProgress) {
        CourseProgress createdProgress = progressService.createCourseProgress(courseProgress);
        return new ResponseEntity<>(createdProgress, HttpStatus.CREATED);
    }

    // Update course progress
    @PutMapping("/{id}")
    public ResponseEntity<CourseProgress> updateCourseProgress(@PathVariable String id, @RequestBody CourseProgress courseProgress) {
        CourseProgress updatedProgress = progressService.updateCourseProgress(id, courseProgress);
        return updatedProgress != null ? new ResponseEntity<>(updatedProgress, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Delete course progress by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourseProgressById(@PathVariable String id) {
        progressService.deleteCourseProgressById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
