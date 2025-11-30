package com.servicenest.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin("*")
public class ContactController {

    /**
     * ✅ SEND CONTACT MESSAGE
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendContactMessage(@RequestBody Map<String, String> contactData) {
        System.out.println("=== SEND CONTACT MESSAGE ===");
        System.out.println("Name: " + contactData.get("name"));
        System.out.println("Email: " + contactData.get("email"));
        System.out.println("Subject: " + contactData.get("subject"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate required fields
            if (contactData.get("name") == null || contactData.get("name").trim().isEmpty() ||
                contactData.get("email") == null || contactData.get("email").trim().isEmpty() ||
                contactData.get("subject") == null || contactData.get("subject").trim().isEmpty() ||
                contactData.get("message") == null || contactData.get("message").trim().isEmpty()) {
                
                response.put("status", "ERROR");
                response.put("message", "All fields are required");
                return ResponseEntity.badRequest().body(response);
            }

            // In a real application, you would:
            // 1. Save to database
            // 2. Send email notification
            // 3. Trigger internal alert
            
            System.out.println("Contact message received from: " + contactData.get("name"));
            System.out.println("Message: " + contactData.get("message"));

            response.put("status", "SUCCESS");
            response.put("message", "Thank you for your message! We'll get back to you within 24 hours.");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error sending contact message: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to send message. Please try again.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}