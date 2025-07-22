-- Drop tables in reverse order of dependency to avoid foreign key constraint errors
DROP TABLE IF EXISTS site_technical_owners;
DROP TABLE IF EXISTS sites;
DROP TABLE IF EXISTS users;

-- Drop custom types
DROP TYPE IF EXISTS site_status;
DROP TYPE IF EXISTS site_radsec;
DROP TYPE IF EXISTS site_phase;
DROP TYPE IF EXISTS site_priority;
DROP TYPE IF EXISTS user_role;

-- Create custom ENUM types for controlled vocabularies
CREATE TYPE user_role AS ENUM ('Admin', 'Project Manager', 'Engineer', 'Read-Only');
CREATE TYPE site_priority AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE site_phase AS ENUM ('Scoping', 'In Progress', 'Completed');
CREATE TYPE site_radsec AS ENUM ('Yes', 'No', 'TBD');
CREATE TYPE site_status AS ENUM ('Planning', 'In Progress', 'Completed', 'At Risk');

-- Create the users table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role user_role NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create the sites table
CREATE TABLE sites (
    id TEXT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region TEXT,
    country TEXT,
    priority site_priority,
    phase site_phase,
    users_count INTEGER,
    project_manager_id TEXT REFERENCES users(id),
    radsec site_radsec,
    planned_start TIMESTAMP,
    planned_end TIMESTAMP,
    status site_status,
    completion_percent INTEGER DEFAULT 0,
    notes TEXT,
    use_case_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create a junction table for the many-to-many relationship between sites and technical owners
CREATE TABLE site_technical_owners (
  site_id TEXT NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (site_id, user_id)
);

-- Add indexes for commonly queried columns
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_project_manager_id ON sites(project_manager_id);
CREATE INDEX idx_users_role ON users(role);
