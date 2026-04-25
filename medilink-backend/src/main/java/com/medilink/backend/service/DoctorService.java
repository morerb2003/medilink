package com.medilink.backend.service;

import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.EmergencyLog;
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

    public Doctor getProfile(UUID doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    public List<Doctor> search(String query) {
        String normalizedQuery = query == null ? "" : query.toLowerCase(Locale.ROOT);
        return doctorRepository.findAll().stream()
                .filter(doctor -> normalizedQuery.isBlank()
                        || contains(doctor.getFullName(), normalizedQuery)
                        || contains(doctor.getSpecialization(), normalizedQuery)
                        || contains(doctor.getHospital(), normalizedQuery))
                .toList();
    }

    public List<EmergencyLog> accessHistory(UUID doctorId) {
        return emergencyLogRepository.findByDoctorIdOrderByAccessedAtDesc(doctorId);
    }

    private boolean contains(String value, String query) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(query);
    }
}
