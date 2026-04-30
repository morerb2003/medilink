CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL,
    registration_number VARCHAR(100) UNIQUE,
    address VARCHAR(500),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS organization_id UUID;
ALTER TABLE users ADD CONSTRAINT fk_user_organization FOREIGN KEY (organization_id) REFERENCES organizations(id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_org_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_user_org ON users(organization_id);
