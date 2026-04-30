package com.medilink.backend.controller;

import com.medilink.backend.dto.HealthTimelineDTO;
import com.medilink.backend.service.HealthTimelineService;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class HealthTimelineController {

    private final HealthTimelineService healthTimelineService;

    @GetMapping("/{patientId}/timeline")
    @PreAuthorize("hasAnyRole('PATIENT','DOCTOR','ADMIN')")
    public ResponseEntity<HealthTimelineDTO> getTimeline(
            @PathVariable UUID patientId,
            @RequestParam(required = false) UUID doctorId,
            Authentication authentication
    ) {
        HealthTimelineDTO timeline = healthTimelineService.getPatientTimeline(
                patientId, doctorId, authentication.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")
        );
        return ResponseEntity.ok(timeline);
    }
}
