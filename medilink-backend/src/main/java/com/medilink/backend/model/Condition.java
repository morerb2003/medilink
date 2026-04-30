package com.medilink.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * FHIR R4 Condition - disease history / chronic condition tracking.
 */
@Entity
@Table(
        name = "conditions",
        indexes = {
            @Index(name = "idx_condition_patient", columnList = "patient_id"),
            @Index(name = "idx_condition_encounter", columnList = "encounter_id"),
            @Index(name = "idx_condition_status", columnList = "status"),
            @Index(name = "idx_condition_icd", columnList = "icd_code")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Condition {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "diagnosed_by", updatable = false)
    private Doctor diagnosedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", updatable = false)
    private Encounter encounter;

    @Column(name = "icd_code", length = 20)
    private String icdCode;  // ICD-10 code

    @Column(name = "display_name", nullable = false, length = 200)
    private String displayName;  // "Type 2 Diabetes Mellitus"

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ConditionStatus status = ConditionStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", length = 20)
    private ConditionSeverity severity;

    @Column(name = "onset_date", nullable = false)
    private LocalDate onsetDate;

    @Column(name = "resolved_date")
    private LocalDate resolvedDate;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ConditionStatus {
        ACTIVE,
        RESOLVED,
        REMISSION,
        RECURRENCE,
        INACTIVE
    }

    public enum ConditionSeverity {
        MILD,
        MODERATE,
        SEVERE
    }
}
