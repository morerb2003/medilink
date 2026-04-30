package com.medilink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import jakarta.persistence.EntityListeners;

@Entity
@Table(name = "emergency_logs", indexes = {
    @Index(name = "idx_emergency_patient", columnList = "patient_id"),
    @Index(name = "idx_emergency_doctor", columnList = "doctor_id"),
    @Index(name = "idx_emergency_time", columnList = "accessed_at DESC"),
    @Index(name = "idx_emergency_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @CreatedDate
    @Column(name = "accessed_at", nullable = false, updatable = false)
    private LocalDateTime accessedAt;

    @Column(name = "reason", length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "access_method", length = 20)
    private AccessMethod accessMethod;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "flagged", nullable = false)
    @Builder.Default
    private boolean flagged = false;

    // ── Enhanced fields for OTP flow ───────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    @Builder.Default
    private EmergencyStatus status = EmergencyStatus.ACTIVE;

    @Column(name = "otp_hash", length = 255)
    private String otpHash;  // BCrypt hash of OTP (cleared after use)

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt;  // 5 min from generation

    @Column(name = "access_granted_at")
    private LocalDateTime accessGrantedAt;

    @Column(name = "geo_location", length = 100)
    private String geoLocation;  // "lat,lon" from client-sent coords

    @Column(name = "device_fingerprint", length = 255)
    private String deviceFingerprint;  // User-Agent + screen + platform hash

    @Column(name = "country_code", length = 5)
    private String countryCode;

    public enum AccessMethod {
        HEALTH_ID,
        QR_SCAN,
        MANUAL_OVERRIDE  // Admin-approved bypass in extreme cases
    }

    public enum EmergencyStatus {
        OTP_PENDING,
        ACTIVE,
        EXPIRED,
        REVOKED
    }
}
