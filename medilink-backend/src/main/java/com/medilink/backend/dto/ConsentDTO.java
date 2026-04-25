package com.medilink.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsentDTO {

    private UUID id;

    private UUID patientId;
    private UUID doctorId;

    private String doctorName;
    private String status; // PENDING / APPROVED / REJECTED

    private String reason;

    private LocalDateTime requestedAt;
    private LocalDateTime respondedAt;
    private LocalDateTime expiresAt;
}
