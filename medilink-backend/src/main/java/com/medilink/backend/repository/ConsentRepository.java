package com.medilink.backend.repository;

import com.medilink.backend.model.Consent;
import com.medilink.backend.model.Consent.ConsentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ConsentRepository extends JpaRepository<Consent, UUID> {

    // 🔥 Core permission check
    Optional<Consent> findByPatientIdAndDoctorIdAndStatus(
            UUID patientId,
            UUID doctorId,
            ConsentStatus status
    );
}
