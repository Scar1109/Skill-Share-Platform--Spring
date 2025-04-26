package com.sliit.skillsharingplatform.repository;

import com.sliit.skillsharingplatform.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
}
