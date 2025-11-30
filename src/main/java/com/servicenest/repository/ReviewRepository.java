package com.servicenest.repository;

import com.servicenest.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    
    List<Review> findByServiceTypeOrderByCreatedAtDesc(String serviceType);
    
    List<Review> findByCustomerEmailOrderByCreatedAtDesc(String customerEmail);
    
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.serviceType = ?1")
    Double findAverageRatingByServiceType(String serviceType);
    
    @Query("SELECT COUNT(r) FROM Review r WHERE r.serviceType = ?1")
    Long countByServiceType(String serviceType);
    
    boolean existsByCustomerEmailAndServiceType(String customerEmail, String serviceType);
}