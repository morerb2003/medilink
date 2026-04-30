package com.medilink.backend.controller;

import com.medilink.backend.dto.PatientDTO;
import com.medilink.backend.dto.PatientLookupDTO;
import com.medilink.backend.service.PatientService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;

    @GetMapping("/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    public ResponseEntity<PatientDTO> getProfile(@PathVariable UUID patientId) {
        return ResponseEntity.ok(patientService.getProfile(patientId));
    }

    @PutMapping("/{patientId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PatientDTO> updateProfile(
            @PathVariable UUID patientId,
            @RequestBody PatientDTO request
    ) {
        return ResponseEntity.ok(patientService.updateProfile(patientId, request));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<List<PatientLookupDTO>> searchPatients(@RequestParam String query) {
        return ResponseEntity.ok(patientService.searchByNameOrHealthId(query));
    }
}
