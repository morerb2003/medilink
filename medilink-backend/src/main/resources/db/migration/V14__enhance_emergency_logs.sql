-- V14: Add enhanced fields to emergency_logs for OTP flow
ALTER TABLE emergency_logs ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';
ALTER TABLE emergency_logs ADD COLUMN otp_hash VARCHAR(255);
ALTER TABLE emergency_logs ADD COLUMN otp_expires_at TIMESTAMP;
ALTER TABLE emergency_logs ADD COLUMN access_granted_at TIMESTAMP;
ALTER TABLE emergency_logs ADD COLUMN geo_location VARCHAR(100);
ALTER TABLE emergency_logs ADD COLUMN device_fingerprint VARCHAR(255);
ALTER TABLE emergency_logs ADD COLUMN country_code VARCHAR(5);

CREATE INDEX idx_emergency_status ON emergency_logs(status);