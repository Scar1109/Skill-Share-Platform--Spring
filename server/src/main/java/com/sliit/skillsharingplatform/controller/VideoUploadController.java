package com.sliit.skillsharingplatform.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/videos")
public class VideoUploadController {

    private static final String UPLOAD_DIR = "uploads/";
    private static final long   MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private static final String[] VALID_VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".flv"};

    @PostMapping("/upload")
    public ResponseEntity<UploadResponse> uploadVideo(@RequestParam("file") MultipartFile file) {
        // 1) ensure upload dir exists
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        // 2) size check
        if (file.getSize() > MAX_FILE_SIZE) {
            return ResponseEntity.badRequest()
                    .body(new UploadResponse("File too large"));
        }

        // 3) extension check
        String ext = getExtension(file.getOriginalFilename());
        if (!isValidExtension(ext)) {
            return ResponseEntity.badRequest()
                    .body(new UploadResponse("Invalid file type"));
        }

        try {
            // 4) generate next vid### name
            String newName = nextVidName(uploadDir, ext);
            Path target = Paths.get(UPLOAD_DIR + newName);

            // 5) save to disk
            Files.write(target, file.getBytes());

            // 6) return the URL path
            String videoUrl = "/uploads/" + newName;
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new UploadResponse(videoUrl));

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new UploadResponse("Server error: " + e.getMessage()));
        }
    }

    private boolean isValidExtension(String ext) {
        for (String v : VALID_VIDEO_EXTENSIONS) {
            if (v.equalsIgnoreCase(ext)) return true;
        }
        return false;
    }

    private String getExtension(String filename) {
        String clean = StringUtils.getFilename(filename);
        int idx = clean.lastIndexOf('.');
        return (idx >= 0 ? clean.substring(idx) : "");
    }

    private String nextVidName(File dir, String ext) {
        // list all files matching vid###.ext
        String[] existing = dir.list((d, name) -> name.startsWith("vid") && name.endsWith(ext));
        int max = 0;
        if (existing != null) {
            for (String n : existing) {
                try {
                    // parse the number between "vid" and ".ext"
                    int num = Integer.parseInt(n.substring(3, n.length() - ext.length()));
                    max = Math.max(max, num);
                } catch (NumberFormatException ignored) {}
            }
        }
        int next = max + 1;
        return String.format("vid%03d%s", next, ext);
    }

    // simple DTO for JSON response
    static class UploadResponse {
        private String videoUrl;
        public UploadResponse(String videoUrl) { this.videoUrl = videoUrl; }
        public String getVideoUrl() { return videoUrl; }
    }
}
