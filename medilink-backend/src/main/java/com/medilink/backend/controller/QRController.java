package com.medilink.backend.controller;

import com.medilink.backend.service.QRCodeService;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/v1/patients/qr", "/api/patients/qr"})
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class QRController {

    private final QRCodeService qrCodeService;

    @GetMapping("/{patientId}")
    public ResponseEntity<Map<String, String>> generatePatientQr(@PathVariable UUID patientId) {
        String token = qrCodeService.generateSignedQr(patientId);
        String image = qrCodeService.generateQrDataUri(token);
        return ResponseEntity.ok(Map.of(
                "qrToken", token,
                "qrImage", image
        ));
    }
}
