package com.medilink.backend.service;

import com.medilink.backend.dto.RecordDTO;
import com.medilink.backend.exception.UnauthorizedException;
import com.medilink.backend.model.MedicalRecord;
import com.medilink.backend.repository.MedicalRecordRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final MedicalRecordRepository recordRepository;
    private final ConsentService consentService;
    private final StorageService storageService;

    public List<RecordDTO> getPatientRecords(UUID patientId, UUID doctorId) {
        if (!consentService.hasValidConsent(patientId, doctorId)) {
            throw new UnauthorizedException("No valid consent for this doctor and patient");
        }

        return recordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .filter(MedicalRecord::isVisibleToDoctor)
                .map(this::mapToDTO)
                .toList();
    }

    public List<RecordDTO> getPatientOwnedRecords(UUID patientId) {
        return recordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    private RecordDTO mapToDTO(MedicalRecord record) {
        return RecordDTO.builder()
                .id(record.getId())
                .title(record.getTitle())
                .recordType(record.getRecordType().name())
                .fileUrl(storageService.getPresignedUrl(record.getFileUrl()))
                .fileMimeType(record.getFileMimeType())
                .fileSizeBytes(record.getFileSizeBytes())
                .hospitalName(record.getHospitalName())
                .recordDate(record.getRecordDate())
                .allergiesDocumented(record.getAllergiesDocumented())
                .medicationsPrescribed(record.getMedicationsPrescribed())
                .uploadedByLabel(record.getUploadedByLabel())
                .build();
    }
}
