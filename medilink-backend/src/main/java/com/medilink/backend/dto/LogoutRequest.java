package com.medilink.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {

    private String refreshToken;
}
