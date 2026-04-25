package com.medilink.backend.controller;

import com.medilink.backend.dto.RecordDTO;
import com.medilink.backend.service.RecordService;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
    public ResponseEntity<List<RecordDTO>> getPatientRecords(
            @PathVariable UUID patientId,
            @RequestParam UUID doctorId
    ) {
        return ResponseEntity.ok(recordService.getPatientRecords(patientId, doctorId));
    }

    @GetMapping("/self/{patientId}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<RecordDTO>> getPatientOwnedRecords(@PathVariable UUID patientId) {
        return ResponseEntity.ok(recordService.getPatientOwnedRecords(patientId));
    }
}
