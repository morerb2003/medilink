-- V17: Add social media links to patient profile
ALTER TABLE patients ADD COLUMN instagram_url VARCHAR(512);
ALTER TABLE patients ADD COLUMN facebook_url VARCHAR(512);
ALTER TABLE patients ADD COLUMN linkedin_url VARCHAR(512);
