package com.medilink.backend.model;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "patients",
        indexes = {
                @Index(name = "idx_health_id", columnList = "health_id", unique = true),
                @Index(name = "idx_abha_id", columnList = "abha_id", unique = true)
        }
)
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class Patient extends User {

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "dob")
    private LocalDate dob;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "health_id", nullable = false, unique = true, length = 20)
    private String healthId;

    @Column(name = "abha_id", unique = true, length = 20)
    private String abhaId;

    @Column(name = "qr_code", length = 512)
    private String qrCode;

    @Column(name = "blood_group", length = 5)
    private String bloodGroup;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "patient_allergies",
            joinColumns = @JoinColumn(name = "patient_id")
    )
    @Column(name = "allergy", length = 200)
    @Builder.Default
    private List<String> allergies = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "patient_medications",
            joinColumns = @JoinColumn(name = "patient_id")
    )
    @Column(name = "medication", length = 300)
    @Builder.Default
    private List<String> currentMedications = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "patient_chronic_conditions",
            joinColumns = @JoinColumn(name = "patient_id")
    )
    @Column(name = "condition", length = 200)
    @Builder.Default
    private List<String> chronicConditions = new ArrayList<>();

    @Embedded
    private EmergencyContact emergencyContact;

    @Embedded
    private SocialLinks socialLinks;

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmergencyContact {
        @Column(name = "emergency_contact_name", length = 255)
        private String name;

        @Column(name = "emergency_contact_phone", length = 20)
        private String phone;

        @Column(name = "emergency_contact_relation", length = 50)
        private String relation;
    }

    @Embeddable
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SocialLinks {
        @Column(name = "instagram_url", length = 512)
        private String instagram;

        @Column(name = "facebook_url", length = 512)
        private String facebook;

        @Column(name = "linkedin_url", length = 512)
        private String linkedin;
    }
}
