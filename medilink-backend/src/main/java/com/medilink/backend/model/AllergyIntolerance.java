package com.medilink.backend.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * FHIR R4 AllergyIntolerance - structured allergy tracking. Replaces simple
 * String lists in Patient entity.
 */
@Entity
@Table(
        name = "allergy_intolerances",
        indexes = {
            @Index(name = "idx_allergy_patient", columnList = "patient_id"),
            @Index(name = "idx_allergy_active", columnList = "active")
        }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AllergyIntolerance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    private Patient patient;

    @Column(name = "substance", nullable = false, length = 200)
    private String substance;  // "Penicillin", "Peanuts"

    @Enumerated(EnumType.STRING)
    @Column(name = "allergy_type", nullable = false, length = 20)
    private AllergyType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity", nullable = false, length = 20)
    private AllergySeverity severity;

    @Column(name = "reaction", length = 200)
    private String reaction;  // "Hives", "Anaphylaxis"

    @Column(name = "onset_date")
    private LocalDate onsetDate;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public enum AllergyType {
        ALLERGY,
        INTOLERANCE,
        UNKNOWN
    }

    public enum AllergySeverity {
        MILD,
        MODERATE,
        SEVERE,
        LIFE_THREATENING
    }
}
