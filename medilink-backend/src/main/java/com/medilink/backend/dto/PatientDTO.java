package com.medilink.backend.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {

    private UUID id;
    private String fullName;
    private String email;
    private LocalDate dob;
    private String phone;
    private String healthId;
    private String occupation;
    private String languagePreference;
    private String nationality;
    private String address;

    private String bloodGroup;
    private List<String> allergies;
    private List<String> currentMedications;
    private List<String> chronicConditions;

    private EmergencyContactDTO emergencyContact;
    private SocialLinksDTO socialLinks;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EmergencyContactDTO {
        private String name;
        private String phone;
        private String relation;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SocialLinksDTO {
        private String instagram;
        private String facebook;
        private String linkedin;
    }
}

