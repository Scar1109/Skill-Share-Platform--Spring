package com.sliit.skillsharingplatform.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/videos")
public class VideoUploadController {

    // Define the directory where videos will be uploaded
    private static final String UPLOAD_DIR = "uploads/";

    // Maximum file size (10 MB for example)
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    // Valid video file extensions
    private static final String[] VALID_VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".flv"};

    // POST request to upload video
    @PostMapping("/upload")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) {
        // Ensure the upload directory exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // Validate file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("File size exceeds the maximum limit of 10 MB.");
        }

        // Validate file type
        if (!isValidVideoFile(file.getOriginalFilename())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid video file type. Supported formats: .mp4, .avi, .mov, .mkv, .flv.");
        }

        try {
            // Get file's original name
            String fileName = file.getOriginalFilename();
            // Define the path to store the uploaded video
            Path path = Paths.get(UPLOAD_DIR + fileName);

            // Save the video file
            Files.write(path, file.getBytes());

            // Return the video URL for download or access
            String videoUrl = "/uploads/" + fileName;  // This assumes your server serves the file from the `uploads` folder
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Video uploaded successfully. Access it here: " + videoUrl);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload video: " + e.getMessage());
        }
    }

    // Helper method to validate file type (based on extension)
    private boolean isValidVideoFile(String fileName) {
        for (String ext : VALID_VIDEO_EXTENSIONS) {
            if (fileName.toLowerCase().endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
}
