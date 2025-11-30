package com.servicenest.repository;

import com.servicenest.model.WorkerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkerProfileRepository extends JpaRepository<WorkerProfile, Long> {
    WorkerProfile findByEmail(String email);
}