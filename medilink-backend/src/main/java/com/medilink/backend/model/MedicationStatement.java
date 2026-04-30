package com.medilink.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * FHIR R4 MedicationStatement - current and historical medication tracking.
 */
@Entity
@Table(
        name = "medication_statements",
        indexes = {
            @Index(name = "idx_medication_patient", columnList = "patient_id"),
            @Index(name = "idx_medication_encounter", columnList = "encounter_id"),
            @Index(name = "idx_medication_status", columnList = "status")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicationStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prescribed_by", updatable = false)
    private Doctor prescribedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encounter_id", updatable = false)
    private Encounter encounter;

    @Column(name = "medication_name", nullable = false, length = 200)
    private String medicationName;

    @Column(name = "dosage", length = 100)
    private String dosage;

    @Column(name = "frequency", length = 100)
    private String frequency;

    @Enumerated(EnumType.STRING)
    @Column(name = "route", length = 20)
    private MedicationRoute route;  // ORAL, IV, TOPICAL, INHALED

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private MedStatus status = MedStatus.ACTIVE;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum MedicationRoute {
        ORAL,
        IV,
        IM,
        SC,
        TOPICAL,
        INHALED,
        SUBLINGUAL,
        RECTAL,
        OTHER
    }

    public enum MedStatus {
        ACTIVE,
        COMPLETED,
        STOPPED,
        ON_HOLD,
        INTENDED,
        NOT_STARTED
    }
}
