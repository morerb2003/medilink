-- V18: Add personal details to patient profile
ALTER TABLE patients ADD COLUMN occupation VARCHAR(100);
ALTER TABLE patients ADD COLUMN language_preference VARCHAR(50);
ALTER TABLE patients ADD COLUMN nationality VARCHAR(50);
ALTER TABLE patients ADD COLUMN address VARCHAR(500);
