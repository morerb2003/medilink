package com.medilink.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDTO {

    private long totalUsers;
    private long totalDoctors;
    private long totalPatients;
    private long totalOrganizations;

    private long pendingDoctorVerifications;
    private long totalRecords;
    private long totalEmergencyAccess;

    private long storageUsedBytes;
}
