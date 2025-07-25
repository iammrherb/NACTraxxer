-- This script adds tables required for project scoping and management.

-- Create the 'projects' table to store high-level project information.
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    customer VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed')),
    settings JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add the 'project_id' foreign key to the 'sites' table to link sites to projects.
-- This assumes that for a new setup, the 'sites' table is empty or can be linked to new projects.
ALTER TABLE sites ADD COLUMN IF NOT EXISTS project_id UUID;

-- Add a foreign key constraint to ensure data integrity between sites and projects.
-- This might need to be run after populating the project_id column if sites already exist.
ALTER TABLE sites ADD CONSTRAINT fk_project
    FOREIGN KEY(project_id) 
    REFERENCES projects(id)
    ON DELETE CASCADE;

-- Create the 'scoping_questionnaires' table to store initial project scoping data.
CREATE TABLE IF NOT EXISTS scoping_questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_name VARCHAR(255) NOT NULL,
    industry VARCHAR(255),
    region VARCHAR(100),
    country VARCHAR(100),
    total_users INTEGER,
    site_count INTEGER,
    wired_vendors TEXT[],
    wireless_vendors TEXT[],
    mdm_vendors TEXT[],
    status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
