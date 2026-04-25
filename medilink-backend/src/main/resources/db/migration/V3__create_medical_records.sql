CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id),
    uploaded_by UUID NOT NULL,
    uploaded_by_label VARCHAR(300),
    record_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    file_url TEXT NOT NULL,
    file_mime_type VARCHAR(100),
    file_size_bytes BIGINT,
    notes TEXT,
    hospital_name VARCHAR(200),
    record_date TIMESTAMP,
    is_visible_to_doctor BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS record_allergies (
    record_id UUID NOT NULL REFERENCES medical_records(id),
    allergy VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS record_medications (
    record_id UUID NOT NULL REFERENCES medical_records(id),
    medication VARCHAR(300) NOT NULL
);
