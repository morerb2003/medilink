package com.medilink.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MediLinkApplication {

    public static void main(String[] args) {
        SpringApplication.run(MediLinkApplication.class, args);
        System.out.println("Application run ");
    }
}

