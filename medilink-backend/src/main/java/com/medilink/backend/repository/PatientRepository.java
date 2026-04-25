package com.medilink.backend.repository;

import com.medilink.backend.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    // 🔥 Critical for Emergency Access
    Optional<Patient> findByHealthId(String healthId);
}

