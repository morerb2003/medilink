package com.medilink.backend.service;

import com.medilink.backend.dto.AdminStatsDTO;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.Organization;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.OrganizationRepository;
import com.medilink.backend.repository.PatientRepository;
import com.medilink.backend.repository.UserRepository;
import com.medilink.backend.exception.ResourceNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final OrganizationRepository organizationRepository;

    public AdminStatsDTO getGlobalStats() {
        return AdminStatsDTO.builder()
                .totalUsers(userRepository.count())
                .totalDoctors(doctorRepository.count())
                .totalPatients(patientRepository.count())
                .pendingDoctorVerifications(doctorRepository.countByVerifiedAtIsNull())
                .totalOrganizations(organizationRepository.count())
                .build();
    }

    @Transactional
    public void verifyDoctor(UUID doctorId, String verifiedBy) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        
        doctor.setVerifiedAt(LocalDateTime.now());
        doctor.setVerifiedBy(verifiedBy);
        doctor.setVerified(true);
        doctorRepository.save(doctor);
    }

    @Transactional
    public Organization createOrganization(Organization org) {
        if (organizationRepository.existsByName(org.getName())) {
            throw new IllegalArgumentException("Organization with this name already exists");
        }
        return organizationRepository.save(org);
    }

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public List<Doctor> getPendingDoctors() {
        return doctorRepository.findAllByVerifiedAtIsNull();
    }
}
