package com.medilink.backend.service;

import com.medilink.backend.dto.AuthRequest;
import com.medilink.backend.dto.AuthResponse;
import com.medilink.backend.dto.RegisterRequest;
import com.medilink.backend.exception.UnauthorizedException;
import com.medilink.backend.model.Doctor;
import com.medilink.backend.model.Patient;
import com.medilink.backend.model.RefreshToken;
import com.medilink.backend.model.User;
import com.medilink.backend.repository.DoctorRepository;
import com.medilink.backend.repository.PatientRepository;
import com.medilink.backend.repository.UserRepository;
import com.medilink.backend.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthResponse login(AuthRequest request, HttpServletRequest httpRequest) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String accessToken = jwtTokenProvider.generateToken(user);
        String refreshToken = refreshTokenService.createToken(
                user,
                httpRequest.getHeader("User-Agent"),
                resolveIp(httpRequest)
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletRequest httpRequest) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User.Role role = parseRole(request.getRole());
        User user = switch (role) {
            case PATIENT -> createPatient(request, normalizedEmail);
            case DOCTOR -> createDoctor(request, normalizedEmail);
            case ADMIN, SUPER_ADMIN, JR_ADMIN -> 
                throw new IllegalArgumentException("Administrative roles cannot be self-registered");
        };

        String accessToken = jwtTokenProvider.generateToken(user);
        String refreshToken = refreshTokenService.createToken(
                user,
                httpRequest.getHeader("User-Agent"),
                resolveIp(httpRequest)
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenRaw, HttpServletRequest httpRequest) {
        RefreshToken refreshToken = refreshTokenService.validateRawToken(refreshTokenRaw)
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        User user = refreshToken.getUser();
        String newAccessToken = jwtTokenProvider.generateToken(user);
        String rotatedRefreshToken = refreshTokenService.rotateToken(
                refreshTokenRaw,
                user,
                httpRequest.getHeader("User-Agent"),
                resolveIp(httpRequest)
        );

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(rotatedRefreshToken)
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }

    @Transactional
    public void logout(String refreshTokenRaw) {
        if (refreshTokenRaw == null || refreshTokenRaw.isBlank()) {
            return;
        }
        refreshTokenService.revokeRawToken(refreshTokenRaw);
    }

    @Transactional
    public void verifyUser(java.util.UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.medilink.backend.exception.ResourceNotFoundException("User not found"));
        user.setVerified(true);
        userRepository.save(user);
    }

    private Patient createPatient(RegisterRequest request, String normalizedEmail) {
        if (request.getHealthId() == null || request.getHealthId().isBlank()) {
            throw new IllegalArgumentException("Health ID is required for patient registration");
        }
        String normalizedHealthId = request.getHealthId().trim();
        if (patientRepository.findByHealthId(normalizedHealthId).isPresent()) {
            throw new IllegalArgumentException("Health ID is already registered");
        }

        Patient patient = Patient.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.PATIENT)
                .verified(false) // Changed to false for Phase 1 verification flow
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .healthId(normalizedHealthId)
                .build();
        return patientRepository.save(patient);
    }

    private Doctor createDoctor(RegisterRequest request, String normalizedEmail) {
        if (request.getLicenseNumber() == null || request.getLicenseNumber().isBlank()) {
            throw new IllegalArgumentException("License number is required for doctor registration");
        }
        String normalizedLicenseNo = request.getLicenseNumber().trim();
        if (doctorRepository.findByLicenseNo(normalizedLicenseNo).isPresent()) {
            throw new IllegalArgumentException("License number is already registered");
        }

        Doctor doctor = Doctor.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.DOCTOR)
                .verified(false)
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .licenseNo(normalizedLicenseNo)
                .specialization(defaultIfBlank(request.getSpecialization(), "General Medicine"))
                .hospital(defaultIfBlank(request.getHospital(), "Not Provided"))
                .department(defaultIfBlank(request.getDepartment(), "General"))
                .build();
        return doctorRepository.save(doctor);
    }

    private User.Role parseRole(String role) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Role is required");
        }

        try {
            return User.Role.valueOf(role.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Unsupported role: " + role);
        }
    }

    private String defaultIfBlank(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value.trim();
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String resolveIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
