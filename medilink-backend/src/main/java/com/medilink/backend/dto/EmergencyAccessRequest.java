package com.medilink.backend.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmergencyAccessRequest {

    private String healthIdOrQrToken;
    private UUID doctorId;
    private String reason;
    private String ipAddress;
    private String geoLocation;
    private String deviceFingerprint;
}
