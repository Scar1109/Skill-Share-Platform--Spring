package com.sliit.skillsharingplatform.controller;

import com.sliit.skillsharingplatform.model.Course;
import com.sliit.skillsharingplatform.service.CourseService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    @Autowired
    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Create a new course
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse); // 201 Created
    }

    // Get all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses(); // 200 OK
    }

    // Get a course by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable String id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()); // 404 Not Found
    }

    // Get courses by trainer's user ID
    @GetMapping("/trainer/{trainerUserId}")
    public List<Course> getCoursesByTrainer(@PathVariable String trainerUserId) {
        return courseService.getCoursesByTrainerUserId(trainerUserId); // 200 OK
    }

    // Update course details
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable String id, @RequestBody Course course) {
        course.setId(id);
        Course updatedCourse = courseService.updateCourse(course);
        return ResponseEntity.status(HttpStatus.OK).body(updatedCourse); // 200 OK
    }

    // Delete a course by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204 No Content
    }

    // Upload image to ImgBB
    @PostMapping("/upload-image")
    public ResponseEntity<String> uploadImage(@RequestParam("image") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
            }
            String[] allowedTypes = { "image/jpeg", "image/png", "image/gif", "image/bmp" };
            if (!List.of(allowedTypes).contains(file.getContentType())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Invalid file type. Allowed: JPEG, PNG, GIF, BMP");
            }
            if (file.getSize() > 32 * 1024 * 1024) { // 32MB limit
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("File size exceeds 32MB limit");
            }

            // ImgBB API key (ideally from environment variable)
            String apiKey = "cd2d6f7f4f7b82939aeaebe4530b8cd6";
            String url = "https://api.imgbb.com/1/upload?key=" + apiKey;

            // Create HTTP client
            try (CloseableHttpClient client = HttpClients.createDefault()) {
                HttpPost httpPost = new HttpPost(url);
                MultipartEntityBuilder builder = MultipartEntityBuilder.create();
                builder.addBinaryBody("image", file.getBytes(), ContentType.create(file.getContentType()),
                        file.getOriginalFilename());
                HttpEntity multipart = builder.build();
                httpPost.setEntity(multipart);

                // Execute request
                try (CloseableHttpResponse response = client.execute(httpPost)) {
                    int statusCode = response.getStatusLine().getStatusCode();
                    HttpEntity responseEntity = response.getEntity();
                    String responseBody = EntityUtils.toString(responseEntity);

                    if (statusCode == 200) {
                        JsonNode json = new ObjectMapper().readTree(responseBody);
                        if (json.get("success").asBoolean()) {
                            String imageUrl = json.get("data").get("url").asText();
                            return ResponseEntity.ok(imageUrl);
                        } else {
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                    .body("ImgBB upload failed: " + json.get("error").get("message").asText());
                        }
                    } else {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("ImgBB upload failed with status: " + statusCode);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Image upload failed: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/like/{userId}")
    public ResponseEntity<Course> toggleLike(@PathVariable String id, @PathVariable String userId) {
        Optional<Course> optionalCourse = courseService.getCourseById(id);

        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            List<String> likedBy = course.getLikedBy();

            // Toggle like status
            if (likedBy.contains(userId)) {
                likedBy.remove(userId);
            } else {
                likedBy.add(userId);
            }

            course.setLikedBy(likedBy);
            Course updatedCourse = courseService.updateCourse(course);
            return ResponseEntity.ok(updatedCourse);
        }

        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/save/{userId}")
    public ResponseEntity<Course> toggleSave(@PathVariable String id, @PathVariable String userId) {
        Optional<Course> optionalCourse = courseService.getCourseById(id);

        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            List<String> savedBy = course.getSavedBy();

            // Toggle save status
            if (savedBy.contains(userId)) {
                savedBy.remove(userId);
            } else {
                savedBy.add(userId);
            }

            course.setSavedBy(savedBy);
            Course updatedCourse = courseService.updateCourse(course);
            return ResponseEntity.ok(updatedCourse);
        }

        return ResponseEntity.notFound().build();
    }
}