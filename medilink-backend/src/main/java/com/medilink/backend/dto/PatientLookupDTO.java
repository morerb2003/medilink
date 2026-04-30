package com.medilink.backend.dto;

import java.util.UUID;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PatientLookupDTO {

    private UUID id;
    private String fullName;
    private String healthId;
}
