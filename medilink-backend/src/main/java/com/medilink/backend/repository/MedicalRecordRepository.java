package com.medilink.backend.repository;



import com.medilink.backend.model.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {

    // 🔥 Most used query (optimized with index)
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
}

