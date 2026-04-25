package com.medilink.backend.controller;

import com.medilink.backend.dto.AdminStatsDTO;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.EmergencyLogRepository;
import com.medilink.backend.repository.MedicalRecordRepository;
import com.medilink.backend.repository.PatientRepository;
import com.medilink.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final EmergencyLogRepository emergencyLogRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> stats() {
        AdminStatsDTO dto = AdminStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalDoctors(doctorRepository.count())
                .totalPatients(patientRepository.count())
                .totalRecords(medicalRecordRepository.count())
                .totalEmergencyAccess(emergencyLogRepository.count())
                .storageUsedBytes(0L)
                .build();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/doctors/pending")
    public ResponseEntity<List<Doctor>> pendingDoctors() {
        return ResponseEntity.ok(doctorRepository.findByIsVerifiedFalse());
    }
}
