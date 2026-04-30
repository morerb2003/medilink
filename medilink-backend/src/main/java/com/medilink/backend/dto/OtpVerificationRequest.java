package com.medilink.backend.dto;

import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OtpVerificationRequest {

    private UUID sessionId;
    private String otp;
    private UUID doctorId;
}
