package com.medilink.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.PrimaryKeyJoinColumn;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "doctors",
        indexes = {
                @Index(name = "idx_license_no", columnList = "license_no", unique = true)
        }
)
@PrimaryKeyJoinColumn(name = "id")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@ToString(callSuper = true)
public class Doctor extends User {

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "photo_url")
    private String photoUrl;

    @Column(name = "license_no", nullable = false, unique = true, length = 50)
    private String licenseNo;

    @Column(name = "specialization", nullable = false, length = 100)
    private String specialization;

    @Column(name = "hospital", nullable = false, length = 200)
    private String hospital;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "verified_by", length = 36)
    private String verifiedBy;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    public boolean canAccessPatientData() {
        return isVerified() && getRole() == Role.DOCTOR;
    }
}
