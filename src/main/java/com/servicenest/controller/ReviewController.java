package com.servicenest.controller;

import com.servicenest.model.Review;
import com.servicenest.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    /**
     * ✅ GET REVIEWS FOR SERVICE
     */
    @GetMapping("/service/{serviceType}")
    public ResponseEntity<?> getServiceReviews(@PathVariable String serviceType) {
        System.out.println("=== GET SERVICE REVIEWS ===");
        System.out.println("Service: " + serviceType);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Review> reviews = reviewRepository.findByServiceTypeOrderByCreatedAtDesc(serviceType);
            Double averageRating = reviewRepository.findAverageRatingByServiceType(serviceType);
            Long totalReviews = reviewRepository.countByServiceType(serviceType);
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("averageRating", averageRating != null ? Math.round(averageRating * 10.0) / 10.0 : 0);
            stats.put("totalReviews", totalReviews);
            
            response.put("status", "SUCCESS");
            response.put("message", "Reviews retrieved successfully");
            response.put("reviews", reviews);
            response.put("stats", stats);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving reviews: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve reviews: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ SUBMIT NEW REVIEW
     */
    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        System.out.println("=== SUBMIT REVIEW ===");
        System.out.println("Service: " + review.getServiceType());
        System.out.println("Rating: " + review.getRating());
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate input
            if (review.getServiceType() == null || review.getServiceType().trim().isEmpty() ||
                review.getCustomerEmail() == null || review.getCustomerEmail().trim().isEmpty() ||
                review.getRating() == null || review.getRating() < 1 || review.getRating() > 5) {
                
                response.put("status", "ERROR");
                response.put("message", "Invalid review data");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Check if user already reviewed this service
            boolean alreadyReviewed = reviewRepository.existsByCustomerEmailAndServiceType(
                review.getCustomerEmail(), review.getServiceType());
            
            if (alreadyReviewed) {
                response.put("status", "ERROR");
                response.put("message", "You have already reviewed this service");
                return ResponseEntity.badRequest().body(response);
            }
            
            Review savedReview = reviewRepository.save(review);
            
            response.put("status", "SUCCESS");
            response.put("message", "Review submitted successfully");
            response.put("review", savedReview);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error submitting review: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to submit review: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET USER REVIEWS
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserReviews(@PathVariable String email) {
        System.out.println("=== GET USER REVIEWS ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Review> reviews = reviewRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
            
            response.put("status", "SUCCESS");
            response.put("message", "User reviews retrieved successfully");
            response.put("reviews", reviews);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving user reviews: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve user reviews: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}