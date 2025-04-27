package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    List<Comment> findByUserId(String userId); // Retrieve all comments by user ID
    List<Comment> findByCourseId(String courseId); // Retrieve all comments by course ID
}
