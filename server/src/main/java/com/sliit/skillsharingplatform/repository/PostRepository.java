package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
    Optional<Post> findById(String id);
    List<Post> findByCategory(String category);
    List<Post> findByTitleContainingIgnoreCase(String title);
}
