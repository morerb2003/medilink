package com.medilink.backend.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import java.io.InputStream;
import java.net.URL;
import java.time.Instant;
import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StorageService {

    private final AmazonS3 amazonS3;

    @Value("${app.storage.bucket:medilink-dev-bucket}")
    private String bucketName;

    public void uploadObject(String objectKey, InputStream inputStream, ObjectMetadata metadata) {
        amazonS3.putObject(bucketName, objectKey, inputStream, metadata);
    }

    public String getPresignedUrl(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {
            return null;
        }

        Date expiry = Date.from(Instant.now().plusSeconds(3600));
        GeneratePresignedUrlRequest request =
                new GeneratePresignedUrlRequest(bucketName, objectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiry);
        URL url = amazonS3.generatePresignedUrl(request);
        return url.toString();
    }
}
