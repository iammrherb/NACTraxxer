-- Drop existing tables if they exist to recreate with correct schema
DROP TABLE IF EXISTS test_cases CASCADE;
DROP TABLE IF EXISTS documentation_links CASCADE;
DROP TABLE IF EXISTS success_criteria CASCADE;
DROP TABLE IF EXISTS use_case_requirements CASCADE;
DROP TABLE IF EXISTS requirements CASCADE;
DROP TABLE IF EXISTS use_cases CASCADE;

-- Create use_cases table
CREATE TABLE IF NOT EXISTS use_cases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
    priority VARCHAR(20) DEFAULT 'optional' CHECK (priority IN ('mandatory', 'optional', 'nice-to-have')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create test_cases table with proper foreign key
CREATE TABLE IF NOT EXISTS test_cases (
    id SERIAL PRIMARY KEY,
    use_case_id VARCHAR(50) NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    expected_outcome TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
    actual_outcome TEXT,
    test_date TIMESTAMP,
    tester_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create requirements table
CREATE TABLE IF NOT EXISTS requirements (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('functional', 'non-functional')),
    description TEXT NOT NULL,
    justification TEXT,
    status VARCHAR(20) DEFAULT 'not-met' CHECK (status IN ('met', 'not-met', 'partially-met')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create use_case_requirements junction table
CREATE TABLE IF NOT EXISTS use_case_requirements (
    id SERIAL PRIMARY KEY,
    use_case_id VARCHAR(50) NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
    requirement_id INTEGER NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(use_case_id, requirement_id)
);

-- Create documentation_links table
CREATE TABLE IF NOT EXISTS documentation_links (
    id SERIAL PRIMARY KEY,
    use_case_id VARCHAR(50) NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create success_criteria table
CREATE TABLE IF NOT EXISTS success_criteria (
    id SERIAL PRIMARY KEY,
    use_case_id VARCHAR(50) NOT NULL REFERENCES use_cases(id) ON DELETE CASCADE,
    criteria TEXT NOT NULL,
    is_met BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample use cases
INSERT INTO use_cases (id, title, subtitle, description, category, status, priority, completion_percentage, notes) VALUES
('UC-001', 'Certificate-based Authentication', 'WiFi 802.1X with Digital Certificates', 'Implement and test certificate-based authentication for WiFi networks using 802.1X protocol with digital certificates issued by internal CA.', 'cert-auth-wifi', 'pending', 'mandatory', 0, 'Critical for secure wireless access'),
('UC-002', 'Wired Network Authentication', '802.1X for Ethernet Connections', 'Configure and validate 802.1X authentication for wired Ethernet connections using certificate-based authentication.', 'cert-auth-wired', 'pending', 'mandatory', 0, 'Required for secure wired access'),
('UC-003', 'Guest Network Isolation', 'Captive Portal with Network Segmentation', 'Implement guest network with captive portal authentication and proper network segmentation from corporate resources.', 'wifi-guest', 'pending', 'optional', 0, 'Important for visitor access'),
('UC-004', 'Device Compliance Checking', 'Automated Device Health Assessment', 'Implement automated device compliance checking including OS version, patch level, and security software status.', 'compliance-device', 'pending', 'mandatory', 0, 'Critical for security posture'),
('UC-005', 'Network Access Control', 'Dynamic VLAN Assignment', 'Configure dynamic VLAN assignment based on user identity, device type, and compliance status.', 'security-vlan', 'pending', 'mandatory', 0, 'Essential for network segmentation');

-- Insert sample test cases
INSERT INTO test_cases (use_case_id, name, description, expected_outcome, status) VALUES
('UC-001', 'Certificate Installation Test', 'Test automatic certificate installation on Windows domain-joined devices', 'Certificate should be automatically installed and available for 802.1X authentication', 'pending'),
('UC-001', 'WiFi Authentication Test', 'Test WiFi connection using installed certificate', 'Device should successfully authenticate and connect to corporate WiFi', 'pending'),
('UC-002', 'Wired Port Authentication', 'Test 802.1X authentication on wired Ethernet port', 'Device should authenticate and gain network access on wired connection', 'pending'),
('UC-003', 'Guest Portal Access', 'Test guest captive portal functionality', 'Guest users should be redirected to portal and gain limited network access after authentication', 'pending'),
('UC-004', 'Compliance Check - Compliant Device', 'Test network access for fully compliant device', 'Compliant device should gain full network access', 'pending'),
('UC-004', 'Compliance Check - Non-compliant Device', 'Test network access for non-compliant device', 'Non-compliant device should be quarantined or denied access', 'pending');

-- Insert sample requirements
INSERT INTO requirements (type, description, justification, status) VALUES
('functional', 'Support for Windows 10/11 certificate-based authentication', 'Primary desktop OS in organization', 'not-met'),
('functional', 'Support for macOS certificate-based authentication', 'Executive and design team devices', 'not-met'),
('functional', 'Support for iOS/Android certificate-based authentication', 'Mobile device support required', 'not-met'),
('non-functional', 'Authentication response time under 5 seconds', 'User experience requirement', 'not-met'),
('functional', 'Integration with Active Directory for user authentication', 'Existing identity infrastructure', 'not-met'),
('functional', 'Automatic certificate renewal and deployment', 'Operational efficiency requirement', 'not-met');

-- Link requirements to use cases
INSERT INTO use_case_requirements (use_case_id, requirement_id) VALUES
('UC-001', 1), ('UC-001', 2), ('UC-001', 3), ('UC-001', 4), ('UC-001', 5),
('UC-002', 1), ('UC-002', 2), ('UC-002', 4), ('UC-002', 5),
('UC-004', 1), ('UC-004', 2), ('UC-004', 3),
('UC-005', 4), ('UC-005', 5);

-- Insert sample documentation links
INSERT INTO documentation_links (use_case_id, title, url, description) VALUES
('UC-001', 'Portnox 802.1X Configuration Guide', 'https://docs.portnox.com/802.1x-setup', 'Official documentation for 802.1X setup'),
('UC-001', 'Certificate Authority Setup', 'https://docs.portnox.com/ca-setup', 'Guide for setting up internal CA'),
('UC-002', 'Wired Network Configuration', 'https://docs.portnox.com/wired-config', 'Wired network authentication setup'),
('UC-003', 'Guest Network Best Practices', 'https://docs.portnox.com/guest-network', 'Guest network implementation guide'),
('UC-004', 'Device Compliance Policies', 'https://docs.portnox.com/compliance', 'Device compliance configuration guide');

-- Insert sample success criteria
INSERT INTO success_criteria (use_case_id, criteria, is_met) VALUES
('UC-001', 'Certificate automatically deployed to domain-joined Windows devices', false),
('UC-001', 'WiFi authentication completes within 5 seconds', false),
('UC-001', 'No user intervention required for certificate-based authentication', false),
('UC-002', 'Wired authentication works on all configured switch ports', false),
('UC-002', 'Authentication failure triggers appropriate remediation workflow', false),
('UC-003', 'Guest users can access internet but not corporate resources', false),
('UC-003', 'Guest session automatically expires after configured time', false),
('UC-004', 'Non-compliant devices are automatically quarantined', false),
('UC-004', 'Compliance status is updated in real-time', false),
('UC-005', 'VLAN assignment based on user role and device compliance', false);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_test_cases_use_case_id ON test_cases(use_case_id);
CREATE INDEX IF NOT EXISTS idx_documentation_links_use_case_id ON documentation_links(use_case_id);
CREATE INDEX IF NOT EXISTS idx_success_criteria_use_case_id ON success_criteria(use_case_id);
CREATE INDEX IF NOT EXISTS idx_use_case_requirements_use_case_id ON use_case_requirements(use_case_id);
CREATE INDEX IF NOT EXISTS idx_use_case_requirements_requirement_id ON use_case_requirements(requirement_id);
