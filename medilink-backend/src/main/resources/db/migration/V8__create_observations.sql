-- V8: Create observations table (FHIR Observation)
CREATE TABLE observations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    doctor_id UUID NOT NULL REFERENCES doctors(id),
    encounter_id UUID REFERENCES encounters(id),
    code VARCHAR(20) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    value VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    category VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    effective_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_observation_patient ON observations(patient_id);
CREATE INDEX idx_observation_encounter ON observations(encounter_id);
CREATE INDEX idx_observation_code ON observations(code);
CREATE INDEX idx_observation_effective ON observations(effective_date DESC);