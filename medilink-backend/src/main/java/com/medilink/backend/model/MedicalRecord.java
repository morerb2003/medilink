package com.medilink.backend.model;



import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * A single medical record belonging to a Patient.
 * Table: medical_records
 *
 * Key design decisions:
 *
 *  - file_url stores the S3 object KEY (not a full URL). The full pre-signed URL
 *    with 1-hour expiry is generated on-demand by StorageService.getPresignedUrl()
 *    and returned in RecordDTO. This means:
 *      (a) the URL in the DB never expires (the key doesn't expire, only the URL)
 *      (b) direct unauthenticated access to the file is structurally impossible
 *
 *  - record_type uses an enum so the frontend can filter by type without
 *    free-text string matching. New types (e.g. GENETIC_REPORT) can be added
 *    without a migration — just extend the enum.
 *
 *  - uploadedBy stores the UUID of whoever uploaded the file (patient self-upload
 *    OR a doctor uploading on the patient's behalf after consultation). This
 *    lets the patient see "Uploaded by Dr. Sharma — Apollo Chennai" in their
 *    record history, not just "Uploaded by system".
 *
 *  - allergies / medications on the record (vs on the patient profile):
 *    These capture what was documented AT THE TIME OF THIS VISIT. The patient
 *    profile fields are the current summary. A patient could have an allergy
 *    documented in a 2019 discharge summary even if they later removed it from
 *    their profile — the historical record is preserved here.
 *
 *  - isVisibleToDoctor: soft access control flag. Patient can hide specific
 *    records from doctor view even within an approved consent window.
 *    Default true; patient can set false for sensitive records.
 */
@Entity
@Table(
    name = "medical_records",
    indexes = {
        // Covers the most common query: paginated record list for a patient, newest first
        @Index(name = "idx_records_patient", columnList = "patient_id, created_at DESC"),
        // Covers doctor's view query (also filtered by consent check)
        @Index(name = "idx_records_type",    columnList = "patient_id, record_type")
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    // ── Ownership ─────────────────────────────────────────────────────────────
    /**
     * The patient this record belongs to.
     * Lazy fetch — we never need the full Patient object just to list records.
     * Use patient.getId() for filtering; load full patient only for snapshot.
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false, updatable = false)
    private Patient patient;

    /**
     * UUID of the user who uploaded this record (Patient or Doctor).
     * Stored as UUID rather than FK to avoid a polymorphic join.
     * Displayed as "Uploaded by: {name}" via a separate lookup in RecordService.
     */
    @Column(name = "uploaded_by", nullable = false, updatable = false)
    private UUID uploadedBy;

    /**
     * Human-readable uploader attribution line stored at upload time.
     * e.g. "Dr. Priya Sharma (Apollo Hospitals, Chennai)"
     * Snapshot — immune to future name changes; preserves historical accuracy.
     */
    @Column(name = "uploaded_by_label", length = 300)
    private String uploadedByLabel;

    // ── Record metadata ───────────────────────────────────────────────────────
    @Enumerated(EnumType.STRING)
    @Column(name = "record_type", nullable = false, length = 50)
    private RecordType recordType;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    /**
     * S3 object KEY (not a full URL). StorageService generates the
     * pre-signed URL on demand with 1-hour expiry.
     * Example: "records/a3f9c2d1-8b4e/2024-03-15_CBC_report.pdf"
     */
    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    /**
     * MIME type of the uploaded file.
     * Used by the frontend to decide whether to render inline (image/*)
     * or show a download button (application/pdf, etc.)
     */
    @Column(name = "file_mime_type", length = 100)
    private String fileMimeType;

    /**
     * File size in bytes — shown in the record list UI so the patient/doctor
     * knows what they're downloading before clicking.
     */
    @Column(name = "file_size_bytes")
    private Long fileSizeBytes;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    /**
     * Name of the hospital/clinic where this record was created.
     * Free-text — allows records from non-MediLink hospitals to be uploaded.
     */
    @Column(name = "hospital_name", length = 200)
    private String hospitalName;

    /**
     * Date of the visit/test (may differ from created_at if the patient is
     * uploading old paper records). Used for chronological display in history.
     */
    @Column(name = "record_date")
    private LocalDateTime recordDate;

    // ── Clinical data documented at visit time ────────────────────────────────
    /**
     * Allergies documented IN THIS RECORD (discharge summary, prescription, etc.)
     * Separate from patient.allergies — this is the historical snapshot.
     * Stored as @ElementCollection / TEXT[] for PostgreSQL @> queries.
     */
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "record_allergies",
        joinColumns = @JoinColumn(name = "record_id")
    )
    @Column(name = "allergy", length = 200)
    @Builder.Default
    private List<String> allergiesDocumented = new ArrayList<>();

    /**
     * Medications prescribed IN THIS RECORD.
     * Separate from patient.currentMedications — this is the historical snapshot.
     */
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "record_medications",
        joinColumns = @JoinColumn(name = "record_id")
    )
    @Column(name = "medication", length = 300)
    @Builder.Default
    private List<String> medicationsPrescribed = new ArrayList<>();

    // ── Access control ────────────────────────────────────────────────────────
    /**
     * Patient-level soft hide flag.
     * When false, this record is excluded from doctor's GET /api/records/patient/{id}
     * response even if a valid APPROVED consent exists.
     * Default: true (visible).
     */
    @Column(name = "is_visible_to_doctor", nullable = false)
    @Builder.Default
    private boolean visibleToDoctor = true;

    // ── Audit ─────────────────────────────────────────────────────────────────
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // ── Enum ─────────────────────────────────────────────────────────────────
    public enum RecordType {
        LAB_REPORT,           // Blood tests, urine analysis, culture reports
        PRESCRIPTION,         // Doctor-issued prescriptions (paper photo or typed)
        IMAGING,              // X-ray, MRI, CT, Ultrasound reports
        DISCHARGE_SUMMARY,    // Hospital discharge documents
        VACCINATION,          // Immunisation records
        CONSULTATION_NOTE,    // OPD / specialist consultation notes
        SURGICAL_REPORT,      // Operation notes, anaesthesia reports
        PATHOLOGY,            // Biopsy, histopathology reports
        DENTAL,               // Dental X-rays and treatment records
        OPHTHALMOLOGY,        // Eye test, prescription glasses data
        OTHER                 // Catch-all for legacy/paper uploads
    }
}
