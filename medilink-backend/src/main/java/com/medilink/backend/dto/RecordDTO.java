package com.medilink.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RecordDTO {

    private UUID id;
    private String title;
    private String recordType;

    private String fileUrl; // presigned URL
    private String fileMimeType;
    private Long fileSizeBytes;

    private String hospitalName;
    private LocalDateTime recordDate;

    private List<String> allergiesDocumented;
    private List<String> medicationsPrescribed;

    private String uploadedByLabel;
}
