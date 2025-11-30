package com.servicenest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServiceNestApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServiceNestApplication.class, args);
        System.out.println("=== ServiceNest Application Started ===");
        System.out.println("Server running on: http://localhost:8081");
    }
}