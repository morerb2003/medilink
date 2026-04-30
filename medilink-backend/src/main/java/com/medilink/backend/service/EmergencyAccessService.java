package com.medilink.backend.service;

import com.medilink.backend.dto.EmergencySnapshotDTO;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.EmergencyLog;
import com.medilink.backend.model.EmergencyLog.EmergencyStatus;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.EmergencyLogRepository;
import com.medilink.backend.repository.PatientRepository;
import com.medilink.backend.security.QRTokenService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Emergency Access Service with OTP flow. Implements: QR/HealthID → OTP →
 * Time-limited session → Auto-revoke
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyAccessService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final EmergencyLogRepository emergencyLogRepository;
    private final QRTokenService qrTokenService;
    private final OtpService otpService;
    private final NotificationService notificationService;

    private static final int OTP_VALIDITY_MINUTES = 5;
    private static final int SESSION_VALIDITY_MINUTES = 30;

    /**
     * Initiate emergency access - validates QR/HealthID and sends OTP.
     */
    @Transactional
    public UUID initiateEmergencyAccess(String healthIdOrQrToken, UUID doctorId,
            String reason, String ipAddress, String geoLocation,
            String deviceFingerprint) {
        // Validate doctor
        Doctor doctor = loadVerifiedDoctor(doctorId);

        // Get patient from QR or Health ID
        Patient patient = getPatientFromToken(healthIdOrQrToken);

        // Create emergency log with OTP_PENDING status
        EmergencyLog emergencyLog = EmergencyLog.builder()
                .doctor(doctor)
                .patient(patient)
                .reason(reason != null ? reason : "Emergency access initiated")
                .accessMethod(EmergencyLog.AccessMethod.QR_SCAN)
                .status(EmergencyStatus.OTP_PENDING)
                .geoLocation(geoLocation)
                .deviceFingerprint(deviceFingerprint)
                .ipAddress(ipAddress)
                .accessedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES))
                .build();

        emergencyLog = emergencyLogRepository.save(emergencyLog);

        // Generate OTP
        String otp = otpService.generateOtp();

        // Store OTP in Redis (hashed)
        otpService.storeOtp(emergencyLog.getId(), otp);

        // Update emergency log with OTP expiry
        emergencyLog.setOtpExpiresAt(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        emergencyLogRepository.save(emergencyLog);

        // Send OTP to patient and emergency contact
        sendOtpToPatient(patient, otp);

        log.info("Emergency access initiated for patient {} by doctor {}, OTP sent",
                patient.getHealthId(), doctorId);

        return emergencyLog.getId();
    }

    /**
     * Verify OTP and grant access.
     */
    @Transactional
    public EmergencySnapshotDTO verifyOtp(UUID sessionId, String otp, UUID doctorId) {
        EmergencyLog emergencyLog = emergencyLogRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency session not found"));

        // Verify doctor matches
        if (!emergencyLog.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Doctor does not match session");
        }

        // Check if session is already active
        if (emergencyLog.getStatus() == EmergencyStatus.ACTIVE) {
            return mapToSnapshot(emergencyLog.getPatient());
        }

        // Validate OTP
        if (!otpService.validateOtp(sessionId, otp)) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        // Grant access - update status
        emergencyLog.setStatus(EmergencyStatus.ACTIVE);
        emergencyLog.setAccessGrantedAt(LocalDateTime.now());
        emergencyLog.setExpiresAt(LocalDateTime.now().plusMinutes(SESSION_VALIDITY_MINUTES));
        emergencyLogRepository.save(emergencyLog);

        // Store emergency session in Redis
        otpService.storeEmergencySession(sessionId,
                emergencyLog.getPatient().getId(), doctorId);

        // Notify patient and family of emergency access
        notificationService.sendEmergencyAccessNotification(
                emergencyLog.getPatient(), doctorId);

        log.info("OTP verified, emergency access granted for session {}", sessionId);

        return mapToSnapshot(emergencyLog.getPatient());
    }

    /**
     * Get snapshot without OTP (for active sessions only).
     */
    @Transactional(readOnly = true)
    public EmergencySnapshotDTO getSnapshotForActiveSession(UUID sessionId, UUID doctorId) {
        EmergencyLog emergencyLog = emergencyLogRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency session not found"));

        // Verify doctor matches
        if (!emergencyLog.getDoctor().getId().equals(doctorId)) {
            throw new IllegalArgumentException("Doctor does not match session");
        }

        // Check if session is active
        if (emergencyLog.getStatus() != EmergencyStatus.ACTIVE) {
            throw new IllegalStateException("Emergency session is not active");
        }

        // Check if session is expired
        if (emergencyLog.getExpiresAt() != null
                && emergencyLog.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Emergency session has expired");
        }

        return mapToSnapshot(emergencyLog.getPatient());
    }

    /**
     * Revoke emergency session manually.
     */
    @Transactional
    public void revokeSession(UUID sessionId, UUID requestedBy) {
        EmergencyLog emergencyLog = emergencyLogRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Emergency session not found"));

        emergencyLog.setStatus(EmergencyStatus.REVOKED);
        emergencyLogRepository.save(emergencyLog);

        // Remove from Redis
        otpService.revokeEmergencySession(sessionId);

        log.info("Emergency session {} revoked by {}", sessionId, requestedBy);
    }

    /**
     * Get remaining time for session in seconds.
     */
    public long getSessionRemainingTime(UUID sessionId) {
        return otpService.getSessionRemainingSeconds(sessionId);
    }

    /**
     * Scheduled task to revoke expired sessions.
     */
    @Scheduled(fixedDelay = 60000)  // Every minute
    @Transactional
    public void revokeExpiredSessions() {
        LocalDateTime now = LocalDateTime.now();
        emergencyLogRepository.findActiveSessions(now).forEach(sessionLog -> {
            if (sessionLog.getExpiresAt() != null && sessionLog.getExpiresAt().isBefore(now)) {
                sessionLog.setStatus(EmergencyStatus.EXPIRED);
                emergencyLogRepository.save(sessionLog);

                // Remove from Redis
                otpService.revokeEmergencySession(sessionLog.getId());

                log.info("Auto-revoked expired emergency session {}", sessionLog.getId());
            }
        });
    }

    // Legacy methods for backward compatibility
    @Transactional
    public EmergencySnapshotDTO accessByHealthId(String healthId, UUID doctorId, String ipAddress, String reason) {
        Doctor doctor = loadVerifiedDoctor(doctorId);
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        writeEmergencyLog(doctor, patient, EmergencyLog.AccessMethod.HEALTH_ID, ipAddress, reason);
        return mapToSnapshot(patient);
    }

    @Transactional
    public EmergencySnapshotDTO accessByQr(String qrToken, UUID doctorId, String ipAddress, String reason) {
        Claims claims = qrTokenService.verifyQr(qrToken);
        String healthId = claims.get("healthId", String.class);
        Doctor doctor = loadVerifiedDoctor(doctorId);
        Patient patient = patientRepository.findByHealthId(healthId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        writeEmergencyLog(doctor, patient, EmergencyLog.AccessMethod.QR_SCAN, ipAddress, reason);
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

    private Patient getPatientFromToken(String token) {
        // Try to parse as QR token first
        try {
            Claims claims = qrTokenService.verifyQr(token);
            String healthId = claims.get("healthId", String.class);
            return patientRepository.findByHealthId(healthId)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        } catch (Exception e) {
            // Not a QR token, try as Health ID
            return patientRepository.findByHealthId(token)
                    .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        }
    }

    private void writeEmergencyLog(
            Doctor doctor,
            Patient patient,
            EmergencyLog.AccessMethod accessMethod,
            String ipAddress,
            String reason
    ) {
        EmergencyLog log = EmergencyLog.builder()
                .doctor(doctor)
                .patient(patient)
                .reason(reason != null ? reason : "Emergency access")
                .accessMethod(accessMethod)
                .status(EmergencyStatus.ACTIVE)
                .accessedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(30))
                .ipAddress(ipAddress)
                .build();
        emergencyLogRepository.save(log);
    }

    private void sendOtpToPatient(Patient patient, String otp) {
        // Send to patient's phone
        if (patient.getPhone() != null) {
            notificationService.sendOtpSms(patient.getPhone(), otp);
        }

        // Send to emergency contact
        if (patient.getEmergencyContact() != null
                && patient.getEmergencyContact().getPhone() != null) {
            notificationService.sendOtpSms(patient.getEmergencyContact().getPhone(), otp);
        }
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
