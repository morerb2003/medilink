package com.medilink.backend.service;

import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Consent;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.ConsentRepository;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.PatientRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ConsentService {

    private final ConsentRepository consentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public boolean hasValidConsent(UUID patientId, UUID doctorId) {
        return consentRepository
                .findByPatientIdAndDoctorIdAndStatus(
                        patientId,
                        doctorId,
                        Consent.ConsentStatus.APPROVED
                )
                .filter(c -> c.getExpiresAt() == null || c.getExpiresAt().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    @Transactional
    public Consent requestConsent(UUID patientId, UUID doctorId, String reason) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        Consent consent = Consent.builder()
                .patient(patient)
                .doctor(doctor)
                .status(Consent.ConsentStatus.PENDING)
                .reason(reason)
                .requestedAt(LocalDateTime.now())
                .build();

        return consentRepository.save(consent);
    }

    @Transactional
    public Consent approveConsent(UUID consentId) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));

        consent.setStatus(Consent.ConsentStatus.APPROVED);
        consent.setRespondedAt(LocalDateTime.now());
        consent.setExpiresAt(LocalDateTime.now().plusDays(1));

        return consentRepository.save(consent);
    }

    @Transactional
    public Consent rejectConsent(UUID consentId) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));
        consent.setStatus(Consent.ConsentStatus.REJECTED);
        consent.setRespondedAt(LocalDateTime.now());
        return consentRepository.save(consent);
    }

    @Transactional
    public Consent revokeConsent(UUID consentId) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));
        consent.setStatus(Consent.ConsentStatus.REVOKED);
        consent.setRevokedAt(LocalDateTime.now());
        return consentRepository.save(consent);
    }
}

