package com.medilink.backend.service;

import com.medilink.backend.dto.AuthRequest;
import com.medilink.backend.dto.AuthResponse;
import com.medilink.backend.exception.UnauthorizedException;
import com.medilink.backend.model.User;
import com.medilink.backend.repository.UserRepository;
import com.medilink.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new UnauthorizedException("Invalid credentials");
        }

        String token = jwtTokenProvider.generateToken(user);

        return AuthResponse.builder()
                .accessToken(token)
                .role(user.getRole().name())
                .userId(user.getId())
                .build();
    }
}
