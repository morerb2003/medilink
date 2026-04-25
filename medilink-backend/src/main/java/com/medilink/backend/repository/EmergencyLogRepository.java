package com.medilink.backend.repository;

import com.medilink.backend.model.EmergencyLog;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EmergencyLogRepository extends JpaRepository<EmergencyLog, UUID> {

    List<EmergencyLog> findByDoctorIdOrderByAccessedAtDesc(UUID doctorId);

    @Query("select e from EmergencyLog e where e.doctor.id = :doctorId order by e.accessedAt desc")
    List<EmergencyLog> findByDoctorIdOrderByAccessTimeDesc(UUID doctorId);
}
