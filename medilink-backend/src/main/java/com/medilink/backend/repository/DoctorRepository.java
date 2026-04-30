package com.medilink.backend.repository;

import com.medilink.backend.model.Doctor;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {

    Optional<Doctor> findByLicenseNo(String licenseNo);

    List<Doctor> findAllByVerifiedAtIsNull();

    long countByVerifiedAtIsNull();
}
