package com.medilink.backend.repository;

import com.medilink.backend.model.Consent;
import com.medilink.backend.model.Consent.ConsentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

@Repository
public interface ConsentRepository extends JpaRepository<Consent, UUID> {

    // 🔥 Core permission check
    Optional<Consent> findByPatientIdAndDoctorIdAndStatus(
            UUID patientId,
            UUID doctorId,
            ConsentStatus status
    );

    List<Consent> findByPatientIdOrderByRequestedAtDesc(UUID patientId);

    List<Consent> findByDoctorIdOrderByRequestedAtDesc(UUID doctorId);

    // Find approved consent for doctor-patient pair
    @Query("SELECT c FROM Consent c WHERE c.patient.id = :patientId AND c.doctor.id = :doctorId AND c.status = 'APPROVED'")
    Optional<Consent> findApprovedConsent(@Param("patientId") UUID patientId, @Param("doctorId") UUID doctorId);
}
