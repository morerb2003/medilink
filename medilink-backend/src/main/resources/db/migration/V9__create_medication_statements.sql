-- V9: Create medication_statements table (FHIR MedicationStatement)
CREATE TABLE medication_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    prescribed_by UUID REFERENCES doctors(id),
    encounter_id UUID REFERENCES encounters(id),
    medication_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    route VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medication_patient ON medication_statements(patient_id);
CREATE INDEX idx_medication_encounter ON medication_statements(encounter_id);
CREATE INDEX idx_medication_status ON medication_statements(status);