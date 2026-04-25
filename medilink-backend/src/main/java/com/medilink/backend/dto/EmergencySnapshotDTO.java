package com.medilink.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmergencySnapshotDTO {

    private String fullName;
    private String bloodGroup;

    private List<String> allergies;
    private List<String> currentMedications;
    private List<String> chronicConditions;

    private EmergencyContactDTO emergencyContact;

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
}

