package com.medilink.backend.controller;

import com.medilink.backend.model.Consent;
import com.medilink.backend.service.ConsentService;
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
@RequestMapping("/api/consent")
@RequiredArgsConstructor
public class ConsentController {

    private final ConsentService consentService;

    @GetMapping("/check")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
    public ResponseEntity<Map<String, Boolean>> hasConsent(
            @RequestParam UUID patientId,
            @RequestParam UUID doctorId
    ) {
        return ResponseEntity.ok(Map.of("valid", consentService.hasValidConsent(patientId, doctorId)));
    }

    @PostMapping("/request")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<Consent> requestConsent(@RequestBody Map<String, String> request) {
        UUID patientId = UUID.fromString(request.get("patientId"));
        UUID doctorId = UUID.fromString(request.get("doctorId"));
        String reason = request.getOrDefault("reason", "Consultation");
        return ResponseEntity.ok(consentService.requestConsent(patientId, doctorId, reason));
    }

    @PostMapping("/{consentId}/approve")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Consent> approveConsent(@PathVariable UUID consentId) {
        return ResponseEntity.ok(consentService.approveConsent(consentId));
    }

    @PostMapping("/{consentId}/reject")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Consent> rejectConsent(@PathVariable UUID consentId) {
        return ResponseEntity.ok(consentService.rejectConsent(consentId));
    }

    @PostMapping("/{consentId}/revoke")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Consent> revokeConsent(@PathVariable UUID consentId) {
        return ResponseEntity.ok(consentService.revokeConsent(consentId));
    }
}
