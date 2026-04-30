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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/records")
@RequiredArgsConstructor
public class RecordController {

    private final RecordService recordService;

    @PostMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<RecordDTO> uploadRecord(
            @RequestParam UUID patientId,
            @RequestParam String title,
            @RequestParam String recordType,
            @RequestParam(required = false) String hospitalName,
            @RequestParam(required = false) String recordDate,
            @RequestParam(required = false) String notes,
            @RequestParam MultipartFile file
    ) {
        return ResponseEntity.ok(recordService.uploadRecord(
                patientId,
                title,
                recordType,
                hospitalName,
                recordDate,
                notes,
                file
        ));
    }

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
