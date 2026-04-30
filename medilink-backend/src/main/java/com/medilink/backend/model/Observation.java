package com.medilink.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * FHIR R4 Observation - represents labs, vitals, clinical findings. "What was
 * measured" entity.
 */
@Entity
@Table(
        name = "observations",
        indexes = {
            @Index(name = "idx_observation_patient", columnList = "patient_id"),
            @Index(name = "idx_observation_encounter", columnList = "encounter_id"),
            @Index(name = "idx_observation_code", columnList = "code"),
            @Index(name = "idx_observation_effective", columnList = "effective_date DESC")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Observation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "doctor_id", nullable = false, updatable = false)
    private Doctor doctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", updatable = false)
    private Encounter encounter;

    @Column(name = "code", nullable = false, length = 20)
    private String code;  // LOINC code (e.g., "8480-6" = Systolic BP)

    @Column(name = "display_name", nullable = false, length = 200)
    private String displayName;  // "Blood Pressure - Systolic"

    @Column(name = "value", nullable = false, length = 100)
    private String value;

    @Column(name = "unit", length = 50)
    private String unit;  // "mmHg", "mg/dL"

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false, length = 30)
    private ObservationCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private ObservationStatus status = ObservationStatus.REGISTERED;

    @Column(name = "effective_date", nullable = false)
    private LocalDateTime effectiveDate;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum ObservationCategory {
        VITAL_SIGNS,
        LABORATORY,
        IMAGING,
        SOCIAL_HISTORY,
        CLINICAL_FINDING
    }

    public enum ObservationStatus {
        REGISTERED,
        PRELIMINARY,
        FINAL,
        AMENDED,
        CORRECTED,
        CANCELLED
    }
}
