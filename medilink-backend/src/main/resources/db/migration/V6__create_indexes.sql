CREATE INDEX IF NOT EXISTS idx_health_id ON patients(health_id);
CREATE INDEX IF NOT EXISTS idx_license_no ON doctors(license_no);
CREATE INDEX IF NOT EXISTS idx_doctor_verified ON users(is_verified);

CREATE INDEX IF NOT EXISTS idx_records_patient ON medical_records(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_records_type ON medical_records(patient_id, record_type);

CREATE INDEX IF NOT EXISTS idx_consent_patient ON consents(patient_id);
CREATE INDEX IF NOT EXISTS idx_consent_doctor ON consents(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consent_status ON consents(status);

CREATE INDEX IF NOT EXISTS idx_emergency_patient ON emergency_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_emergency_doctor ON emergency_logs(doctor_id);
CREATE INDEX IF NOT EXISTS idx_emergency_time ON emergency_logs(accessed_at DESC);
