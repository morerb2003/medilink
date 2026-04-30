package com.medilink.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EmergencyLogDTO {

    private UUID id;
    private UUID doctorId;
    private UUID patientId;
    private String accessMethod;
    private String status;
    private LocalDateTime accessedAt;
    private LocalDateTime expiresAt;
    private String ipAddress;
    private String geoLocation;
    private String deviceFingerprint;
}
