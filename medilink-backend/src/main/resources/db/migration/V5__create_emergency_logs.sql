CREATE TABLE IF NOT EXISTS emergency_logs (
    id UUID PRIMARY KEY,
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    patient_id UUID NOT NULL REFERENCES patients(id),
    accessed_at TIMESTAMP NOT NULL DEFAULT NOW(),
    reason VARCHAR(500),
    access_method VARCHAR(20),
    expires_at TIMESTAMP,
    ip_address VARCHAR(64),
    flagged BOOLEAN NOT NULL DEFAULT FALSE
);
