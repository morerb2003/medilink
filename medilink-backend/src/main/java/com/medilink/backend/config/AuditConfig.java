package com.medilink.backend.config;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Aspect
@Configuration
public class AuditConfig {

    @Around("execution(* com.medilink.backend.service..*(..))")
    public Object logServiceCall(ProceedingJoinPoint joinPoint) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - start;
            log.info("AUDIT service={} durationMs={} status=SUCCESS",
                    joinPoint.getSignature().toShortString(),
                    duration);
            return result;
        } catch (Throwable ex) {
            long duration = System.currentTimeMillis() - start;
            log.warn("AUDIT service={} durationMs={} status=ERROR message={}",
                    joinPoint.getSignature().toShortString(),
                    duration,
                    ex.getMessage());
            throw ex;
        }
    }
}
