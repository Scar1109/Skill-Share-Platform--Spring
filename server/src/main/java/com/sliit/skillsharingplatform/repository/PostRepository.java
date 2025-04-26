package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);  // Get posts by userId
    Optional<Post> findById(String id);  // Get a post by its ID
}
