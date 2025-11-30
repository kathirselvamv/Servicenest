package com.servicenest.controller;

import com.servicenest.model.Booking;
import com.servicenest.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin("*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    /**
     * ✅ CREATE NEW BOOKING
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Booking booking) {
        System.out.println("=== CREATE BOOKING ===");
        System.out.println("Service: " + booking.getServiceType());
        System.out.println("Customer: " + booking.getCustomerName());
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate required fields
            if (booking.getServiceType() == null || booking.getServiceType().trim().isEmpty() ||
                booking.getCustomerName() == null || booking.getCustomerName().trim().isEmpty() ||
                booking.getCustomerEmail() == null || booking.getCustomerEmail().trim().isEmpty() ||
                booking.getCustomerPhone() == null || booking.getCustomerPhone().trim().isEmpty()) {
                
                response.put("status", "ERROR");
                response.put("message", "All fields are required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Set default status if not provided
            if (booking.getStatus() == null) {
                booking.setStatus("pending");
            }
            
            Booking savedBooking = bookingRepository.save(booking);
            
            response.put("status", "SUCCESS");
            response.put("message", "Booking created successfully");
            response.put("bookingId", savedBooking.getId());
            response.put("booking", savedBooking);
            
            System.out.println("Booking created with ID: " + savedBooking.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error creating booking: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to create booking: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET USER BOOKINGS
     */
    @GetMapping("/user/{email}")
    public ResponseEntity<Map<String, Object>> getUserBookings(@PathVariable String email) {
        System.out.println("=== GET USER BOOKINGS ===");
        System.out.println("User email: " + email);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Booking> bookings = bookingRepository.findByCustomerEmailOrderByCreatedAtDesc(email);
            
            response.put("status", "SUCCESS");
            response.put("message", "Bookings retrieved successfully");
            response.put("bookings", bookings);
            response.put("count", bookings.size());
            
            System.out.println("Found " + bookings.size() + " bookings for user: " + email);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving user bookings: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve bookings: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET WORKER BOOKINGS
     */
    @GetMapping("/worker/{workerEmail}")
    public ResponseEntity<Map<String, Object>> getWorkerBookings(@PathVariable String workerEmail) {
        System.out.println("=== GET WORKER BOOKINGS ===");
        System.out.println("Worker email: " + workerEmail);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Booking> bookings = bookingRepository.findByAssignedWorkerOrderByCreatedAtDesc(workerEmail);
            
            response.put("status", "SUCCESS");
            response.put("message", "Bookings retrieved successfully");
            response.put("bookings", bookings);
            response.put("count", bookings.size());
            
            System.out.println("Found " + bookings.size() + " bookings for worker: " + workerEmail);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving worker bookings: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve bookings: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET PENDING BOOKINGS (for workers to accept)
     */
    @GetMapping("/pending")
    public ResponseEntity<Map<String, Object>> getPendingBookings() {
        System.out.println("=== GET PENDING BOOKINGS ===");
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<Booking> pendingBookings = bookingRepository.findByStatusAndAssignedWorkerIsNullOrderByCreatedAtDesc("pending");
            
            response.put("status", "SUCCESS");
            response.put("message", "Pending bookings retrieved successfully");
            response.put("bookings", pendingBookings);
            response.put("count", pendingBookings.size());
            
            System.out.println("Found " + pendingBookings.size() + " pending bookings");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving pending bookings: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve pending bookings: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ UPDATE BOOKING STATUS
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateBookingStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> statusUpdate) {
        
        System.out.println("=== UPDATE BOOKING STATUS ===");
        System.out.println("Booking ID: " + id);
        System.out.println("New status: " + statusUpdate.get("status"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Booking> optionalBooking = bookingRepository.findById(id);
            
            if (optionalBooking.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Booking not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            Booking booking = optionalBooking.get();
            String newStatus = statusUpdate.get("status");
            String workerEmail = statusUpdate.get("workerEmail");
            
            // Validate status
            if (newStatus == null || newStatus.trim().isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Status is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            // If worker is accepting the booking, assign them
            if ("accepted".equals(newStatus) && workerEmail != null) {
                booking.setAssignedWorker(workerEmail);
            }
            
            booking.setStatus(newStatus);
            Booking updatedBooking = bookingRepository.save(booking);
            
            response.put("status", "SUCCESS");
            response.put("message", "Booking status updated successfully");
            response.put("booking", updatedBooking);
            
            System.out.println("Booking " + id + " status updated to: " + newStatus);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error updating booking status: " + e.getMessage());
            e.printStackTrace();
            
            response.put("status", "ERROR");
            response.put("message", "Failed to update booking status: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ ASSIGN WORKER TO BOOKING
     */
    @PutMapping("/{id}/assign-worker")
    public ResponseEntity<Map<String, Object>> assignWorkerToBooking(
            @PathVariable Long id,
            @RequestBody Map<String, String> assignment) {
        
        System.out.println("=== ASSIGN WORKER TO BOOKING ===");
        System.out.println("Booking ID: " + id);
        System.out.println("Worker: " + assignment.get("workerEmail"));
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Booking> optionalBooking = bookingRepository.findById(id);
            
            if (optionalBooking.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Booking not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            Booking booking = optionalBooking.get();
            String workerEmail = assignment.get("workerEmail");
            
            if (workerEmail == null || workerEmail.trim().isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Worker email is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            booking.setAssignedWorker(workerEmail);
            booking.setStatus("accepted");
            Booking updatedBooking = bookingRepository.save(booking);
            
            response.put("status", "SUCCESS");
            response.put("message", "Worker assigned successfully");
            response.put("booking", updatedBooking);
            
            System.out.println("Worker " + workerEmail + " assigned to booking " + id);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error assigning worker: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to assign worker: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ GET BOOKING BY ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getBookingById(@PathVariable Long id) {
        System.out.println("=== GET BOOKING BY ID ===");
        System.out.println("Booking ID: " + id);
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            Optional<Booking> optionalBooking = bookingRepository.findById(id);
            
            if (optionalBooking.isEmpty()) {
                response.put("status", "ERROR");
                response.put("message", "Booking not found");
                return ResponseEntity.badRequest().body(response);
            }
            
            Booking booking = optionalBooking.get();
            
            response.put("status", "SUCCESS");
            response.put("message", "Booking retrieved successfully");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.out.println("Error retrieving booking: " + e.getMessage());
            
            response.put("status", "ERROR");
            response.put("message", "Failed to retrieve booking: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    /**
     * ✅ HEALTH CHECK
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Bookings API is running");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}