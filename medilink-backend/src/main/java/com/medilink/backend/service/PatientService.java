package com.medilink.backend.service;

import com.medilink.backend.dto.PatientDTO;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.PatientRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientDTO getProfile(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return mapToDto(patient);
    }

    @Transactional
    public PatientDTO updateProfile(UUID patientId, PatientDTO request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        patient.setFullName(request.getFullName());
        patient.setPhone(request.getPhone());
        patient.setDob(request.getDob());
        patient.setBloodGroup(request.getBloodGroup());
        patient.setAllergies(request.getAllergies());
        patient.setCurrentMedications(request.getCurrentMedications());
        patient.setChronicConditions(request.getChronicConditions());

        if (request.getEmergencyContact() != null) {
            patient.setEmergencyContact(Patient.EmergencyContact.builder()
                    .name(request.getEmergencyContact().getName())
                    .phone(request.getEmergencyContact().getPhone())
                    .relation(request.getEmergencyContact().getRelation())
                    .build());
        }

        return mapToDto(patientRepository.save(patient));
    }

    private PatientDTO mapToDto(Patient patient) {
        Patient.EmergencyContact contact = patient.getEmergencyContact();
        PatientDTO.EmergencyContactDTO contactDTO = contact == null
                ? null
                : PatientDTO.EmergencyContactDTO.builder()
                .name(contact.getName())
                .phone(contact.getPhone())
                .relation(contact.getRelation())
                .build();

        return PatientDTO.builder()
                .id(patient.getId())
                .fullName(patient.getFullName())
                .email(patient.getEmail())
                .dob(patient.getDob())
                .phone(patient.getPhone())
                .healthId(patient.getHealthId())
                .bloodGroup(patient.getBloodGroup())
                .allergies(patient.getAllergies())
                .currentMedications(patient.getCurrentMedications())
                .chronicConditions(patient.getChronicConditions())
                .emergencyContact(contactDTO)
                .build();
    }
}
