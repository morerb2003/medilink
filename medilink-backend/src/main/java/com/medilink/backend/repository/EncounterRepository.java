package com.medilink.backend.repository;

import com.medilink.backend.model.Encounter;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EncounterRepository extends JpaRepository<Encounter, UUID> {

    List<Encounter> findByPatientIdOrderByStartTimeDesc(UUID patientId);
}
