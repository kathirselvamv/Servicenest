package com.servicenest.config;

import com.servicenest.model.User;
import com.servicenest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Create sample users if they don't exist
        if (userRepository.findByEmail("user@servicenest.com") == null) {
            User user = new User();
            user.setEmail("user@servicenest.com");
            user.setPassword("password123");
            user.setRole("USER");
            userRepository.save(user);
            System.out.println("Sample USER created");
        }

        if (userRepository.findByEmail("worker@servicenest.com") == null) {
            User worker = new User();
            worker.setEmail("worker@servicenest.com");
            worker.setPassword("password123");
            worker.setRole("WORKER");
            userRepository.save(worker);
            System.out.println("Sample WORKER created");
        }
    }
}