package com.medilink.backend.controller;

import com.medilink.backend.dto.AdminStatsDTO;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.Organization;
import com.medilink.backend.service.AdminService;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsDTO> getStats() {
        return ResponseEntity.ok(adminService.getGlobalStats());
    }

    @GetMapping("/pending-doctors")
    public ResponseEntity<List<Doctor>> getPendingDoctors() {
        return ResponseEntity.ok(adminService.getPendingDoctors());
    }

    @PostMapping("/verify-doctor/{doctorId}")
    public ResponseEntity<Map<String, String>> verifyDoctor(
            @PathVariable UUID doctorId,
            @RequestParam String verifiedBy
    ) {
        adminService.verifyDoctor(doctorId, verifiedBy);
        return ResponseEntity.ok(Map.of("message", "Doctor verified successfully"));
    }

    @GetMapping("/organizations")
    public ResponseEntity<List<Organization>> getOrganizations() {
        return ResponseEntity.ok(adminService.getAllOrganizations());
    }

    @PostMapping("/organizations")
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization organization) {
        return ResponseEntity.ok(adminService.createOrganization(organization));
    }
}
