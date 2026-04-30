package com.medilink.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medilink.backend.model.AuditEvent;
import com.medilink.backend.repository.AuditEventRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

/**
 * Audit Service for comprehensive audit logging. Uses @Async to ensure
 * non-blocking audit logging.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditEventRepository auditEventRepository;
    private final ObjectMapper objectMapper;

    /**
     * Log an audit event asynchronously. This method should never block the
     * main request flow.
     *
     * @param actorId The ID of the user performing the action
     * @param actorRole The role of the user (PATIENT, DOCTOR, ADMIN)
     * @param action The action being performed
     * @param resourceType The type of resource being accessed
     * @param resourceId The ID of the resource
     * @param outcome The outcome (SUCCESS, DENIED, ERROR)
     * @param request The HTTP request for IP and user agent
     */
    @Async
    public void log(UUID actorId, String actorRole, String action,
            String resourceType, UUID resourceId, String outcome,
            HttpServletRequest request) {
        try {
            AuditEvent event = AuditEvent.builder()
                    .actorId(actorId)
                    .actorRole(actorRole)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .outcome(outcome)
                    .ipAddress(getClientIp(request))
                    .userAgent(getUserAgent(request))
                    .occurredAt(LocalDateTime.now())
                    .build();

            auditEventRepository.save(event);
            log.debug("Audit event logged: actor={}, action={}, resource={}, outcome={}",
                    actorId, action, resourceType, outcome);
        } catch (Exception e) {
            // Never throw - audit failure should not affect main flow
            log.error("Failed to log audit event: {}", e.getMessage());
        }
    }

    /**
     * Log an audit event with additional metadata.
     */
    @Async
    public void logWithMetadata(UUID actorId, String actorRole, String action,
            String resourceType, UUID resourceId, String outcome,
            HttpServletRequest request, Map<String, String> metadata) {
        try {
            String metadataJson = null;
            if (metadata != null && !metadata.isEmpty()) {
                metadataJson = objectMapper.writeValueAsString(metadata);
            }

            AuditEvent event = AuditEvent.builder()
                    .actorId(actorId)
                    .actorRole(actorRole)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .outcome(outcome)
                    .ipAddress(getClientIp(request))
                    .userAgent(getUserAgent(request))
                    .metadata(metadataJson)
                    .occurredAt(LocalDateTime.now())
                    .build();

            auditEventRepository.save(event);
            log.debug("Audit event logged with metadata: actor={}, action={}, resource={}",
                    actorId, action, resourceType);
        } catch (Exception e) {
            log.error("Failed to log audit event with metadata: {}", e.getMessage());
        }
    }

    /**
     * Log login event.
     */
    public void logLogin(UUID userId, String role, boolean success, HttpServletRequest request) {
        log(userId, role, success ? "LOGIN_SUCCESS" : "LOGIN_FAILURE",
                "User", userId, success ? "SUCCESS" : "DENIED", request);
    }

    /**
     * Log record access event.
     */
    public void logRecordAccess(UUID actorId, String actorRole, UUID recordId,
            boolean granted, HttpServletRequest request) {
        log(actorId, actorRole, granted ? "READ_RECORD" : "READ_RECORD_DENIED",
                "MedicalRecord", recordId, granted ? "SUCCESS" : "DENIED", request);
    }

    /**
     * Log consent action event.
     */
    public void logConsentAction(UUID actorId, String actorRole, UUID consentId,
            String action, boolean success, HttpServletRequest request) {
        log(actorId, actorRole, action, "Consent", consentId,
                success ? "SUCCESS" : "DENIED", request);
    }

    /**
     * Log emergency access event.
     */
    public void logEmergencyAccess(UUID doctorId, UUID patientId, boolean granted,
            HttpServletRequest request) {
        log(doctorId, "DOCTOR", granted ? "EMERGENCY_ACCESS" : "EMERGENCY_ACCESS_DENIED",
                "Patient", patientId, granted ? "SUCCESS" : "DENIED", request);
    }

    private String getClientIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String getUserAgent(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        return request.getHeader("User-Agent");
    }
}
