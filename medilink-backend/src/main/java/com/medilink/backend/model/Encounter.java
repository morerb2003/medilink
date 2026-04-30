package com.medilink.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * FHIR R4 Encounter - represents a clinical visit session. This is the anchor
 * entity for all clinical data (observations, medications, conditions).
 */
@Entity
@Table(
        name = "encounters",
        indexes = {
            @Index(name = "idx_encounter_patient", columnList = "patient_id"),
            @Index(name = "idx_encounter_doctor", columnList = "doctor_id"),
            @Index(name = "idx_encounter_dates", columnList = "start_time DESC")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Encounter {

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

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "encounter_type", nullable = false, length = 20)
    private EncounterType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private EncounterStatus status = EncounterStatus.PLANNED;

    @Column(name = "chief_complaint", length = 500)
    private String chiefComplaint;

    @Column(name = "hospital_name", length = 200)
    private String hospitalName;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum EncounterType {
        OUTPATIENT,
        INPATIENT,
        EMERGENCY,
        TELEHEALTH
    }

    public enum EncounterStatus {
        PLANNED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
