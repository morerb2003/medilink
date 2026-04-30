package com.medilink.backend.websocket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * WebSocket Event Publisher for real-time notifications. Pushes events to users
 * via STOMP WebSocket.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class WsEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Notify doctor when consent is approved.
     */
    public void notifyConsentApproved(UUID doctorId, UUID consentId) {
        messagingTemplate.convertAndSendToUser(
                doctorId.toString(),
                "/queue/consent",
                new ConsentEvent("APPROVED", consentId)
        );
        log.debug("Sent consent approval notification to doctor {}", doctorId);
    }

    /**
     * Notify doctor when consent is revoked.
     */
    public void notifyConsentRevoked(UUID doctorId, UUID consentId) {
        messagingTemplate.convertAndSendToUser(
                doctorId.toString(),
                "/queue/consent",
                new ConsentEvent("REVOKED", consentId)
        );
        log.debug("Sent consent revocation notification to doctor {}", doctorId);
    }

    /**
     * Notify patient when emergency access is initiated.
     */
    public void notifyEmergencyAccessInitiated(UUID patientId, EmergencyEvent event) {
        messagingTemplate.convertAndSendToUser(
                patientId.toString(),
                "/queue/emergency",
                event
        );
        log.debug("Sent emergency access notification to patient {}", patientId);
    }

    /**
     * Send emergency session countdown to doctor.
     */
    public void sendEmergencyCountdown(UUID doctorId, UUID sessionId, long secondsLeft) {
        messagingTemplate.convertAndSendToUser(
                doctorId.toString(),
                "/queue/emergency-countdown",
                new CountdownEvent(sessionId, secondsLeft)
        );
        log.debug("Sent emergency countdown {} seconds to doctor {}", secondsLeft, doctorId);
    }

    /**
     * Notify doctor when emergency session expires.
     */
    public void sendSessionExpired(UUID doctorId, UUID sessionId) {
        messagingTemplate.convertAndSendToUser(
                doctorId.toString(),
                "/queue/emergency",
                new SessionExpiredEvent(sessionId)
        );
        log.debug("Sent session expired notification to doctor {}", doctorId);
    }

    /**
     * Send generic notification to user.
     */
    public void sendNotification(UUID userId, String type, Object payload) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                new GenericNotification(type, payload)
        );
    }

    // Event record classes
    public record ConsentEvent(String status, UUID consentId) {

    }

    public record EmergencyEvent(String type, UUID doctorId, UUID sessionId, long expiresIn) {

    }

    public record CountdownEvent(UUID sessionId, long secondsLeft) {

    }

    public record SessionExpiredEvent(UUID sessionId) {

    }

    public record GenericNotification(String type, Object payload) {

    }
}
