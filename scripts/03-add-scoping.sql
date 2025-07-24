-- Drop trigger and function if they exist to ensure a clean setup
DROP TRIGGER IF EXISTS update_scoping_questionnaires_updated_at ON scoping_questionnaires;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Function to update the updated_at column on any table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Table to store data from the multi-step scoping questionnaire
CREATE TABLE IF NOT EXISTS scoping_questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    total_users INTEGER NOT NULL,
    site_count INTEGER DEFAULT 1,
    country VARCHAR(255),
    region VARCHAR(255),
    industry VARCHAR(255),
    project_goals JSONB,
    legacy_systems JSONB,
    idp_vendors JSONB,
    mfa_vendors JSONB,
    wired_vendors JSONB,
    wireless_vendors JSONB,
    mdm_vendors JSONB,
    edr_vendors JSONB,
    siem_vendors JSONB,
    firewall_vendors JSONB,
    vpn_vendors JSONB,
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger to automatically update updated_at on row update
CREATE TRIGGER update_scoping_questionnaires_updated_at
BEFORE UPDATE ON scoping_questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
