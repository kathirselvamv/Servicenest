package com.servicenest.repository;

import com.servicenest.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Find bookings by customer email
    List<Booking> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    
    // Find bookings by status
    List<Booking> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find bookings by worker email
    List<Booking> findByAssignedWorkerOrderByCreatedAtDesc(String workerEmail);
    
    // Find pending bookings for workers
    List<Booking> findByStatusAndAssignedWorkerIsNullOrderByCreatedAtDesc(String status);
}