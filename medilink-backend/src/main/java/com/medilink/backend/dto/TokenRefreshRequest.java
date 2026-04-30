package com.medilink.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenRefreshRequest {

    /**
     * Preferred field for refresh flow.
     */
    private String refreshToken;

    /**
     * Backward-compatible alias accepted from older frontend calls.
     */
    private String token;
}
