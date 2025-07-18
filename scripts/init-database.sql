-- Create the database schema for Portnox Deployment Tracker

-- Users table for project managers and technical owners
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('project_manager', 'technical_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sites table for deployment sites
CREATE TABLE IF NOT EXISTS sites (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('High', 'Medium', 'Low')),
    phase INTEGER NOT NULL,
    users_count INTEGER NOT NULL,
    project_manager_id INTEGER REFERENCES users(id),
    radsec VARCHAR(50) NOT NULL,
    planned_start DATE NOT NULL,
    planned_end DATE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('Planned', 'In Progress', 'Complete', 'Delayed')),
    completion_percent INTEGER DEFAULT 0 CHECK (completion_percent >= 0 AND completion_percent <= 100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site technical owners junction table
CREATE TABLE IF NOT EXISTS site_technical_owners (
    site_id VARCHAR(50) REFERENCES sites(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (site_id, user_id)
);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('wired', 'wireless')),
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site vendors junction table
CREATE TABLE IF NOT EXISTS site_vendors (
    site_id VARCHAR(50) REFERENCES sites(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    PRIMARY KEY (site_id, vendor_id)
);

-- Device types table
CREATE TABLE IF NOT EXISTS device_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site device types junction table
CREATE TABLE IF NOT EXISTS site_device_types (
    site_id VARCHAR(50) REFERENCES sites(id) ON DELETE CASCADE,
    device_type_id INTEGER REFERENCES device_types(id) ON DELETE CASCADE,
    PRIMARY KEY (site_id, device_type_id)
);

-- Checklist items table
CREATE TABLE IF NOT EXISTS checklist_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_custom BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site checklist junction table
CREATE TABLE IF NOT EXISTS site_checklist (
    site_id VARCHAR(50) REFERENCES sites(id) ON DELETE CASCADE,
    checklist_item_id INTEGER REFERENCES checklist_items(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    PRIMARY KEY (site_id, checklist_item_id)
);

-- Insert default users
INSERT INTO users (name, email, role, user_type) VALUES
('Alex Rivera', 'alex.rivera@example.com', 'Senior Project Manager', 'project_manager'),
('Marcus Chen', 'marcus.chen@example.com', 'Project Manager', 'project_manager'),
('Sofia Linden', 'sofia.linden@example.com', 'Project Manager', 'project_manager'),
('Michael Zhang', 'michael.zhang@example.com', 'Project Manager', 'project_manager'),
('Maria Rodriguez', 'maria.rodriguez@example.com', 'Senior Project Manager', 'project_manager'),
('James Wilson', 'james.wilson@example.com', 'Project Manager', 'project_manager'),
('John Smith', 'john.smith@example.com', 'Network Administrator', 'technical_owner'),
('Mark Wilson', 'mark.wilson@example.com', 'Security Engineer', 'technical_owner'),
('Emily Jones', 'emily.jones@example.com', 'Network Engineer', 'technical_owner'),
('Paul Davis', 'paul.davis@example.com', 'IT Manager', 'technical_owner'),
('Andreas Müller', 'andreas.muller@example.com', 'Network Administrator', 'technical_owner'),
('Lisa Schmidt', 'lisa.schmidt@example.com', 'Security Engineer', 'technical_owner'),
('Lee Wei', 'lee.wei@example.com', 'Network Engineer', 'technical_owner'),
('Akira Tanaka', 'akira.tanaka@example.com', 'System Administrator', 'technical_owner'),
('Sarah Thompson', 'sarah.thompson@example.com', 'IT Manager', 'technical_owner'),
('Carlos Mendez', 'carlos.mendez@example.com', 'Network Engineer', 'technical_owner'),
('Diego Ruiz', 'diego.ruiz@example.com', 'Security Engineer', 'technical_owner'),
('Jennifer Lee', 'jennifer.lee@example.com', 'Network Administrator', 'technical_owner');

-- Insert default vendors
INSERT INTO vendors (name, type) VALUES
-- Wired vendors
('Cisco', 'wired'),
('Juniper', 'wired'),
('Aruba', 'wired'),
('HPE', 'wired'),
('Extreme', 'wired'),
('Meraki', 'wired'),
('FortiGate', 'wired'),
('Palo Alto', 'wired'),
('Dell', 'wired'),
('Huawei', 'wired'),
('CheckPoint', 'wired'),
('Netgear', 'wired'),
('Allied Telesis', 'wired'),
-- Wireless vendors
('Cisco', 'wireless'),
('Aruba', 'wireless'),
('Juniper', 'wireless'),
('Extreme', 'wireless'),
('Meraki', 'wireless'),
('FortiGate', 'wireless'),
('Mist', 'wireless'),
('Ruckus', 'wireless'),
('Ubiquiti', 'wireless'),
('Cambium', 'wireless'),
('Huawei', 'wireless');

-- Insert default device types
INSERT INTO device_types (name) VALUES
('Windows'),
('Apple'),
('Mobile'),
('IoT'),
('Guest'),
('BYOD'),
('Linux'),
('Android');

-- Insert default checklist items
INSERT INTO checklist_items (name) VALUES
('Intune Deployed'),
('JAMF Deployed'),
('LRAD Deployed'),
('Native Deployed'),
('RADIUS Configured'),
('Switches Configured'),
('Wireless Configured'),
('MAB Configured'),
('Guest Access Ready'),
('Testing Complete');
