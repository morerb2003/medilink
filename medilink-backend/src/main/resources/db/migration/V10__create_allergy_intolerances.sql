-- V10: Create allergy_intolerances table (FHIR AllergyIntolerance)
CREATE TABLE allergy_intolerances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    substance VARCHAR(200) NOT NULL,
    allergy_type VARCHAR(20) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    reaction VARCHAR(200),
    onset_date DATE,
    active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_allergy_patient ON allergy_intolerances(patient_id);
CREATE INDEX idx_allergy_active ON allergy_intolerances(active);