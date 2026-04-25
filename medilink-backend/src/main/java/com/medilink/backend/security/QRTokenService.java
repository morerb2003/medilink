package com.medilink.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class QRTokenService {

    @Value("${security.qr.secret:change-this-qr-secret-key-with-at-least-32-chars}")
    private String qrSecret;

    @Value("${security.qr.expiration-ms:900000}")
    private long qrExpirationMs;

    public String signQr(UUID patientId, String healthId) {
        Instant now = Instant.now();
        return Jwts.builder()
                .subject("QR_ACCESS")
                .claim("patientId", patientId.toString())
                .claim("healthId", healthId)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plusMillis(qrExpirationMs)))
                .signWith(getSigningKey())
                .compact();
    }

    public Claims verifyQr(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(qrSecret.getBytes(StandardCharsets.UTF_8));
    }
}
