CREATE TABLE IF NOT EXISTS consents (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    status VARCHAR(20) NOT NULL,
    reason VARCHAR(500),
    requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMP,
    expires_at TIMESTAMP,
    revoked_at TIMESTAMP,
    emergency_override BOOLEAN NOT NULL DEFAULT FALSE
);
