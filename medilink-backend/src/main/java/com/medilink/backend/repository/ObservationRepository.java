package com.medilink.backend.repository;

import com.medilink.backend.model.Observation;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ObservationRepository extends JpaRepository<Observation, UUID> {

    List<Observation> findByPatientIdOrderByEffectiveDateDesc(UUID patientId);
}
