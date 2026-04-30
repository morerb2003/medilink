package com.medilink.backend.repository;

import com.medilink.backend.model.MedicationStatement;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicationStatementRepository extends JpaRepository<MedicationStatement, UUID> {

    List<MedicationStatement> findByPatientIdOrderByStartDateDesc(UUID patientId);
}
