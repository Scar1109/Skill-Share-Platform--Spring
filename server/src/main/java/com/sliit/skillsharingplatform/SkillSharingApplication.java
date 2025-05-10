package com.sliit.skillsharingplatform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SkillSharingApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillSharingApplication.class, args);
    }
}
