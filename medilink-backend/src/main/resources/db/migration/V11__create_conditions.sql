-- V11: Create conditions table (FHIR Condition)
CREATE TABLE conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    diagnosed_by UUID REFERENCES doctors(id),
    encounter_id UUID REFERENCES encounters(id),
    icd_code VARCHAR(20),
    display_name VARCHAR(200) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    severity VARCHAR(20),
    onset_date DATE NOT NULL,
    resolved_date DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_condition_patient ON conditions(patient_id);
CREATE INDEX idx_condition_encounter ON conditions(encounter_id);
CREATE INDEX idx_condition_status ON conditions(status);
CREATE INDEX idx_condition_icd ON conditions(icd_code);