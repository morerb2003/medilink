package com.medilink.backend.controller;

import com.medilink.backend.dto.AuthRequest;
import com.medilink.backend.dto.AuthResponse;
import com.medilink.backend.dto.LogoutRequest;
import com.medilink.backend.dto.RegisterRequest;
import com.medilink.backend.dto.TokenRefreshRequest;
import com.medilink.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(authService.login(request, httpRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest
    ) {
        return ResponseEntity.ok(authService.register(request, httpRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestBody TokenRefreshRequest request,
            HttpServletRequest httpRequest
    ) {
        String refreshToken = request.getRefreshToken();
        if (refreshToken == null || refreshToken.isBlank()) {
            refreshToken = request.getToken();
        }
        return ResponseEntity.ok(authService.refresh(refreshToken, httpRequest));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody(required = false) LogoutRequest request) {
        if (request != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify")
    public ResponseEntity<java.util.Map<String, String>> verify(@RequestBody java.util.Map<String, String> request) {
        String userId = request.get("userId");
        String otp = request.get("otp");
        // In a real system, we would validate the OTP here
        authService.verifyUser(java.util.UUID.fromString(userId));
        return ResponseEntity.ok(java.util.Map.of("message", "User verified successfully"));
    }
}
