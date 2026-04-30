package com.medilink.backend.repository;

import com.medilink.backend.model.EmergencyLog;
import com.medilink.backend.model.EmergencyLog.EmergencyStatus;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyLogRepository extends JpaRepository<EmergencyLog, UUID> {

    List<EmergencyLog> findByDoctorIdOrderByAccessedAtDesc(UUID doctorId);

    @Query("select e from EmergencyLog e where e.doctor.id = :doctorId order by e.accessedAt desc")
    List<EmergencyLog> findByDoctorIdOrderByAccessTimeDesc(UUID doctorId);

    // Find active emergency access for doctor-patient pair
    @Query("SELECT e FROM EmergencyLog e WHERE e.doctor.id = :doctorId AND e.patient.id = :patientId "
            + "AND e.status = 'ACTIVE' AND e.expiresAt > :now")
    Optional<EmergencyLog> findActiveEmergencyAccess(
            @Param("doctorId") UUID doctorId,
            @Param("patientId") UUID patientId,
            @Param("now") LocalDateTime now
    );

    // Find all active emergency sessions
    @Query("SELECT e FROM EmergencyLog e WHERE e.status = 'ACTIVE' AND e.expiresAt > :now")
    List<EmergencyLog> findActiveSessions(@Param("now") LocalDateTime now);

    // Find expired sessions for cleanup
    @Query("SELECT e FROM EmergencyLog e WHERE e.status = 'ACTIVE' AND e.expiresAt < :now")
    List<EmergencyLog> findExpiredSessions(@Param("now") LocalDateTime now);
}
