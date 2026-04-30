package com.medilink.backend.repository;

import com.medilink.backend.model.Patient;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PatientRepository extends JpaRepository<Patient, UUID> {

    Optional<Patient> findByHealthId(String healthId);

    List<Patient> findTop20ByFullNameContainingIgnoreCaseOrHealthIdContainingIgnoreCaseOrderByFullNameAsc(
            String fullName,
            String healthId
    );
}
