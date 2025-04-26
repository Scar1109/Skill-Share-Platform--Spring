package com.sliit.skillsharingplatform.service;

import com.sliit.skillsharingplatform.model.Course;
import com.sliit.skillsharingplatform.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    @Autowired
    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Create a new course
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get a course by its ID
    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    // Get courses by trainer's user ID
    public List<Course> getCoursesByTrainerUserId(String trainerUserId) {
        return courseRepository.findByTrainerUserId(trainerUserId);
    }

    // Update course details
    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }

    // Delete a course by ID
    public void deleteCourse(String courseId) {
        courseRepository.deleteById(courseId);
    }
}
