package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.Post;
import com.sliit.skillsharingplatform.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);  // 201 Created
    }

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();  // 200 OK
    }

    // Get posts by userId - changed to use a query parameter
    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUser(@PathVariable String userId) {
        return postService.getPostsByUser(userId);  // 200 OK
    }

    // Get a post by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        Optional<Post> post = postService.getPostById(id);
        return post.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());  // 404 Not Found
    }

    // Update post details
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable String id, @RequestBody Post post) {
        post.setId(id);
        Post updatedPost = postService.updatePost(post);
        return ResponseEntity.status(HttpStatus.OK).body(updatedPost);  // 200 OK
    }

    // Delete a post by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.deletePost(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // 204 No Content
    }
}
