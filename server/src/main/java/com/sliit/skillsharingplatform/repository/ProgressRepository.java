package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.CourseProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends MongoRepository<CourseProgress, String> {
    List<CourseProgress> findAll(); // Get all course progress records
    Optional<CourseProgress> findById(String id); // Get course progress by ID
    List<CourseProgress> findByUserId(String userId); // Get course progress by user ID
}
