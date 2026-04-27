package com.medilink.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import java.io.ByteArrayInputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class StorageServiceTest {

    private static final String BUCKET_NAME = "medilink-test-bucket";
    private static final long PRESIGNED_URL_TTL_SECONDS = 3600L;

    @Mock
    private AmazonS3 amazonS3;

    private StorageService storageService;

    @BeforeEach
    void setUp() {
        storageService = new StorageService(amazonS3, BUCKET_NAME, PRESIGNED_URL_TTL_SECONDS);
    }

    @Test
    void getPresignedUrlReturnsNullWhenObjectKeyIsBlank() {
        assertNull(storageService.getPresignedUrl("   "));
        verifyNoInteractions(amazonS3);
    }

    @Test
    void uploadObjectRejectsBlankObjectKey() {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(new byte[0]);

        assertThrows(
                IllegalArgumentException.class,
                () -> storageService.uploadObject("   ", inputStream, new ObjectMetadata()));
        verifyNoInteractions(amazonS3);
    }

    @Test
    void uploadObjectUsesEmptyMetadataWhenMetadataIsNull() {
        ByteArrayInputStream inputStream = new ByteArrayInputStream(new byte[0]);

        storageService.uploadObject(" records/lab-report.pdf ", inputStream, null);

        verify(amazonS3)
                .putObject(eq(BUCKET_NAME), eq("records/lab-report.pdf"), same(inputStream), any(ObjectMetadata.class));
    }

    @Test
    void getPresignedUrlUsesNormalizedObjectKeyAndConfiguredExpiry() throws MalformedURLException {
        URL presignedUrl = new URL("https://example.com/records/lab-report.pdf");
        when(amazonS3.generatePresignedUrl(any(GeneratePresignedUrlRequest.class))).thenReturn(presignedUrl);

        String generatedUrl = storageService.getPresignedUrl(" records/lab-report.pdf ");

        assertEquals(presignedUrl.toString(), generatedUrl);

        ArgumentCaptor<GeneratePresignedUrlRequest> requestCaptor =
                ArgumentCaptor.forClass(GeneratePresignedUrlRequest.class);
        verify(amazonS3).generatePresignedUrl(requestCaptor.capture());

        GeneratePresignedUrlRequest request = requestCaptor.getValue();
        assertEquals(BUCKET_NAME, request.getBucketName());
        assertEquals("records/lab-report.pdf", request.getKey());
        assertEquals(HttpMethod.GET, request.getMethod());

        Instant expectedLowerBound = Instant.now().plusSeconds(PRESIGNED_URL_TTL_SECONDS - 5);
        Instant expectedUpperBound = Instant.now().plusSeconds(PRESIGNED_URL_TTL_SECONDS + 5);
        Instant actualExpiration = request.getExpiration().toInstant();
        org.junit.jupiter.api.Assertions.assertFalse(actualExpiration.isBefore(expectedLowerBound));
        org.junit.jupiter.api.Assertions.assertFalse(actualExpiration.isAfter(expectedUpperBound));
    }
}
