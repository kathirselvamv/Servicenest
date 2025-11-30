package com.servicenest.repository;

import com.servicenest.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Find user by email
    User findByEmail(String email);
    
    // Find user by email AND role
    User findByEmailAndRole(String email, String role);
    
    // Check if email exists
    boolean existsByEmail(String email);
}