package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Course;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface CourseRepository extends MongoRepository<Course, String> {
    List<Course> findByTrainerUserId(String trainerUserId);  // Find courses by trainer's user ID
    Optional<Course> findById(String id);                    // Find a course by its ID
}
