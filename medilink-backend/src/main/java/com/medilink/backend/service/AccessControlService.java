package com.medilink.backend.service;

import com.medilink.backend.model.Consent;
import com.medilink.backend.model.EmergencyLog;
import com.medilink.backend.repository.ConsentRepository;
import com.medilink.backend.repository.EmergencyLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Access Control Service for ABAC (Attribute-Based Access Control). Enforces
 * that doctors can only access patients they have valid consent for or active
 * emergency access.
 */
@Service("accessControl")
@RequiredArgsConstructor
@Slf4j
public class AccessControlService {

    private final ConsentRepository consentRepository;
    private final EmergencyLogRepository emergencyLogRepository;

    /**
     * Check if a doctor has access to a patient. Doctor can access patient if:
     * 1. Active APPROVED consent exists AND not expired, OR 2. Emergency access
     * granted (active EmergencyLog within expiry)
     *
     * @param doctorId The doctor ID
     * @param patientId The patient ID
     * @return true if doctor has access
     */
    @Transactional(readOnly = true)
    public boolean isDoctorAssignedToPatient(UUID doctorId, UUID patientId) {
        // Check for valid consent
        boolean hasValidConsent = hasValidConsent(patientId, doctorId);

        // Check for active emergency access
        boolean hasEmergencyAccess = hasActiveEmergencyAccess(doctorId, patientId);

        boolean hasAccess = hasValidConsent || hasEmergencyAccess;

        log.debug("Access check: doctor={}, patient={}, hasConsent={}, hasEmergency={}, result={}",
                doctorId, patientId, hasValidConsent, hasEmergencyAccess, hasAccess);

        return hasAccess;
    }

    /**
     * Check if patient has granted consent to doctor.
     */
    @Transactional(readOnly = true)
    public boolean hasValidConsent(UUID patientId, UUID doctorId) {
        return consentRepository.findApprovedConsent(patientId, doctorId)
                .map(consent -> {
                    // Check if consent is not expired
                    if (consent.getExpiresAt() != null
                            && consent.getExpiresAt().isBefore(LocalDateTime.now())) {
                        return false;
                    }
                    return consent.getStatus() == Consent.ConsentStatus.APPROVED;
                })
                .orElse(false);
    }

    /**
     * Check if doctor has active emergency access to patient.
     */
    @Transactional(readOnly = true)
    public boolean hasActiveEmergencyAccess(UUID doctorId, UUID patientId) {
        return emergencyLogRepository.findActiveEmergencyAccess(doctorId, patientId, LocalDateTime.now())
                .isPresent();
    }

    /**
     * Get the reason for access denial.
     */
    @Transactional(readOnly = true)
    public String getAccessDenialReason(UUID doctorId, UUID patientId) {
        if (!hasValidConsent(patientId, doctorId) && !hasActiveEmergencyAccess(doctorId, patientId)) {
            return "No valid consent or emergency access found";
        }
        return null;
    }
}
