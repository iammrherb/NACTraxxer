-- Drop existing tables if they exist
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS file_attachments CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS checklist_items CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS scoping_questionnaires CASCADE;
DROP TABLE IF EXISTS site_device_types CASCADE;
DROP TABLE IF EXISTS site_vendors CASCADE;
DROP TABLE IF EXISTS site_technical_owners CASCADE;
DROP TABLE IF EXISTS use_cases CASCADE;
DROP TABLE IF EXISTS device_types CASCADE;
DROP TABLE IF EXISTS vendors CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS reports CASCADE;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Viewer',
    department VARCHAR(100),
    phone VARCHAR(50),
    timezone VARCHAR(50) DEFAULT 'UTC',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create vendors table
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    website TEXT,
    description TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create device_types table
CREATE TABLE device_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    authentication_methods TEXT[],
    compliance_requirements TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sites table
CREATE TABLE sites (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    site_code VARCHAR(50) UNIQUE,
    region VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    priority VARCHAR(20) DEFAULT 'Medium',
    phase VARCHAR(50) DEFAULT 'Phase 1',
    users INTEGER DEFAULT 0,
    project_manager_id INTEGER REFERENCES users(id),
    project_manager VARCHAR(255),
    budget DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    radsec BOOLEAN DEFAULT false,
    planned_start DATE,
    planned_end DATE,
    actual_start DATE,
    actual_end DATE,
    status VARCHAR(50) DEFAULT 'Planning',
    completion_percent INTEGER DEFAULT 0,
    health_score INTEGER DEFAULT 100,
    risk_level VARCHAR(20) DEFAULT 'Low',
    notes TEXT,
    network_details JSONB DEFAULT '{}',
    security_requirements JSONB DEFAULT '{}',
    compliance_frameworks TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create use_cases table
CREATE TABLE use_cases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Draft',
    completion_percentage INTEGER DEFAULT 0,
    estimated_effort_hours INTEGER,
    actual_effort_hours INTEGER,
    business_value TEXT,
    technical_requirements TEXT,
    acceptance_criteria TEXT,
    test_scenarios TEXT,
    dependencies TEXT[],
    risks TEXT[],
    assigned_to INTEGER REFERENCES users(id),
    reviewer_id INTEGER REFERENCES users(id),
    start_date DATE,
    target_date DATE,
    completed_date DATE,
    tags TEXT[],
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create milestones table
CREATE TABLE milestones (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    milestone_type VARCHAR(100) DEFAULT 'Delivery',
    due_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) DEFAULT 'Pending',
    priority VARCHAR(20) DEFAULT 'Medium',
    assigned_to INTEGER REFERENCES users(id),
    dependencies TEXT[],
    deliverables TEXT[],
    success_criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create checklist_items table
CREATE TABLE checklist_items (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    use_case_id INTEGER REFERENCES use_cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    priority VARCHAR(20) DEFAULT 'Medium',
    completed BOOLEAN DEFAULT false,
    completed_by INTEGER REFERENCES users(id),
    completed_at TIMESTAMP,
    verification_required BOOLEAN DEFAULT false,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    notes TEXT,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create scoping_questionnaires table
CREATE TABLE scoping_questionnaires (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    questionnaire_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    submitted_by INTEGER REFERENCES users(id),
    submitted_at TIMESTAMP,
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    approval_status VARCHAR(50) DEFAULT 'Pending',
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info',
    priority VARCHAR(20) DEFAULT 'normal',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create file_attachments table
CREATE TABLE file_attachments (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    use_case_id INTEGER REFERENCES use_cases(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by INTEGER REFERENCES users(id) NOT NULL,
    description TEXT,
    tags TEXT[],
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create activity_logs table
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    entity_type VARCHAR(100) NOT NULL,
    entity_id INTEGER NOT NULL,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    parameters JSONB DEFAULT '{}',
    generated_by INTEGER REFERENCES users(id) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    filename VARCHAR(255),
    file_size BIGINT,
    status VARCHAR(50) DEFAULT 'generating',
    download_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP
);

-- Create junction tables
CREATE TABLE site_technical_owners (
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (site_id, user_id)
);

CREATE TABLE site_vendors (
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    vendor_type VARCHAR(50) DEFAULT 'Both',
    PRIMARY KEY (site_id, vendor_id)
);

CREATE TABLE site_device_types (
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    device_type_id INTEGER REFERENCES device_types(id) ON DELETE CASCADE,
    PRIMARY KEY (site_id, device_type_id)
);

-- Create indexes for better performance
CREATE INDEX idx_sites_status ON sites(status);
CREATE INDEX idx_sites_region ON sites(region);
CREATE INDEX idx_sites_priority ON sites(priority);
CREATE INDEX idx_sites_completion ON sites(completion_percent);
CREATE INDEX idx_use_cases_status ON use_cases(status);
CREATE INDEX idx_use_cases_category ON use_cases(category);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);

-- Insert sample data
INSERT INTO users (name, email, role, department, phone, timezone) VALUES
('John Smith', 'john.smith@company.com', 'Admin', 'IT Security', '+1-555-0101', 'America/New_York'),
('Sarah Johnson', 'sarah.johnson@company.com', 'Project Manager', 'IT Operations', '+1-555-0102', 'America/New_York'),
('Mike Chen', 'mike.chen@company.com', 'Technical Owner', 'Network Engineering', '+1-555-0103', 'America/Los_Angeles'),
('Emily Davis', 'emily.davis@company.com', 'Technical Owner', 'Security', '+1-555-0104', 'Europe/London'),
('David Wilson', 'david.wilson@company.com', 'Project Manager', 'IT Operations', '+1-555-0105', 'America/Chicago'),
('Lisa Anderson', 'lisa.anderson@company.com', 'Technical Owner', 'Infrastructure', '+1-555-0106', 'Asia/Tokyo'),
('Robert Brown', 'robert.brown@company.com', 'Viewer', 'Compliance', '+1-555-0107', 'America/New_York'),
('Jennifer Taylor', 'jennifer.taylor@company.com', 'Technical Owner', 'Network Security', '+1-555-0108', 'Europe/Berlin');

INSERT INTO vendors (name, type, contact_person, contact_email, website, description) VALUES
('Cisco Systems', 'Both', 'Tom Rodriguez', 'tom.rodriguez@cisco.com', 'https://cisco.com', 'Leading network infrastructure provider'),
('Aruba Networks', 'Wireless', 'Jane Mitchell', 'jane.mitchell@arubanetworks.com', 'https://arubanetworks.com', 'Enterprise wireless solutions'),
('Extreme Networks', 'Both', 'Mark Thompson', 'mark.thompson@extremenetworks.com', 'https://extremenetworks.com', 'Cloud-driven networking solutions'),
('Juniper Networks', 'Wired', 'Susan Lee', 'susan.lee@juniper.net', 'https://juniper.net', 'Secure, AI-driven networks'),
('Fortinet', 'Both', 'Carlos Mendez', 'carlos.mendez@fortinet.com', 'https://fortinet.com', 'Cybersecurity and networking'),
('Ruckus Networks', 'Wireless', 'Amy Zhang', 'amy.zhang@ruckusnetworks.com', 'https://ruckusnetworks.com', 'Wireless infrastructure solutions');

INSERT INTO device_types (name, category, description, authentication_methods, compliance_requirements) VALUES
('Windows Workstations', 'Endpoints', 'Corporate Windows desktop and laptop computers', ARRAY['802.1X', 'Certificate'], ARRAY['SOX', 'HIPAA']),
('macOS Devices', 'Endpoints', 'Apple Mac computers and laptops', ARRAY['802.1X', 'Certificate'], ARRAY['SOX', 'HIPAA']),
('iOS Devices', 'Mobile', 'iPhones and iPads', ARRAY['Certificate', 'MDM'], ARRAY['HIPAA', 'GDPR']),
('Android Devices', 'Mobile', 'Android smartphones and tablets', ARRAY['Certificate', 'MDM'], ARRAY['HIPAA', 'GDPR']),
('Linux Servers', 'Servers', 'Linux-based servers and workstations', ARRAY['802.1X', 'Certificate'], ARRAY['SOX', 'PCI-DSS']),
('IoT Sensors', 'IoT', 'Internet of Things sensors and devices', ARRAY['MAC Auth', 'Certificate'], ARRAY['IEC 62443']),
('IP Phones', 'VoIP', 'Voice over IP telephone systems', ARRAY['802.1X', 'MAC Auth'], ARRAY['SOX']),
('Printers', 'Peripherals', 'Network-connected printers and MFDs', ARRAY['MAC Auth', 'Certificate'], ARRAY['SOX']),
('Security Cameras', 'Security', 'IP-based security camera systems', ARRAY['MAC Auth', 'Certificate'], ARRAY['Physical Security']),
('Wireless Access Points', 'Infrastructure', 'Enterprise wireless access points', ARRAY['802.1X', 'Certificate'], ARRAY['SOX', 'PCI-DSS']);

INSERT INTO sites (name, site_code, region, country, city, priority, phase, users, project_manager, budget, radsec, planned_start, planned_end, status, completion_percent, health_score, risk_level, notes) VALUES
('New York Headquarters', 'NYC-HQ-001', 'North America', 'USA', 'New York', 'High', 'Phase 1', 1200, 'Sarah Johnson', 250000.00, true, '2024-01-15', '2024-03-30', 'Complete', 100, 95, 'Low', 'Primary headquarters deployment completed successfully'),
('London Office', 'LON-OFF-001', 'Europe', 'UK', 'London', 'High', 'Phase 1', 800, 'Emily Davis', 180000.00, true, '2024-02-01', '2024-04-15', 'In Progress', 75, 88, 'Medium', 'On track for completion'),
('Tokyo Branch', 'TKY-BR-001', 'Asia Pacific', 'Japan', 'Tokyo', 'Medium', 'Phase 2', 450, 'Lisa Anderson', 120000.00, false, '2024-03-01', '2024-05-15', 'Planning', 25, 92, 'Low', 'Waiting for local compliance approval'),
('Chicago Data Center', 'CHI-DC-001', 'North America', 'USA', 'Chicago', 'High', 'Phase 1', 200, 'David Wilson', 300000.00, true, '2024-01-20', '2024-04-10', 'Testing', 85, 90, 'Medium', 'Critical infrastructure deployment'),
('Berlin Office', 'BER-OFF-001', 'Europe', 'Germany', 'Berlin', 'Medium', 'Phase 2', 350, 'Emily Davis', 95000.00, true, '2024-04-01', '2024-06-30', 'Planning', 15, 85, 'High', 'GDPR compliance requirements'),
('Singapore Hub', 'SIN-HUB-001', 'Asia Pacific', 'Singapore', 'Singapore', 'High', 'Phase 1', 600, 'Lisa Anderson', 160000.00, true, '2024-02-15', '2024-05-01', 'In Progress', 60, 87, 'Medium', 'Regional hub for APAC operations'),
('Sydney Office', 'SYD-OFF-001', 'Asia Pacific', 'Australia', 'Sydney', 'Low', 'Phase 3', 280, 'Lisa Anderson', 85000.00, false, '2024-06-01', '2024-08-15', 'Scoping', 5, 95, 'Low', 'Future expansion site'),
('Toronto Branch', 'TOR-BR-001', 'North America', 'Canada', 'Toronto', 'Medium', 'Phase 2', 420, 'Sarah Johnson', 110000.00, true, '2024-03-15', '2024-06-01', 'Planning', 30, 90, 'Low', 'Canadian operations center');

INSERT INTO use_cases (title, subtitle, description, category, priority, status, completion_percentage, business_value, technical_requirements, assigned_to, start_date, target_date, tags) VALUES
('802.1X Wired Authentication', 'Certificate-based wired network access', 'Implement certificate-based 802.1X authentication for all wired network connections', 'Authentication', 'High', 'In Progress', 75, 'Improved security posture and compliance', 'PKI infrastructure, RADIUS server, switch configuration', 3, '2024-01-15', '2024-04-30', ARRAY['security', 'wired', '802.1x']),
('Wireless Guest Network', 'Secure guest network access', 'Deploy secure guest network with captive portal and time-limited access', 'WiFi', 'Medium', 'Completed', 100, 'Enhanced visitor experience while maintaining security', 'Guest VLAN, captive portal, bandwidth limiting', 4, '2024-01-01', '2024-03-15', ARRAY['wifi', 'guest', 'portal']),
('IoT Device Onboarding', 'Automated IoT device registration', 'Streamlined onboarding process for IoT devices with MAC-based authentication', 'IoT', 'High', 'In Progress', 60, 'Scalable IoT deployment with security controls', 'Device profiling, MAC authentication, VLAN assignment', 6, '2024-02-01', '2024-05-30', ARRAY['iot', 'automation', 'profiling']),
('BYOD Mobile Access', 'Bring Your Own Device support', 'Enable secure BYOD access with device compliance checking', 'Mobile', 'Medium', 'Planning', 25, 'Employee productivity and satisfaction', 'MDM integration, device compliance policies', 4, '2024-03-01', '2024-06-15', ARRAY['byod', 'mobile', 'compliance']),
('Network Segmentation', 'Micro-segmentation implementation', 'Implement network micro-segmentation based on device type and user role', 'Security', 'High', 'In Progress', 45, 'Reduced attack surface and improved compliance', 'Dynamic VLAN assignment, policy enforcement', 8, '2024-01-20', '2024-07-01', ARRAY['segmentation', 'security', 'policy']),
('Compliance Reporting', 'Automated compliance reporting', 'Generate automated reports for SOX, HIPAA, and PCI-DSS compliance', 'Compliance', 'High', 'Planning', 20, 'Reduced audit costs and improved compliance posture', 'Reporting engine, compliance templates', 7, '2024-04-01', '2024-08-30', ARRAY['compliance', 'reporting', 'audit']),
('VoIP Phone Integration', 'IP phone authentication', 'Integrate VoIP phones with NAC for secure voice communications', 'VoIP', 'Medium', 'Draft', 10, 'Secure voice communications', 'LLDP-MED, voice VLAN configuration', 3, '2024-05-01', '2024-07-15', ARRAY['voip', 'phones', 'voice']),
('Printer Security', 'Network printer protection', 'Secure network printers with authentication and access controls', 'Peripherals', 'Low', 'Draft', 5, 'Protected print infrastructure', 'Printer profiling, access control policies', 6, '2024-06-01', '2024-08-01', ARRAY['printers', 'peripherals', 'security']);

INSERT INTO milestones (site_id, title, description, milestone_type, due_date, status, priority, assigned_to, deliverables, success_criteria) VALUES
(2, 'Infrastructure Assessment Complete', 'Complete network infrastructure assessment and documentation', 'Assessment', '2024-03-15', 'Completed', 'High', 4, ARRAY['Network diagram', 'Device inventory', 'Security assessment'], 'All network devices documented and assessed'),
(2, 'RADIUS Server Deployment', 'Deploy and configure RADIUS servers for authentication', 'Deployment', '2024-04-01', 'In Progress', 'High', 4, ARRAY['RADIUS server installation', 'Configuration documentation', 'Testing results'], 'RADIUS servers operational and tested'),
(3, 'Compliance Review', 'Complete regulatory compliance review for Japanese operations', 'Compliance', '2024-03-30', 'Pending', 'Medium', 6, ARRAY['Compliance report', 'Risk assessment', 'Mitigation plan'], 'All compliance requirements identified and addressed'),
(4, 'Critical System Testing', 'Test NAC implementation on critical data center systems', 'Testing', '2024-04-05', 'In Progress', 'High', 5, ARRAY['Test plan', 'Test results', 'Performance metrics'], 'All critical systems tested without impact'),
(5, 'GDPR Compliance Validation', 'Validate GDPR compliance for European deployment', 'Compliance', '2024-05-15', 'Pending', 'High', 4, ARRAY['GDPR assessment', 'Privacy impact assessment', 'Compliance certification'], 'Full GDPR compliance achieved'),
(6, 'Regional Hub Go-Live', 'Complete Singapore hub deployment and go-live', 'Go-Live', '2024-04-25', 'Pending', 'High', 6, ARRAY['Deployment checklist', 'Go-live plan', 'Support documentation'], 'Singapore hub fully operational');

INSERT INTO checklist_items (site_id, title, description, category, priority, completed, verification_required) VALUES
(2, 'Network Discovery Complete', 'Complete network device discovery and inventory', 'Infrastructure', 'High', true, true),
(2, 'RADIUS Server Installed', 'Install and configure primary RADIUS server', 'Infrastructure', 'High', true, true),
(2, 'Switch Configuration Updated', 'Update all network switches with 802.1X configuration', 'Configuration', 'High', false, true),
(2, 'Certificate Authority Setup', 'Configure PKI infrastructure for certificate authentication', 'Security', 'High', true, true),
(3, 'Local Compliance Review', 'Complete local regulatory compliance assessment', 'Compliance', 'High', false, true),
(3, 'Network Architecture Design', 'Design network architecture for Tokyo deployment', 'Design', 'Medium', true, false),
(4, 'Backup Systems Tested', 'Test backup and failover systems', 'Testing', 'High', false, true),
(4, 'Performance Baseline', 'Establish performance baseline metrics', 'Testing', 'Medium', true, false),
(5, 'GDPR Impact Assessment', 'Complete GDPR privacy impact assessment', 'Compliance', 'High', false, true),
(6, 'User Training Materials', 'Prepare user training materials and documentation', 'Training', 'Medium', true, false);

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, priority) VALUES
(2, 'Milestone Overdue', 'The RADIUS Server Deployment milestone for London Office is overdue', 'warning', 'high'),
(4, 'Compliance Review Required', 'GDPR compliance review is required for Berlin Office deployment', 'info', 'normal'),
(6, 'Testing Phase Complete', 'Singapore Hub testing phase has been completed successfully', 'success', 'normal'),
(3, 'Configuration Update Needed', 'Network switch configuration needs to be updated for London Office', 'warning', 'normal'),
(5, 'New Site Added', 'Toronto Branch has been added to the deployment schedule', 'info', 'low');

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_device_types_updated_at BEFORE UPDATE ON device_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_use_cases_updated_at BEFORE UPDATE ON use_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_checklist_items_updated_at BEFORE UPDATE ON checklist_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scoping_questionnaires_updated_at BEFORE UPDATE ON scoping_questionnaires FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
