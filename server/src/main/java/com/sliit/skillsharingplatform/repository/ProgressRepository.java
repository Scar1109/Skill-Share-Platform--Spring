package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.CourseProgress;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProgressRepository extends MongoRepository<CourseProgress, String> {
    List<CourseProgress> findAll();  // Get all course progress records
    List<CourseProgress> findByCourseId(String courseId);  // Get course progress by course ID
}
