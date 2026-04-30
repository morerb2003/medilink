package com.medilink.backend.service;

import com.medilink.backend.model.RefreshToken;
import com.medilink.backend.model.User;
import com.medilink.backend.repository.RefreshTokenRepository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing refresh tokens.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Transactional
    public String createToken(User user, String deviceInfo, String ipAddress) {
        String rawToken = UUID.randomUUID() + "." + UUID.randomUUID();

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(rawToken) // TODO: hash with BCrypt for production hardening
                .expiresAt(LocalDateTime.now().plusDays(7))
                .revoked(false)
                .deviceInfo(deviceInfo)
                .ipAddress(ipAddress)
                .build();

        refreshTokenRepository.save(refreshToken);
        log.info("Created refresh token for user {}", user.getId());
        return rawToken;
    }

    @Transactional(readOnly = true)
    public Optional<RefreshToken> validateRawToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return Optional.empty();
        }

        Optional<RefreshToken> tokenOpt = refreshTokenRepository.findByTokenHash(rawToken);
        if (tokenOpt.isEmpty()) {
            return Optional.empty();
        }

        RefreshToken token = tokenOpt.get();
        if (token.isRevoked() || token.getExpiresAt().isBefore(LocalDateTime.now())) {
            return Optional.empty();
        }

        return tokenOpt;
    }

    @Transactional
    public String rotateToken(String oldRawToken, User user, String deviceInfo, String ipAddress) {
        revokeRawToken(oldRawToken);
        return createToken(user, deviceInfo, ipAddress);
    }

    @Transactional
    public void revokeRawToken(String rawToken) {
        refreshTokenRepository.findByTokenHash(rawToken).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
            log.info("Revoked refresh token {}", token.getId());
        });
    }

    @Transactional
    public void revokeAllUserTokens(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
        log.info("Revoked all refresh tokens for user {}", userId);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        int deleted = refreshTokenRepository.deleteExpiredTokens(LocalDateTime.now());
        log.info("Cleaned up {} expired refresh tokens", deleted);
    }
}
