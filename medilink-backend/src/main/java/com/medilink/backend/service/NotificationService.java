package com.medilink.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.medilink.backend.model.Patient;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationService {

    private final JavaMailSender mailSender;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Email send failed for recipient={} error={}", to, ex.getMessage());
        }
    }

    public void sendInAppNotification(String destinationUserId, Object payload) {
        messagingTemplate.convertAndSendToUser(
                destinationUserId,
                "/queue/notifications",
                payload
        );
    }

    /**
     * Send OTP via SMS (placeholder - integrate with SMS provider like Twilio).
     */
    public void sendOtpSms(String phoneNumber, String otp) {
        // TODO: Integrate with SMS provider (Twilio, etc.)
        log.info("Sending OTP {} to phone {}", otp, phoneNumber);
        // Placeholder: In production, integrate with SMS API
    }

    /**
     * Send emergency access notification to patient and their emergency contact.
     */
    public void sendEmergencyAccessNotification(Patient patient, UUID doctorId) {
        log.info("Sending emergency access notification to patient {} by doctor {}",
                patient.getId(), doctorId);
        
        // Notify patient via WebSocket
        messagingTemplate.convertAndSendToUser(
                patient.getId().toString(),
                "/queue/emergency",
                new EmergencyAccessEvent(doctorId)
        );

        // Alert Emergency Contact (Family) via SMS Placeholder
        if (patient.getEmergencyContact() != null && patient.getEmergencyContact().getPhone() != null) {
            log.info("ALERT: SMS sent to Emergency Contact ({}) at {}: Critical access override initiated by Dr. {}.", 
                patient.getEmergencyContact().getName(), 
                patient.getEmergencyContact().getPhone(),
                doctorId);
        }
    }

    /**
     * Send consent approval notification to doctor.
     */
    public void sendConsentApprovalNotification(UUID doctorId, UUID consentId) {
        log.info("Sending consent approval notification to doctor {} for consent {}",
                doctorId, consentId);
        messagingTemplate.convertAndSendToUser(
                doctorId.toString(),
                "/queue/consent",
                new ConsentApprovalEvent(consentId)
        );
    }

    // Event classes for WebSocket notifications
    public record EmergencyAccessEvent(UUID doctorId) {

    }

    public record ConsentApprovalEvent(UUID consentId) {

    }
}
