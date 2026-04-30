package com.medilink.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * OTP Service for emergency access verification. Uses Redis for fast OTP
 * storage with TTL.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String OTP_PREFIX = "otp:";
    private static final String EMERGENCY_SESSION_PREFIX = "emergency:";
    private static final int OTP_LENGTH = 6;
    private static final Duration OTP_TTL = Duration.ofMinutes(5);
    private static final Duration EMERGENCY_SESSION_TTL = Duration.ofMinutes(15);

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generate a 6-digit OTP for emergency access.
     *
     * @return 6-digit OTP string
     */
    public String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Store OTP in Redis with 5-minute TTL.
     *
     * @param sessionId The emergency session ID
     * @param otp The OTP to store
     */
    public void storeOtp(UUID sessionId, String otp) {
        String key = OTP_PREFIX + sessionId.toString();
        redisTemplate.opsForValue().set(key, otp, OTP_TTL);
        log.debug("Stored OTP for session {} with {} minute TTL", sessionId, OTP_TTL.toMinutes());
    }

    /**
     * Validate OTP against stored value.
     *
     * @param sessionId The emergency session ID
     * @param otp The OTP to validate
     * @return true if OTP is valid and not expired
     */
    public boolean validateOtp(UUID sessionId, String otp) {
        String key = OTP_PREFIX + sessionId.toString();
        Object storedOtpValue = redisTemplate.opsForValue().get(key);
        String storedOtp = storedOtpValue == null ? null : storedOtpValue.toString();

        if (storedOtp == null) {
            log.warn("OTP not found or expired for session {}", sessionId);
            return false;
        }

        boolean valid = storedOtp.equals(otp);
        if (valid) {
            // Clear OTP after successful validation (single use)
            redisTemplate.delete(key);
            log.info("OTP validated successfully for session {}, OTP cleared", sessionId);
        } else {
            log.warn("Invalid OTP provided for session {}", sessionId);
        }

        return valid;
    }

    /**
     * Store emergency session data in Redis with 15-minute TTL.
     *
     * @param sessionId The emergency session ID
     * @param patientId The patient ID
     * @param doctorId The doctor ID
     */
    public void storeEmergencySession(UUID sessionId, UUID patientId, UUID doctorId) {
        String key = EMERGENCY_SESSION_PREFIX + sessionId.toString();
        String value = patientId.toString() + ":" + doctorId.toString();
        redisTemplate.opsForValue().set(key, value, EMERGENCY_SESSION_TTL);
        log.debug("Stored emergency session {} with {} minute TTL", sessionId, EMERGENCY_SESSION_TTL.toMinutes());
    }

    /**
     * Get emergency session data.
     *
     * @param sessionId The emergency session ID
     * @return session data or null if not found
     */
    public String getEmergencySession(UUID sessionId) {
        String key = EMERGENCY_SESSION_PREFIX + sessionId.toString();
        Object value = redisTemplate.opsForValue().get(key);
        return value == null ? null : value.toString();
    }

    /**
     * Revoke an emergency session.
     *
     * @param sessionId The emergency session ID
     */
    public void revokeEmergencySession(UUID sessionId) {
        String key = EMERGENCY_SESSION_PREFIX + sessionId.toString();
        redisTemplate.delete(key);
        log.info("Revoked emergency session {}", sessionId);
    }

    /**
     * Check if an emergency session is active.
     *
     * @param sessionId The emergency session ID
     * @return true if session is active
     */
    public boolean isSessionActive(UUID sessionId) {
        String key = EMERGENCY_SESSION_PREFIX + sessionId.toString();
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }

    /**
     * Get remaining TTL for emergency session in seconds.
     *
     * @param sessionId The emergency session ID
     * @return remaining seconds or -1 if not found
     */
    public long getSessionRemainingSeconds(UUID sessionId) {
        String key = EMERGENCY_SESSION_PREFIX + sessionId.toString();
        Long ttl = redisTemplate.getExpire(key);
        return ttl != null && ttl > 0 ? ttl : -1;
    }
}
