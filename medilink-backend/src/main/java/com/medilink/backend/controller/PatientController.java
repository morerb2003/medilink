package com.medilink.backend.controller;

import com.medilink.backend.dto.PatientDTO;
import com.medilink.backend.service.PatientService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDTO> getProfile(@PathVariable UUID patientId) {
        return ResponseEntity.ok(patientService.getProfile(patientId));
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<PatientDTO> updateProfile(
            @PathVariable UUID patientId,
            @RequestBody PatientDTO request
    ) {
        return ResponseEntity.ok(patientService.updateProfile(patientId, request));
    }
}
