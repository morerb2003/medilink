package com.medilink.backend.service;

import com.medilink.backend.dto.EmergencySnapshotDTO;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.EmergencyLog;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.EmergencyLogRepository;
import com.medilink.backend.repository.PatientRepository;
import com.medilink.backend.security.QRTokenService;
import io.jsonwebtoken.Claims;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EmergencyAccessService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final EmergencyLogRepository emergencyLogRepository;
    private final QRTokenService qrTokenService;

    @Transactional
    public EmergencySnapshotDTO accessByHealthId(String healthId, UUID doctorId, String ipAddress) {
        Doctor doctor = loadVerifiedDoctor(doctorId);
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        writeEmergencyLog(doctor, patient, EmergencyLog.AccessMethod.HEALTH_ID, ipAddress);
        return mapToSnapshot(patient);
    }

    @Transactional
    public EmergencySnapshotDTO accessByQr(String qrToken, UUID doctorId, String ipAddress) {
        Claims claims = qrTokenService.verifyQr(qrToken);
        String healthId = claims.get("healthId", String.class);
        Doctor doctor = loadVerifiedDoctor(doctorId);
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        writeEmergencyLog(doctor, patient, EmergencyLog.AccessMethod.QR_SCAN, ipAddress);
        return mapToSnapshot(patient);
    }

    private Doctor loadVerifiedDoctor(UUID doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        if (!doctor.canAccessPatientData()) {
            throw new IllegalStateException("Doctor is not verified for patient data access");
        }
        return doctor;
    }

    private void writeEmergencyLog(
            Doctor doctor,
            Patient patient,
            EmergencyLog.AccessMethod accessMethod,
            String ipAddress
    ) {
        EmergencyLog log = EmergencyLog.builder()
                .doctor(doctor)
                .patient(patient)
                .reason("Emergency access")
                .accessMethod(accessMethod)
                .accessedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .ipAddress(ipAddress)
                .build();
        emergencyLogRepository.save(log);
    }

    private EmergencySnapshotDTO mapToSnapshot(Patient patient) {
        Patient.EmergencyContact emergencyContact = patient.getEmergencyContact();
        EmergencySnapshotDTO.EmergencyContactDTO contactDTO = emergencyContact == null
                ? null
                : EmergencySnapshotDTO.EmergencyContactDTO.builder()
                .name(emergencyContact.getName())
                .phone(emergencyContact.getPhone())
                .relation(emergencyContact.getRelation())
                .build();

        return EmergencySnapshotDTO.builder()
                .fullName(patient.getFullName())
                .bloodGroup(patient.getBloodGroup())
                .allergies(patient.getAllergies())
                .currentMedications(patient.getCurrentMedications())
                .chronicConditions(patient.getChronicConditions())
                .emergencyContact(contactDTO)
                .build();
    }
}
