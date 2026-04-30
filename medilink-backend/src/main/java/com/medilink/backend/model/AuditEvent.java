package com.medilink.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Immutable;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * AuditEvent entity for comprehensive audit logging. Tracks every data access
 * and action in the system.
 */
@Entity
@Immutable
@Table(
        name = "audit_events",
        indexes = {
            @Index(name = "idx_audit_actor", columnList = "actor_id"),
            @Index(name = "idx_audit_action", columnList = "action"),
            @Index(name = "idx_audit_resource", columnList = "resource_type, resource_id"),
            @Index(name = "idx_audit_occurred", columnList = "occurred_at DESC")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "actor_id")
    private UUID actorId;

    @Column(name = "actor_role", length = 20)
    private String actorRole;  // PATIENT, DOCTOR, ADMIN

    @Column(name = "action", nullable = false, length = 50)
    private String action;  // READ_RECORD, UPDATE_CONSENT, EMERGENCY_ACCESS, LOGIN

    @Column(name = "resource_type", length = 50)
    private String resourceType;  // Patient, MedicalRecord, Consent

    @Column(name = "resource_id")
    private UUID resourceId;

    @Column(name = "outcome", nullable = false, length = 20)
    private String outcome;  // SUCCESS, DENIED, ERROR

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;  // JSONB stored as TEXT

    @CreatedDate
    @Column(name = "occurred_at", nullable = false, updatable = false)
    private LocalDateTime occurredAt;
}
