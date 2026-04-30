package com.medilink.backend.repository;

import com.medilink.backend.model.AuditEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {

    Page<AuditEvent> findByActorIdOrderByOccurredAtDesc(UUID actorId, Pageable pageable);

    Page<AuditEvent> findByResourceTypeAndResourceIdOrderByOccurredAtDesc(
            String resourceType, UUID resourceId, Pageable pageable);

    @Query("SELECT a FROM AuditEvent a WHERE a.actorId = :actorId AND a.occurredAt BETWEEN :from AND :to")
    List<AuditEvent> findByActorIdAndDateRange(
            @Param("actorId") UUID actorId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );

    @Query("SELECT a FROM AuditEvent a WHERE a.action = :action AND a.occurredAt BETWEEN :from AND :to")
    List<AuditEvent> findByActionAndDateRange(
            @Param("action") String action,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}
