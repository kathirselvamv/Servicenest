package com.servicenest.controller;

import com.servicenest.model.User;

import com.servicenest.model.UserProfile;
import com.servicenest.repository.UserRepository;
import com.servicenest.repository.WorkerProfileRepository;
import com.servicenest.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin("*")
public class UserProfileController {
	@Autowired
	private WorkerProfileRepository workerProfileRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    /**
     * ✅ GET USER PROFILE
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserProfile(@PathVariable String email) {
        System.out.println("=== GET USER PROFILE ===");
        System.out.println("Email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) {
                response.put("status", "ERROR");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            UserProfile profile = userProfileRepository.findByUserEmail(email);
            if (profile == null) {
                // Create default profile if not exists
                profile = new UserProfile();
                profile.setUserEmail(email);
                profile.setFirstName("");
                profile.setLastName("");
                profile.setPhone("");
                profile = userProfileRepository.save(profile);
            }

            Map<String, Object> profileData = new HashMap<>();
            profileData.put("email", user.getEmail());
            profileData.put("role", user.getRole());
            profileData.put("firstName", profile.getFirstName());
            profileData.put("lastName", profile.getLastName());
            profileData.put("phone", profile.getPhone());
            profileData.put("dateOfBirth", profile.getDateOfBirth());
            profileData.put("gender", profile.getGender());

            response.put("status", "SUCCESS");
            response.put("message", "Profile retrieved successfully");
            response.put("profile", profileData);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving profile: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ UPDATE USER PROFILE
     */
    @PutMapping("/user/{email}")
    public ResponseEntity<?> updateUserProfile(@PathVariable String email, @RequestBody UserProfile profileData) {
        System.out.println("=== UPDATE USER PROFILE ===");
        System.out.println("Email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            UserProfile profile = userProfileRepository.findByUserEmail(email);
            if (profile == null) {
                profile = new UserProfile();
                profile.setUserEmail(email);
            }

            // Update profile fields
            if (profileData.getFirstName() != null) {
                profile.setFirstName(profileData.getFirstName());
            }
            if (profileData.getLastName() != null) {
                profile.setLastName(profileData.getLastName());
            }
            if (profileData.getPhone() != null) {
                profile.setPhone(profileData.getPhone());
            }
            if (profileData.getDateOfBirth() != null) {
                profile.setDateOfBirth(profileData.getDateOfBirth());
            }
            if (profileData.getGender() != null) {
                profile.setGender(profileData.getGender());
            }

            UserProfile savedProfile = userProfileRepository.save(profile);

            response.put("status", "SUCCESS");
            response.put("message", "Profile updated successfully");
            response.put("profile", savedProfile);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error updating profile: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ CHANGE PASSWORD
     */
    @PutMapping("/user/{email}/password")
    public ResponseEntity<?> changePassword(@PathVariable String email, @RequestBody Map<String, String> passwordData) {
        System.out.println("=== CHANGE PASSWORD ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String currentPassword = passwordData.get("currentPassword");
            String newPassword = passwordData.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                response.put("status", "ERROR");
                response.put("message", "Current password and new password are required");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                response.put("status", "ERROR");
                response.put("message", "User not found");
                return ResponseEntity.badRequest().body(response);
            }

            // Check current password
            if (!user.getPassword().equals(currentPassword)) {
                response.put("status", "ERROR");
                response.put("message", "Current password is incorrect");
                return ResponseEntity.badRequest().body(response);
            }

            // Update password
            user.setPassword(newPassword);
            userRepository.save(user);

            response.put("status", "SUCCESS");
            response.put("message", "Password updated successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error changing password: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to change password: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}