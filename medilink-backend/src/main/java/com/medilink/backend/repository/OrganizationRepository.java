package com.medilink.backend.repository;

import com.medilink.backend.model.Organization;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    boolean existsByName(String name);
    boolean existsByRegistrationNumber(String registrationNumber);
}
