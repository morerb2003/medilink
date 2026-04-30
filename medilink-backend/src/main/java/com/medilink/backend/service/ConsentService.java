package com.medilink.backend.service;

import com.medilink.backend.dto.ConsentDTO;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Consent;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.ConsentRepository;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.PatientRepository;
import java.time.LocalDateTime;
import java.util.List;
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
    private final NotificationService notificationService;

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

    public void assertActiveConsent(UUID patientId, UUID doctorId) {
        if (!hasValidConsent(patientId, doctorId)) {
            throw new org.springframework.security.access.AccessDeniedException(
                "No active or valid consent found for this patient record access."
            );
        }
    }

    @Transactional
    public ConsentDTO requestConsent(UUID patientId, UUID doctorId, String reason) {
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

        return mapToDto(consentRepository.save(consent));
    }

    @Transactional
    public ConsentDTO approveConsent(UUID consentId, Integer durationHours) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));

        consent.setStatus(Consent.ConsentStatus.APPROVED);
        consent.setRespondedAt(LocalDateTime.now());
        
        if (durationHours != null && durationHours > 0) {
            consent.setExpiresAt(LocalDateTime.now().plusHours(durationHours));
        } else {
            consent.setExpiresAt(LocalDateTime.now().plusDays(1)); // Default 24h
        }
        
        Consent saved = consentRepository.save(consent);
        notificationService.sendConsentApprovalNotification(saved.getDoctor().getId(), saved.getId());

        return mapToDto(saved);
    }

    @Transactional
    public ConsentDTO rejectConsent(UUID consentId) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));
        consent.setStatus(Consent.ConsentStatus.REJECTED);
        consent.setRespondedAt(LocalDateTime.now());
        return mapToDto(consentRepository.save(consent));
    }

    @Transactional
    public ConsentDTO revokeConsent(UUID consentId) {
        Consent consent = consentRepository.findById(consentId)
                .orElseThrow(() -> new ResourceNotFoundException("Consent not found"));
        consent.setStatus(Consent.ConsentStatus.REVOKED);
        consent.setRevokedAt(LocalDateTime.now());
        return mapToDto(consentRepository.save(consent));
    }

    @Transactional(readOnly = true)
    public List<ConsentDTO> listByPatient(UUID patientId) {
        return consentRepository.findByPatientIdOrderByRequestedAtDesc(patientId).stream()
                .map(this::mapToDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ConsentDTO> listByDoctor(UUID doctorId) {
        return consentRepository.findByDoctorIdOrderByRequestedAtDesc(doctorId).stream()
                .map(this::mapToDto)
                .toList();
    }

    private ConsentDTO mapToDto(Consent consent) {
        return ConsentDTO.builder()
                .id(consent.getId())
                .patientId(consent.getPatient() == null ? null : consent.getPatient().getId())
                .doctorId(consent.getDoctor() == null ? null : consent.getDoctor().getId())
                .doctorName(consent.getDoctor() == null ? null : consent.getDoctor().getFullName())
                .status(consent.getStatus() == null ? null : consent.getStatus().name())
                .reason(consent.getReason())
                .requestedAt(consent.getRequestedAt())
                .respondedAt(consent.getRespondedAt())
                .expiresAt(consent.getExpiresAt())
                .build();
    }
}
