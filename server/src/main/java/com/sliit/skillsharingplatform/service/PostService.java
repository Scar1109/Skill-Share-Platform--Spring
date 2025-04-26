package com.sliit.skillsharingplatform.service;

import com.sliit.skillsharingplatform.model.Post;
import com.sliit.skillsharingplatform.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getPostsByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post updatePost(Post post) {
        return postRepository.save(post);
    }

    public void deletePost(String postId) {
        postRepository.deleteById(postId);
    }
}
