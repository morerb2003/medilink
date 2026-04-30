package com.medilink.backend.controller;

import com.medilink.backend.dto.EmergencyAccessRequest;
import com.medilink.backend.dto.EmergencySnapshotDTO;
import com.medilink.backend.dto.OtpVerificationRequest;
import com.medilink.backend.service.EmergencyAccessService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/emergency")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class EmergencyController {

    private final EmergencyAccessService emergencyAccessService;

    /**
     * Initiate emergency access with OTP verification.
     */
    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiateEmergencyAccess(
            @RequestBody EmergencyAccessRequest request
    ) {
        if (request.getHealthIdOrQrToken() == null || request.getHealthIdOrQrToken().isBlank()) {
            throw new IllegalArgumentException("Health ID or QR token is required");
        }
        UUID sessionId = emergencyAccessService.initiateEmergencyAccess(
                request.getHealthIdOrQrToken(),
                request.getDoctorId(),
                request.getReason(),
                request.getIpAddress(),
                request.getGeoLocation(),
                request.getDeviceFingerprint()
        );
        return ResponseEntity.ok(Map.of(
                "sessionId", sessionId,
                "message", "OTP sent to patient and emergency contact"
        ));
    }

    /**
     * Verify OTP and get patient snapshot.
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<EmergencySnapshotDTO> verifyOtp(
            @RequestBody OtpVerificationRequest request
    ) {
        EmergencySnapshotDTO snapshot = emergencyAccessService.verifyOtp(
                request.getSessionId(),
                request.getOtp(),
                request.getDoctorId()
        );
        return ResponseEntity.ok(snapshot);
    }

    /**
     * Get snapshot for active session (no OTP needed).
     */
    @GetMapping("/{sessionId}/snapshot")
    public ResponseEntity<EmergencySnapshotDTO> getSnapshot(
            @PathVariable UUID sessionId,
            @RequestParam UUID doctorId
    ) {
        EmergencySnapshotDTO snapshot = emergencyAccessService.getSnapshotForActiveSession(
                sessionId, doctorId
        );
        return ResponseEntity.ok(snapshot);
    }

    /**
     * Get remaining time for session.
     */
    @GetMapping("/{sessionId}/time")
    public ResponseEntity<Map<String, Long>> getSessionTime(@PathVariable UUID sessionId) {
        long remaining = emergencyAccessService.getSessionRemainingTime(sessionId);
        return ResponseEntity.ok(Map.of("secondsLeft", remaining));
    }

    /**
     * Revoke emergency session.
     */
    @PostMapping("/{sessionId}/revoke")
    public ResponseEntity<Map<String, String>> revokeSession(
            @PathVariable UUID sessionId,
            @RequestParam UUID requestedBy
    ) {
        emergencyAccessService.revokeSession(sessionId, requestedBy);
        return ResponseEntity.ok(Map.of("message", "Session revoked"));
    }

    // Legacy endpoints for backward compatibility
    @PostMapping("/health-id/{healthId}")
    public ResponseEntity<EmergencySnapshotDTO> accessByHealthId(
            @PathVariable String healthId,
            @RequestParam UUID doctorId,
            @RequestParam(defaultValue = "0.0.0.0") String ipAddress,
            @RequestParam(required = false) String reason
    ) {
        return ResponseEntity.ok(emergencyAccessService.accessByHealthId(healthId, doctorId, ipAddress, reason));
    }

    @PostMapping("/qr")
    public ResponseEntity<EmergencySnapshotDTO> accessByQr(
            @RequestParam UUID doctorId,
            @RequestParam(defaultValue = "0.0.0.0") String ipAddress,
            @RequestParam(required = false) String reason,
            @RequestBody Map<String, String> payload
    ) {
        String token = payload != null ? payload.get("token") : null;
        String payloadReason = payload != null ? payload.get("reason") : null;
        String finalReason = reason != null ? reason : payloadReason;
        
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Access token is required");
        }
        return ResponseEntity.ok(
                emergencyAccessService.accessByQr(token, doctorId, ipAddress, finalReason)
        );
    }
}
