-- V7: Create encounters table (FHIR Encounter)
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    encounter_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PLANNED',
    chief_complaint VARCHAR(500),
    hospital_name VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_encounter_patient ON encounters(patient_id);
CREATE INDEX idx_encounter_doctor ON encounters(doctor_id);
CREATE INDEX idx_encounter_dates ON encounters(start_time DESC);