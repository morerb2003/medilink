package com.medilink.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.medilink.backend.exception.ResourceNotFoundException;
import com.medilink.backend.model.Patient;
import com.medilink.backend.repository.PatientRepository;
import com.medilink.backend.security.QRTokenService;
import io.jsonwebtoken.Claims;
import java.io.ByteArrayOutputStream;
import java.util.Base64;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class QRCodeService {

    private final PatientRepository patientRepository;
    private final QRTokenService qrTokenService;

    @Transactional
    public String generateSignedQr(UUID patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));

        String token = qrTokenService.signQr(patient.getId(), patient.getHealthId());
        patient.setQrCode("qr://" + patient.getId());
        patientRepository.save(patient);
        return token;
    }

    public Claims verifyQRToken(String token) {
        return qrTokenService.verifyQr(token);
    }

    public byte[] generateQrPng(String payload) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(payload, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to generate QR image", ex);
        }
    }

    public String generateQrDataUri(String payload) {
        byte[] pngBytes = generateQrPng(payload);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(pngBytes);
    }
}
