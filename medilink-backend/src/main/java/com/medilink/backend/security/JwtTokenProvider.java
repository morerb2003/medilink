package com.medilink.backend.security;

import com.medilink.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.secret:change-this-jwt-secret-key-with-at-least-32-chars}")
    private String jwtSecret;

    @Value("${security.jwt.expiration-ms:3600000}")
    private long expirationMs;

    public String generateToken(User user) {
        return generateToken(user.getId().toString(), user.getEmail(), user.getRole().name());
    }

    public String generateToken(String userId, String subject, String role) {
        Instant now = Instant.now();
        Instant expiresAt = now.plusMillis(expirationMs);

        return Jwts.builder()
                .subject(subject)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiresAt))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {
        return getClaims(token).getPayload().getSubject();
    }

    public String extractUserId(String token) {
        return getClaims(token).getPayload().get("userId", String.class);
    }

    public String extractRole(String token) {
        return getClaims(token).getPayload().get("role", String.class);
    }

    public Jws<Claims> getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
    }

    public boolean validateToken(String token) {
        try {
            getClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
}

