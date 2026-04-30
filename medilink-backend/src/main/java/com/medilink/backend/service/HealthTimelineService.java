package com.medilink.backend.service;

import com.medilink.backend.dto.HealthTimelineDTO;
import com.medilink.backend.dto.HealthTimelineDTO.TimelineEventDTO;
import com.medilink.backend.exception.UnauthorizedException;
import com.medilink.backend.repository.AllergyIntoleranceRepository;
import com.medilink.backend.repository.ConditionRepository;
import com.medilink.backend.repository.EncounterRepository;
import com.medilink.backend.repository.MedicationStatementRepository;
import com.medilink.backend.repository.ObservationRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HealthTimelineService {

    private final EncounterRepository encounterRepository;
    private final ObservationRepository observationRepository;
    private final MedicationStatementRepository medicationStatementRepository;
    private final ConditionRepository conditionRepository;
    private final AllergyIntoleranceRepository allergyIntoleranceRepository;
    private final AccessControlService accessControlService;

    public HealthTimelineDTO getPatientTimeline(UUID patientId, UUID doctorId, String role) {
        if ("DOCTOR".equals(role)) {
            if (doctorId == null || !accessControlService.isDoctorAssignedToPatient(doctorId, patientId)) {
                throw new UnauthorizedException("Doctor has no active consent/emergency access to this patient");
            }
        }

        List<TimelineEventDTO> events = new ArrayList<>();

        encounterRepository.findByPatientIdOrderByStartTimeDesc(patientId).forEach(encounter -> events.add(
                TimelineEventDTO.builder()
                        .type("ENCOUNTER")
                        .title(encounter.getType().name() + " visit")
                        .details(encounter.getChiefComplaint())
                        .occurredAt(encounter.getStartTime())
                        .build()
        ));

        observationRepository.findByPatientIdOrderByEffectiveDateDesc(patientId).forEach(observation -> events.add(
                TimelineEventDTO.builder()
                        .type("OBSERVATION")
                        .title(observation.getDisplayName())
                        .details(observation.getValue() + (observation.getUnit() == null ? "" : " " + observation.getUnit()))
                        .occurredAt(observation.getEffectiveDate())
                        .build()
        ));

        medicationStatementRepository.findByPatientIdOrderByStartDateDesc(patientId).forEach(med -> events.add(
                TimelineEventDTO.builder()
                        .type("MEDICATION")
                        .title(med.getMedicationName())
                        .details(med.getDosage() == null ? med.getStatus().name() : med.getDosage() + " | " + med.getStatus().name())
                        .occurredAt(med.getStartDate().atStartOfDay())
                        .build()
        ));

        conditionRepository.findByPatientIdOrderByOnsetDateDesc(patientId).forEach(condition -> events.add(
                TimelineEventDTO.builder()
                        .type("CONDITION")
                        .title(condition.getDisplayName())
                        .details(condition.getStatus().name())
                        .occurredAt(condition.getOnsetDate().atStartOfDay())
                        .build()
        ));

        allergyIntoleranceRepository.findByPatientIdOrderByCreatedAtDesc(patientId).forEach(allergy -> events.add(
                TimelineEventDTO.builder()
                        .type("ALLERGY")
                        .title(allergy.getSubstance())
                        .details(allergy.getSeverity().name())
                        .occurredAt(allergy.getCreatedAt())
                        .build()
        ));

        events.sort(Comparator.comparing(
                event -> event.getOccurredAt() == null ? LocalDateTime.MIN : event.getOccurredAt(),
                Comparator.reverseOrder()
        ));

        return HealthTimelineDTO.builder()
                .patientId(patientId)
                .events(events)
                .build();
    }
}
