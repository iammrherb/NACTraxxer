-- Drop existing tables if they exist
DROP TABLE IF EXISTS scoping_questionnaires CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS use_cases CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS device_types CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendors table
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create device_types table
CREATE TABLE device_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sites table
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    phase VARCHAR(50) NOT NULL DEFAULT 'Phase 1',
    users INTEGER NOT NULL DEFAULT 0,
    project_manager VARCHAR(255) NOT NULL,
    radsec BOOLEAN DEFAULT false,
    planned_start DATE,
    planned_end DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Planned',
    completion_percent INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create use_cases table
CREATE TABLE use_cases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Draft',
    completion_percentage INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, role) VALUES
('John Smith', 'john.smith@company.com', 'Project Manager'),
('Sarah Johnson', 'sarah.johnson@company.com', 'Technical Lead'),
('Mike Davis', 'mike.davis@company.com', 'Network Engineer'),
('Lisa Chen', 'lisa.chen@company.com', 'Security Specialist'),
('David Wilson', 'david.wilson@company.com', 'Project Manager');

INSERT INTO vendors (name, type) VALUES
('Cisco', 'wired'),
('Juniper', 'wired'),
('Aruba', 'wireless'),
('Ruckus', 'wireless'),
('Meraki', 'wireless'),
('HPE', 'wired'),
('Fortinet', 'wired'),
('Ubiquiti', 'wireless');

INSERT INTO device_types (name, category) VALUES
('Windows Laptop', 'Computer'),
('MacBook', 'Computer'),
('iPhone', 'Mobile'),
('Android Phone', 'Mobile'),
('iPad', 'Tablet'),
('Android Tablet', 'Tablet'),
('Printer', 'IoT'),
('IP Camera', 'IoT'),
('VoIP Phone', 'Communication'),
('Access Point', 'Network');

INSERT INTO sites (name, region, country, priority, phase, users, project_manager, radsec, planned_start, planned_end, status, completion_percent, notes) VALUES
('New York Headquarters', 'North America', 'United States', 'High', 'Phase 1', 500, 'John Smith', true, '2024-01-15', '2024-03-15', 'In Progress', 65, 'Main headquarters deployment'),
('London Office', 'Europe', 'United Kingdom', 'High', 'Phase 1', 200, 'Sarah Johnson', false, '2024-02-01', '2024-04-01', 'In Progress', 45, 'European headquarters'),
('Tokyo Branch', 'Asia Pacific', 'Japan', 'Medium', 'Phase 2', 150, 'Mike Davis', false, '2024-03-01', '2024-05-01', 'Planned', 0, 'Asia Pacific expansion'),
('Sydney Office', 'Asia Pacific', 'Australia', 'Medium', 'Phase 2', 100, 'Lisa Chen', false, '2024-04-01', '2024-06-01', 'Planned', 0, 'Regional office deployment'),
('Berlin Office', 'Europe', 'Germany', 'Low', 'Phase 3', 75, 'David Wilson', false, '2024-05-01', '2024-07-01', 'Planned', 0, 'European expansion');

INSERT INTO use_cases (title, description, category, status, completion_percentage) VALUES
('Employee Device Authentication', 'Secure authentication for employee-owned devices accessing corporate resources', 'Authentication', 'Active', 80),
('Guest Network Access', 'Controlled internet access for visitors and contractors', 'Network Access', 'Active', 60),
('IoT Device Management', 'Automated onboarding and policy enforcement for IoT devices', 'Device Management', 'Active', 45),
('BYOD Policy Enforcement', 'Bring Your Own Device policy compliance and security', 'Policy', 'Active', 70),
('Contractor Access Control', 'Temporary access provisioning for external contractors', 'Access Control', 'Draft', 20);
