package com.medilink.backend.repository;

import com.medilink.backend.model.Condition;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConditionRepository extends JpaRepository<Condition, UUID> {

    List<Condition> findByPatientIdOrderByOnsetDateDesc(UUID patientId);
}
