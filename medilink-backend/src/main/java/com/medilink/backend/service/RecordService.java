package com.medilink.backend.service;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.medilink.backend.dto.RecordDTO;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.exception.UnauthorizedException;
import com.medilink.backend.model.MedicalRecord;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.MedicalRecordRepository;
import com.medilink.backend.repository.PatientRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class RecordService {

    private final MedicalRecordRepository recordRepository;
    private final PatientRepository patientRepository;
    private final AccessControlService accessControlService;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public List<RecordDTO> getPatientRecords(UUID patientId, UUID doctorId) {
        if (!accessControlService.isDoctorAssignedToPatient(doctorId, patientId)) {
            throw new UnauthorizedException("No valid consent or emergency access for this doctor and patient");
        }

        return recordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .filter(MedicalRecord::isVisibleToDoctor)
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<RecordDTO> getPatientOwnedRecords(UUID patientId) {
        return recordRepository.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional
    public RecordDTO uploadRecord(
            UUID patientId,
            String title,
            String recordType,
            String hospitalName,
            String recordDate,
            String notes,
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Record file is required");
        }
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Record title is required");
        }
        if (recordType == null || recordType.isBlank()) {
            throw new IllegalArgumentException("Record type is required");
        }

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        String safeName = file.getOriginalFilename() == null
                ? "document.bin"
                : file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_");
        String objectKey = "records/" + patientId + "/" + UUID.randomUUID() + "-" + safeName;

        try {
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentLength(file.getSize());
            metadata.setContentType(file.getContentType());
            storageService.uploadObject(objectKey, file.getInputStream(), metadata);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to upload record file", ex);
        }

        MedicalRecord record = MedicalRecord.builder()
                .patient(patient)
                .uploadedBy(patient.getId())
                .uploadedByLabel(patient.getFullName())
                .recordType(MedicalRecord.RecordType.valueOf(recordType))
                .title(title.trim())
                .fileUrl(objectKey)
                .fileMimeType(file.getContentType())
                .fileSizeBytes(file.getSize())
                .hospitalName(blankToNull(hospitalName))
                .recordDate(parseDateTime(recordDate))
                .notes(blankToNull(notes))
                .build();

        return mapToDTO(recordRepository.save(record));
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

    private LocalDateTime parseDateTime(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(raw);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid recordDate. Use ISO format like 2026-04-29T09:30");
        }
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
