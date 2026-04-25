package com.medilink.backend.controller;

import com.medilink.backend.dto.EmergencySnapshotDTO;
import com.medilink.backend.service.EmergencyAccessService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class EmergencyController {

    private final EmergencyAccessService emergencyAccessService;

    @PostMapping("/health-id/{healthId}")
    public ResponseEntity<EmergencySnapshotDTO> accessByHealthId(
            @PathVariable String healthId,
            @RequestParam UUID doctorId,
            @RequestParam(defaultValue = "0.0.0.0") String ipAddress
    ) {
        return ResponseEntity.ok(emergencyAccessService.accessByHealthId(healthId, doctorId, ipAddress));
    }

    @PostMapping("/qr")
    public ResponseEntity<EmergencySnapshotDTO> accessByQr(
            @RequestParam UUID doctorId,
            @RequestParam(defaultValue = "0.0.0.0") String ipAddress,
            @RequestBody Map<String, String> payload
    ) {
        return ResponseEntity.ok(
                emergencyAccessService.accessByQr(payload.get("token"), doctorId, ipAddress)
        );
    }
}
