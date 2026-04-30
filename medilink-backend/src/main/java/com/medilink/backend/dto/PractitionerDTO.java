package com.medilink.backend.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PractitionerDTO {

    private UUID id;
    private String fullName;
    private String email;
    private String phone;
    private String licenseNo;
    private String specialization;
    private String hospital;
    private String department;
    private boolean verified;
}
