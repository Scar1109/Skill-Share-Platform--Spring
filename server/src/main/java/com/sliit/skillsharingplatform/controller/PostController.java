package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.Post;
import com.sliit.skillsharingplatform.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        Post createdPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
    }

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    // Get posts by userId
    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable String userId) {
        return postService.getPostsByUser(userId);
    }

    // Get a post by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Update post details
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        post.setId(id);
        Post updatedPost = postService.updatePost(post);
        return ResponseEntity.status(HttpStatus.OK).body(updatedPost);
    }

    // Delete a post by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    
    // Get posts by category
    @GetMapping("/category/{category}")
    public List<Post> getPostsByCategory(@PathVariable String category) {
        return postService.getPostsByCategory(category);
    }
    
    // Search posts by title
    @GetMapping("/search")
    public List<Post> searchPosts(@RequestParam String title) {
        return postService.searchPostsByTitle(title);
    }
    
    // Like a post
    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Post likedPost = postService.likePost(id, userId);
        if (likedPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(likedPost);
    }
    
    // Unlike a post
    @PostMapping("/{id}/unlike")
    public ResponseEntity<Post> unlikePost(@PathVariable String id, @RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        
        Post unlikedPost = postService.unlikePost(id, userId);
        if (unlikedPost == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(unlikedPost);
    }
    
    // Check if a user has liked a post
    @GetMapping("/{id}/liked")
    public ResponseEntity<Map<String, Boolean>> hasUserLikedPost(@PathVariable String id, @RequestParam String userId) {
        boolean hasLiked = postService.hasUserLikedPost(id, userId);
        return ResponseEntity.ok(Map.of("liked", hasLiked));
    }
}
