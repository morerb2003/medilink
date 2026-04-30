package com.medilink.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HealthTimelineDTO {

    private UUID patientId;
    private List<TimelineEventDTO> events;

    @Getter
    @Builder
    public static class TimelineEventDTO {

        private String type;
        private String title;
        private String details;
        private LocalDateTime occurredAt;
    }
}
