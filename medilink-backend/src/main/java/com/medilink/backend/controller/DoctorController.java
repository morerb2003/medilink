package com.medilink.backend.controller;

import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.EmergencyLog;
import com.medilink.backend.service.DoctorService;
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
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/{doctorId}")
    public ResponseEntity<Doctor> getProfile(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(doctorService.getProfile(doctorId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> search(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(doctorService.search(query));
    }

    @GetMapping("/{doctorId}/history")
    public ResponseEntity<List<EmergencyLog>> accessHistory(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(doctorService.accessHistory(doctorId));
    }
}
