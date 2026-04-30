package com.medilink.backend.service;

import com.medilink.backend.dto.EmergencyLogDTO;
import com.medilink.backend.dto.PractitionerDTO;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.EmergencyLogRepository;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final EmergencyLogRepository emergencyLogRepository;

    public PractitionerDTO getProfile(UUID doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return mapToPractitioner(doctor);
    }

    public List<PractitionerDTO> search(String query) {
        String normalizedQuery = query == null ? "" : query.toLowerCase(Locale.ROOT);
        return doctorRepository.findAll().stream()
                .filter(doctor -> normalizedQuery.isBlank()
                || contains(doctor.getFullName(), normalizedQuery)
                || contains(doctor.getSpecialization(), normalizedQuery)
                || contains(doctor.getHospital(), normalizedQuery))
                .map(this::mapToPractitioner)
                .toList();
    }

    public List<EmergencyLogDTO> accessHistory(UUID doctorId) {
        return emergencyLogRepository.findByDoctorIdOrderByAccessedAtDesc(doctorId).stream()
                .map(log -> EmergencyLogDTO.builder()
                .id(log.getId())
                .doctorId(log.getDoctor() == null ? null : log.getDoctor().getId())
                .patientId(log.getPatient() == null ? null : log.getPatient().getId())
                .accessMethod(log.getAccessMethod() == null ? null : log.getAccessMethod().name())
                .status(log.getStatus() == null ? null : log.getStatus().name())
                .accessedAt(log.getAccessedAt())
                .expiresAt(log.getExpiresAt())
                .ipAddress(log.getIpAddress())
                .geoLocation(log.getGeoLocation())
                .deviceFingerprint(log.getDeviceFingerprint())
                .build())
                .toList();
    }

    private PractitionerDTO mapToPractitioner(Doctor doctor) {
        return PractitionerDTO.builder()
                .id(doctor.getId())
                .fullName(doctor.getFullName())
                .email(doctor.getEmail())
                .phone(doctor.getPhone())
                .licenseNo(doctor.getLicenseNo())
                .specialization(doctor.getSpecialization())
                .hospital(doctor.getHospital())
                .department(doctor.getDepartment())
                .verified(doctor.isVerified())
                .build();
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }
}
