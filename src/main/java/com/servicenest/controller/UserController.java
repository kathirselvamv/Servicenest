package com.servicenest.controller;

import com.servicenest.model.User;
import com.servicenest.model.WorkerProfile;
import com.servicenest.repository.UserRepository;
import com.servicenest.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    /**
     * ✅ TEST API - Check if controller is working
     */
    @GetMapping("/test")
    public String test() {
        System.out.println("=== TEST API CALLED ===");
        return "Backend is working! " + LocalDateTime.now();
    }

    /**
     * ✅ HEALTH CHECK - Check application status
     */
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "ServiceNest Backend is running");
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }

    /**
     * ✅ COMBINED REGISTRATION - Handles both USER and WORKER registration in one call
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerCombined(@RequestBody Map<String, Object> request) {
        System.out.println("=== COMBINED REGISTRATION ===");
        System.out.println("Email: " + request.get("email"));
        System.out.println("Role: " + request.get("role"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract and validate basic user data
            String email = request.get("email") != null ? 
                ((String) request.get("email")).toLowerCase().trim() : null;
            String password = (String) request.get("password");
            String role = request.get("role") != null ? 
                ((String) request.get("role")).toUpperCase().trim() : null;
            
            // Validate required fields
            if (email == null || email.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (password == null || password.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Password is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            if (role == null || role.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Role is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if email already exists
            if (userRepo.existsByEmail(email)) {
                response.put("status", "ERROR");
                response.put("message", "Email already registered");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create and save user
            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            
            User savedUser = userRepo.save(user);
            System.out.println("User created with ID: " + savedUser.getId());
            
            // If role is WORKER, create worker profile
            if ("WORKER".equals(role)) {
                // Extract worker-specific data with null checks
                String professionalTitle = (String) request.get("professionalTitle");
                String phoneNumber = (String) request.get("phoneNumber");
                String experience = (String) request.get("experience");
                String serviceAreas = (String) request.get("serviceAreas");
                String skills = (String) request.get("skills");
                String bio = (String) request.get("bio");
                
                Double hourlyRate = 0.0;
                if (request.get("hourlyRate") != null) {
                    try {
                        hourlyRate = Double.parseDouble(request.get("hourlyRate").toString());
                    } catch (NumberFormatException e) {
                        hourlyRate = 0.0;
                    }
                }
                
                // Validate worker-specific required fields
                if (professionalTitle == null || professionalTitle.trim().isEmpty()) {
                    response.put("status", "ERROR");
                    response.put("message", "Professional title is required for service providers");
                    return ResponseEntity.badRequest().body(response);
                }
                if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
                    response.put("status", "ERROR");
                    response.put("message", "Phone number is required for service providers");
                    return ResponseEntity.badRequest().body(response);
                }
                
                // Create worker profile
                WorkerProfile profile = new WorkerProfile();
                profile.setEmail(email);
                profile.setProfessionalTitle(professionalTitle.trim());
                profile.setExperience(experience != null ? experience : "0-1");
                profile.setPhoneNumber(phoneNumber.trim());
                profile.setServiceAreas(serviceAreas != null ? serviceAreas.trim() : "");
                profile.setHourlyRate(hourlyRate);
                profile.setSkills(skills != null ? skills.trim() : "");
                profile.setBio(bio != null ? bio.trim() : "");
                
                WorkerProfile savedProfile = workerProfileRepository.save(profile);
                System.out.println("Worker profile created for: " + savedProfile.getEmail());
                
                response.put("workerProfile", Map.of(
                    "professionalTitle", savedProfile.getProfessionalTitle(),
                    "experience", savedProfile.getExperience(),
                    "phoneNumber", savedProfile.getPhoneNumber()
                ));
            }
            
            response.put("status", "SUCCESS");
            response.put("message", "Registration successful");
            response.put("user", Map.of(
                "email", savedUser.getEmail(),
                "role", savedUser.getRole(),
                "id", savedUser.getId()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error during combined registration: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ LOGIN API
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User request) {
        System.out.println("=== LOGIN ATTEMPT ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Role: " + request.getRole());
        
        Map<String, String> response = new HashMap<>();
        
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty() ||
            request.getPassword() == null || request.getPassword().trim().isEmpty() ||
            request.getRole() == null || request.getRole().trim().isEmpty()) {
            
            System.out.println("Validation failed: All fields are required");
            response.put("status", "ERROR");
            response.put("message", "All fields are required");
            return ResponseEntity.badRequest().body(response);
        }

        // Find user by email AND role
        String email = request.getEmail().toLowerCase();
        String role = request.getRole().toUpperCase();
        
        System.out.println("Searching for user with email: " + email + " and role: " + role);
        User user = userRepo.findByEmailAndRole(email, role);

        if (user == null) {
            System.out.println("User not found with email: " + email + " and role: " + role);
            response.put("status", "ERROR");
            response.put("message", "Invalid email or role");
            return ResponseEntity.badRequest().body(response);
        }

        // Check password
        if (!user.getPassword().equals(request.getPassword())) {
            System.out.println("Password mismatch");
            response.put("status", "ERROR");
            response.put("message", "Invalid password");
            return ResponseEntity.badRequest().body(response);
        }

        // Login success
        System.out.println("Login successful for: " + user.getEmail());
        response.put("status", "SUCCESS");
        response.put("message", "LOGIN_SUCCESS");
        response.put("role", user.getRole());
        response.put("email", user.getEmail());
        return ResponseEntity.ok(response);
    }
}