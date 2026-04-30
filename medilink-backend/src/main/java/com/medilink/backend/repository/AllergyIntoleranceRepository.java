package com.medilink.backend.repository;

import com.medilink.backend.model.AllergyIntolerance;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllergyIntoleranceRepository extends JpaRepository<AllergyIntolerance, UUID> {

    List<AllergyIntolerance> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
}
