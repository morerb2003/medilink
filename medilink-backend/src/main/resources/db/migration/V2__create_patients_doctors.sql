CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    dob DATE,
    phone VARCHAR(20),
    photo_url VARCHAR(512),
    health_id VARCHAR(20) NOT NULL UNIQUE,
    qr_code VARCHAR(512),
    blood_group VARCHAR(5),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS doctors (
    id UUID PRIMARY KEY REFERENCES users(id),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    photo_url VARCHAR(512),
    license_no VARCHAR(50) NOT NULL UNIQUE,
    specialization VARCHAR(100) NOT NULL,
    hospital VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    verified_at TIMESTAMP,
    verified_by VARCHAR(36),
    rejection_reason VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS patient_allergies (
    patient_id UUID NOT NULL REFERENCES patients(id),
    allergy VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS patient_medications (
    patient_id UUID NOT NULL REFERENCES patients(id),
    medication VARCHAR(300) NOT NULL
);

CREATE TABLE IF NOT EXISTS patient_chronic_conditions (
    patient_id UUID NOT NULL REFERENCES patients(id),
    condition VARCHAR(200) NOT NULL
);
