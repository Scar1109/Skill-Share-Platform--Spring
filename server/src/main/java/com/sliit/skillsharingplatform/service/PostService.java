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
        return postRepository.findAll();
    }

    // Get posts by userId
    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    // Get a post by its ID
    public Optional<Post> getPostById(String id) {
        return postRepository.findById(id);
    }

    // Update post details
    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    // Delete a post by ID
    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
    
    // Get posts by category
    public List<Post> getPostsByCategory(String category) {
        return postRepository.findByCategory(category);
    }
    
    // Search posts by title
    public List<Post> searchPostsByTitle(String title) {
        return postRepository.findByTitleContainingIgnoreCase(title);
    }
    
    // Like a post
    public Post likePost(String postId, String userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            if (!post.getLikedBy().contains(userId)) {
                post.getLikedBy().add(userId);
                post.setLikeCount(post.getLikeCount() + 1);
                return postRepository.save(post);
            }
            return post;
        }
        return null;
    }
    
    // Unlike a post
    public Post unlikePost(String postId, String userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            if (post.getLikedBy().contains(userId)) {
                post.getLikedBy().remove(userId);
                post.setLikeCount(post.getLikeCount() - 1);
                return postRepository.save(post);
            }
            return post;
        }
        return null;
    }
    
    // Check if a user has liked a post
    public boolean hasUserLikedPost(String postId, String userId) {
        Optional<Post> optionalPost = postRepository.findById(postId);
        return optionalPost.map(post -> post.getLikedBy().contains(userId)).orElse(false);
    }
}
