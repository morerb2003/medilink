package com.medilink.backend.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import java.io.InputStream;
import java.net.URL;
import java.time.Instant;
import java.util.Date;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

@Service
public class StorageService {

    private final AmazonS3 amazonS3;
    private final String bucketName;
    private final long presignedUrlTtlSeconds;

    public StorageService(
            @Lazy AmazonS3 amazonS3,
            @Value("${app.storage.bucket:medilink-dev-bucket}") String bucketName,
            @Value("${app.storage.presigned-url-ttl-seconds:3600}") long presignedUrlTtlSeconds) {
        Assert.hasText(bucketName, "app.storage.bucket must not be blank");
        Assert.isTrue(
                presignedUrlTtlSeconds > 0,
                "app.storage.presigned-url-ttl-seconds must be greater than 0");
        this.amazonS3 = amazonS3;
        this.bucketName = bucketName.trim();
        this.presignedUrlTtlSeconds = presignedUrlTtlSeconds;
    }

    public void uploadObject(String objectKey, InputStream inputStream, ObjectMetadata metadata) {
        String normalizedObjectKey = requireObjectKey(objectKey);
        InputStream safeInputStream = Objects.requireNonNull(inputStream, "inputStream must not be null");
        ObjectMetadata resolvedMetadata = metadata == null ? new ObjectMetadata() : metadata;
        amazonS3.putObject(bucketName, normalizedObjectKey, safeInputStream, resolvedMetadata);
    }

    public String getPresignedUrl(String objectKey) {
        String normalizedObjectKey = normalizeObjectKey(objectKey);
        if (normalizedObjectKey == null) {
            return null;
        }

        Date expiry = Date.from(Instant.now().plusSeconds(presignedUrlTtlSeconds));
        GeneratePresignedUrlRequest request =
                new GeneratePresignedUrlRequest(bucketName, normalizedObjectKey)
                        .withMethod(HttpMethod.GET)
                        .withExpiration(expiry);
        URL url = amazonS3.generatePresignedUrl(request);
        return url.toString();
    }

    private String requireObjectKey(String objectKey) {
        String normalizedObjectKey = normalizeObjectKey(objectKey);
        Assert.hasText(normalizedObjectKey, "objectKey must not be blank");
        return normalizedObjectKey;
    }

    private String normalizeObjectKey(String objectKey) {
        if (objectKey == null) {
            return null;
        }

        String normalizedObjectKey = objectKey.trim();
        return normalizedObjectKey.isEmpty() ? null : normalizedObjectKey;
    }
}
