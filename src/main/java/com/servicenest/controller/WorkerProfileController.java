package com.servicenest.controller;

import com.servicenest.dto.RegistrationRequest;
import com.servicenest.model.User;
import com.servicenest.model.WorkerProfile;
import com.servicenest.repository.UserRepository;
import com.servicenest.repository.WorkerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/worker")
@CrossOrigin("*")
public class WorkerProfileController {

    @Autowired
    private WorkerProfileRepository workerProfileRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ CREATE WORKER PROFILE (Separate from user registration)
     */
    @PostMapping("/create-profile")
    public ResponseEntity<?> createWorkerProfile(@RequestBody RegistrationRequest request) {
        System.out.println("=== CREATE WORKER PROFILE ===");
        System.out.println("Email: " + request.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if user exists first
            String email = request.getEmail().trim().toLowerCase();
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                response.put("status", "ERROR");
                response.put("message", "User not found. Please register as user first.");
                return ResponseEntity.badRequest().body(response);
            }

            // Check if worker profile already exists
            if (workerProfileRepository.findByEmail(email) != null) {
                response.put("status", "ERROR");
                response.put("message", "Worker profile already exists for this email");
                return ResponseEntity.badRequest().body(response);
            }

            // Validate worker-specific required fields
            if (request.getProfessionalTitle() == null || request.getProfessionalTitle().trim().isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Professional title is required");
                return ResponseEntity.badRequest().body(response);
            }
            if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Phone number is required");
                return ResponseEntity.badRequest().body(response);
            }

            // Create worker profile
            WorkerProfile profile = new WorkerProfile();
            profile.setEmail(email);
            
            // Set worker profile data
            profile.setProfessionalTitle(request.getProfessionalTitle().trim());
            profile.setExperience(request.getExperience() != null ? request.getExperience() : "0-1");
            profile.setBio(request.getBio() != null ? request.getBio().trim() : "");
            profile.setHourlyRate(request.getHourlyRate() != null ? request.getHourlyRate() : 0.0);
            profile.setServiceAreas(request.getServiceAreas() != null ? request.getServiceAreas().trim() : "");
            profile.setPhoneNumber(request.getPhoneNumber().trim());
            profile.setSkills(request.getSkills() != null ? request.getSkills().trim() : "");

            WorkerProfile savedProfile = workerProfileRepository.save(profile);
            System.out.println("Worker profile created for: " + savedProfile.getEmail());

            // Update user role to WORKER
            user.setRole("WORKER");
            userRepository.save(user);

            response.put("status", "SUCCESS");
            response.put("message", "Worker profile created successfully");
            response.put("profile", Map.of(
                "email", savedProfile.getEmail(),
                "professionalTitle", savedProfile.getProfessionalTitle(),
                "experience", savedProfile.getExperience(),
                "phoneNumber", savedProfile.getPhoneNumber()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error creating worker profile: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to create worker profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET WORKER PROFILE WITH DETAILS
     */
    @GetMapping("/profile/{email}")
    public ResponseEntity<?> getWorkerProfile(@PathVariable String email) {
        System.out.println("=== GET WORKER PROFILE DETAILS ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            WorkerProfile profile = workerProfileRepository.findByEmail(email);
            if (profile == null) {
                response.put("status", "ERROR");
                response.put("message", "Worker profile not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Get user details
            User user = userRepository.findByEmail(email);
            
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("email", profile.getEmail());
            profileData.put("professionalTitle", profile.getProfessionalTitle());
            profileData.put("experience", profile.getExperience());
            profileData.put("phoneNumber", profile.getPhoneNumber());
            profileData.put("serviceAreas", profile.getServiceAreas());
            profileData.put("hourlyRate", profile.getHourlyRate());
            profileData.put("skills", profile.getSkills());
            profileData.put("bio", profile.getBio());
            profileData.put("userRole", user != null ? user.getRole() : "UNKNOWN");

            response.put("status", "SUCCESS");
            response.put("message", "Worker profile retrieved successfully");
            response.put("profile", profileData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving worker profile: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve worker profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    /**
     * ✅ COMBINED REGISTRATION - Handles both USER and WORKER registration
     */
    @PostMapping("/register-combined")
    public ResponseEntity<Map<String, Object>> registerCombined(@RequestBody Map<String, Object> request) {
        System.out.println("=== COMBINED REGISTRATION ===");
        System.out.println("Email: " + request.get("email"));
        System.out.println("Role: " + request.get("role"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Extract basic user data
            String email = ((String) request.get("email")).toLowerCase().trim();
            String password = (String) request.get("password");
            String role = ((String) request.get("role")).toUpperCase();
            
            // Validate required fields
            if (email == null || email.isEmpty() || password == null || password.isEmpty() || role == null || role.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Email, password and role are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if email already exists
            User existingUser = userRepository.findByEmail(email);
            if (existingUser != null) {
                response.put("status", "ERROR");
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Create and save user
            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            user.setRole(role);
            
            User savedUser = userRepository.save(user);
            System.out.println("User created with ID: " + savedUser.getId());
            
            // If role is WORKER, create worker profile
            if ("WORKER".equals(role)) {
                // Validate worker-specific fields
                String professionalTitle = (String) request.get("professionalTitle");
                String phoneNumber = (String) request.get("phoneNumber");
                
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
                profile.setExperience((String) request.get("experience"));
                profile.setPhoneNumber(phoneNumber.trim());
                profile.setServiceAreas((String) request.get("serviceAreas"));
                profile.setHourlyRate(request.get("hourlyRate") != null ? 
                    Double.parseDouble(request.get("hourlyRate").toString()) : 0.0);
                profile.setSkills((String) request.get("skills"));
                profile.setBio((String) request.get("bio"));
                
                // You need to autowire WorkerProfileRepository in UserController
                // @Autowired
                // private WorkerProfileRepository workerProfileRepository;
                WorkerProfile savedProfile = workerProfileRepository.save(profile);
                System.out.println("Worker profile created for: " + savedProfile.getEmail());
                
                response.put("workerProfile", Map.of(
                    "professionalTitle", savedProfile.getProfessionalTitle(),
                    "experience", savedProfile.getExperience()
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
     * ✅ UPDATE WORKER PROFILE
     */
    @PutMapping("/profile/{email}")
    public ResponseEntity<?> updateWorkerProfile(@PathVariable String email, @RequestBody WorkerProfile profileData) {
        System.out.println("=== UPDATE WORKER PROFILE ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            WorkerProfile profile = workerProfileRepository.findByEmail(email);
            if (profile == null) {
                response.put("status", "ERROR");
                response.put("message", "Worker profile not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Update only provided fields
            if (profileData.getProfessionalTitle() != null) {
                profile.setProfessionalTitle(profileData.getProfessionalTitle().trim());
            }
            if (profileData.getExperience() != null) {
                profile.setExperience(profileData.getExperience());
            }
            if (profileData.getBio() != null) {
                profile.setBio(profileData.getBio().trim());
            }
            if (profileData.getHourlyRate() != null) {
                profile.setHourlyRate(profileData.getHourlyRate());
            }
            if (profileData.getServiceAreas() != null) {
                profile.setServiceAreas(profileData.getServiceAreas().trim());
            }
            if (profileData.getPhoneNumber() != null) {
                profile.setPhoneNumber(profileData.getPhoneNumber().trim());
            }
            if (profileData.getSkills() != null) {
                profile.setSkills(profileData.getSkills().trim());
            }

            WorkerProfile savedProfile = workerProfileRepository.save(profile);

            response.put("status", "SUCCESS");
            response.put("message", "Worker profile updated successfully");
            response.put("profile", Map.of(
                "professionalTitle", savedProfile.getProfessionalTitle(),
                "experience", savedProfile.getExperience(),
                "phoneNumber", savedProfile.getPhoneNumber()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error updating worker profile: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to update worker profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET WORKER DASHBOARD STATS
     */
    @GetMapping("/dashboard/{email}")
    public ResponseEntity<?> getWorkerDashboard(@PathVariable String email) {
        System.out.println("=== GET WORKER DASHBOARD ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            WorkerProfile profile = workerProfileRepository.findByEmail(email);
            if (profile == null) {
                response.put("status", "ERROR");
                response.put("message", "Worker profile not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Mock dashboard data
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("totalEarnings", 12500.0);
            dashboard.put("monthlyEarnings", 8500.0);
            dashboard.put("completedJobs", 25);
            dashboard.put("pendingJobs", 3);
            dashboard.put("avgRating", 4.8);
            dashboard.put("responseRate", "95%");
            dashboard.put("repeatClients", 15);
            dashboard.put("profileCompletion", "85%");

            response.put("status", "SUCCESS");
            response.put("message", "Dashboard data retrieved successfully");
            response.put("dashboard", dashboard);
            response.put("workerInfo", Map.of(
                "professionalTitle", profile.getProfessionalTitle(),
                "experience", profile.getExperience(),
                "hourlyRate", profile.getHourlyRate()
            ));
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving dashboard: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve dashboard data: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ SEARCH WORKERS BY SERVICE
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchWorkers(
            @RequestParam(required = false) String service,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Double maxRate) {
        
        System.out.println("=== SEARCH WORKERS ===");
        System.out.println("Service: " + service + ", Location: " + location + ", Max Rate: " + maxRate);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Mock search results - in real app, implement proper search logic
            Map<String, Object>[] workers = new Map[] {
                createWorkerResult("plumber@example.com", "Senior Plumber", "Plumbing", "Chennai", 500.0, 4.8, "5-10 years"),
                createWorkerResult("electrician@example.com", "Certified Electrician", "Electrical", "Chennai", 400.0, 4.9, "3-5 years"),
                createWorkerResult("ac@example.com", "AC Technician", "AC Service", "Chennai", 600.0, 4.7, "1-3 years")
            };

            response.put("status", "SUCCESS");
            response.put("message", "Workers found successfully");
            response.put("results", workers);
            response.put("totalCount", workers.length);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error searching workers: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to search workers: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET WORKER AVAILABILITY
     */
    @GetMapping("/availability/{email}")
    public ResponseEntity<?> getWorkerAvailability(@PathVariable String email) {
        System.out.println("=== GET WORKER AVAILABILITY ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            WorkerProfile profile = workerProfileRepository.findByEmail(email);
            if (profile == null) {
                response.put("status", "ERROR");
                response.put("message", "Worker profile not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Mock availability data
            Map<String, Object> availability = new HashMap<>();
            availability.put("monday", "9:00 AM - 6:00 PM");
            availability.put("tuesday", "9:00 AM - 6:00 PM");
            availability.put("wednesday", "9:00 AM - 6:00 PM");
            availability.put("thursday", "9:00 AM - 6:00 PM");
            availability.put("friday", "9:00 AM - 6:00 PM");
            availability.put("saturday", "10:00 AM - 4:00 PM");
            availability.put("sunday", "Not Available");
            availability.put("emergencyService", true);
            availability.put("responseTime", "Within 2 hours");

            response.put("status", "SUCCESS");
            response.put("message", "Availability retrieved successfully");
            response.put("availability", availability);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving availability: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve availability: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Helper methods
    private Map<String, Object> createWorkerResult(String email, String title, String service, String location, 
                                                 Double rate, Double rating, String experience) {
        Map<String, Object> worker = new HashMap<>();
        worker.put("email", email);
        worker.put("professionalTitle", title);
        worker.put("service", service);
        worker.put("location", location);
        worker.put("hourlyRate", rate);
        worker.put("rating", rating);
        worker.put("experience", experience);
        worker.put("completedJobs", 25);
        return worker;
    }
}