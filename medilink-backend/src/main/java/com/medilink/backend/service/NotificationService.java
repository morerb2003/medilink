package com.medilink.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
}
