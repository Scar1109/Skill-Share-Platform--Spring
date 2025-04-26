package com.sliit.skillsharingplatform.service;

import com.sliit.skillsharingplatform.model.Post;
import com.sliit.skillsharingplatform.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // Get all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();  // Retrieve all posts
    }

    // Get posts by userId
    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    // Get a post by its ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);  // Retrieve post by ID
    }

    // Update post details
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    // Delete a post by ID
    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
}
