-- Create use cases table
CREATE TABLE IF NOT EXISTS use_cases (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
    priority VARCHAR(20) DEFAULT 'mandatory' CHECK (priority IN ('mandatory', 'optional', 'nice-to-have')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create test cases table
CREATE TABLE IF NOT EXISTS test_cases (
    id VARCHAR(50) PRIMARY KEY,
    use_case_id VARCHAR(50) REFERENCES use_cases(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    expected_outcome TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'failed')),
    actual_outcome TEXT,
    test_date DATE,
    tester_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create requirements table
CREATE TABLE IF NOT EXISTS requirements (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('functional', 'non-functional')),
    description TEXT NOT NULL,
    justification TEXT,
    status VARCHAR(20) DEFAULT 'not-met' CHECK (status IN ('met', 'not-met', 'partially-met')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create business objectives table
CREATE TABLE IF NOT EXISTS business_objectives (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    success_criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create documentation links table
CREATE TABLE IF NOT EXISTS documentation_links (
    id SERIAL PRIMARY KEY,
    use_case_id VARCHAR(50) REFERENCES use_cases(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create success criteria table
CREATE TABLE IF NOT EXISTS success_criteria (
    id SERIAL PRIMARY KEY,
    use_case_id VARCHAR(50) REFERENCES use_cases(id) ON DELETE CASCADE,
    criteria TEXT NOT NULL,
    is_met BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create use case requirements junction table
CREATE TABLE IF NOT EXISTS use_case_requirements (
    use_case_id VARCHAR(50) REFERENCES use_cases(id) ON DELETE CASCADE,
    requirement_id VARCHAR(50) REFERENCES requirements(id) ON DELETE CASCADE,
    PRIMARY KEY (use_case_id, requirement_id)
);

-- Create scoping questionnaire table
CREATE TABLE IF NOT EXISTS scoping_questionnaire (
    id SERIAL PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    
    -- Network Infrastructure
    total_sites INTEGER,
    total_users INTEGER,
    network_vendors JSONB, -- Array of vendor information
    switch_models JSONB,
    wireless_models JSONB,
    
    -- Identity Providers
    identity_providers JSONB, -- Entra ID, LDAP, etc.
    mdm_solutions JSONB, -- Intune, JAMF, etc.
    
    -- Security Solutions
    siem_solutions JSONB, -- Splunk, Sentinel, etc.
    mdr_solutions JSONB,
    xdr_solutions JSONB,
    edr_solutions JSONB,
    
    -- Authentication Requirements
    auth_methods JSONB, -- 802.1X, MAB, etc.
    certificate_requirements JSONB,
    guest_access_requirements JSONB,
    byod_requirements JSONB,
    
    -- Access Control Policies
    vlan_segmentation JSONB,
    access_policies JSONB,
    compliance_requirements JSONB,
    
    -- Risk Assessment
    risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    security_priorities JSONB,
    compliance_frameworks JSONB, -- SOX, HIPAA, PCI-DSS, etc.
    
    -- Timeline and Budget
    target_deployment_date DATE,
    budget_range VARCHAR(50),
    project_timeline_months INTEGER,
    
    -- Additional Requirements
    high_availability_required BOOLEAN DEFAULT FALSE,
    disaster_recovery_required BOOLEAN DEFAULT FALSE,
    multi_region_deployment BOOLEAN DEFAULT FALSE,
    
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed', 'approved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample use cases
INSERT INTO use_cases (id, title, subtitle, description, category, status, priority, completion_percentage) VALUES
('UC1', 'Certificate deployment and lifecycle management', 'Certificate Authority (CA) for Entra ID users and Intune managed endpoints', 'Demonstrate Portnox NAC''s built-in certificate authority (CA) to issue, manage, and revoke certificates for Entra ID users and Intune managed endpoints (Win 11)', 'cert-auth', 'completed', 'mandatory', 100),
('UC2.1', 'Corp Wifi Auth user certs', 'Managed Endpoints and Entra ID users Securely access Corporate SSID Access (Wi-Fi)', 'Demonstrate Portnox NAC''s with Meraki MR Wireless AP. Authenticate Entra ID users and Intune managed endpoints (Win 11) via 802.1X certificate-based authentication, ensuring only devices with valid, company-issued user certificates can connect to the corporate SSID.', 'cert-auth wifi', 'completed', 'mandatory', 100),
('UC2.2', 'Corp Wifi Auth machine certs', 'Managed Endpoints and Entra ID users Securely access Corporate SSID Access (Wi-Fi)', 'Demonstrate Portnox NAC''s with Meraki MR Wireless AP. Authenticate Entra ID users and Intune managed endpoints (Win 11) via 802.1X certificate-based authentication, ensuring only devices with valid, company-issued machine certificates can connect to the corporate SSID.', 'cert-auth wifi', 'completed', 'mandatory', 100),
('UC3.1', 'Corp Wired Auth user certs', 'Managed Endpoints and Entra ID users Securely access Corporate Wired Network', 'Demonstrate Portnox NAC''s with Meraki MS switches. Authenticate Entra ID users and Intune managed endpoints via 802.1X certificate-based authentication for wired network access using user certificates.', 'cert-auth wired', 'pending', 'mandatory', 0),
('UC3.2', 'Corp Wired Auth machine certs', 'Managed Endpoints and Entra ID users Securely access Corporate Wired Network', 'Demonstrate Portnox NAC''s with Meraki MS switches. Authenticate Entra ID users and Intune managed endpoints via 802.1X certificate-based authentication for wired network access using machine certificates.', 'cert-auth wired', 'pending', 'mandatory', 0),
('UC4', 'Guest Network Access', 'Secure guest onboarding and internet-only access', 'Implement secure guest access with self-registration portal, terms acceptance, and internet-only network segmentation.', 'guest', 'pending', 'mandatory', 0),
('UC5', 'BYOD Device Onboarding', 'Bring Your Own Device secure onboarding', 'Enable secure onboarding of personal devices with appropriate network segmentation and access controls.', 'byod', 'pending', 'mandatory', 0),
('UC6.1', 'Device Posture Assessment', 'Compliance checking for managed devices', 'Verify device compliance status including OS version, patch level, antivirus status, and encryption requirements.', 'compliance', 'pending', 'mandatory', 0),
('UC6.2', 'Remediation Workflows', 'Automated remediation for non-compliant devices', 'Implement automated workflows to remediate non-compliant devices or place them in quarantine networks.', 'compliance', 'pending', 'mandatory', 0),
('UC7.1', 'Dynamic VLAN Assignment', 'User and device-based VLAN assignment', 'Dynamically assign VLANs based on user identity, device type, and compliance status.', 'network-access', 'pending', 'mandatory', 0),
('UC7.2', 'Network Segmentation', 'Micro-segmentation based on identity', 'Implement network micro-segmentation policies based on user identity and device characteristics.', 'network-access', 'pending', 'mandatory', 0),
('UC8.1', 'Change of Authorization (CoA)', 'Dynamic policy enforcement', 'Demonstrate real-time policy changes and session updates using RADIUS CoA functionality.', 'security', 'pending', 'mandatory', 0),
('UC8.2', 'Rogue Device Detection', 'Identify and block unauthorized devices', 'Detect and automatically block rogue access points, switches, and unauthorized network devices.', 'security', 'pending', 'mandatory', 0),
('UC9', 'MAC Authentication Bypass', 'Support for non-802.1X devices', 'Enable network access for devices that do not support 802.1X authentication such as printers, IoT devices, and legacy systems.', 'legacy-support', 'pending', 'mandatory', 0),
('UC10', 'Multi-Factor Authentication', 'Enhanced authentication for high-risk scenarios', 'Implement MFA for high-risk users or devices accessing sensitive network segments.', 'security', 'pending', 'optional', 0),
('UC11', 'Integration with SIEM/SOAR', 'Security event correlation and response', 'Integrate authentication and authorization events with SIEM/SOAR platforms for security monitoring and automated response.', 'integration', 'pending', 'mandatory', 0),
('UC12', 'API Integration', 'Third-party system integration', 'Demonstrate API capabilities for integration with ticketing systems, CMDB, and other enterprise applications.', 'integration', 'pending', 'optional', 0),
('UC13', 'High Availability', 'Redundancy and failover capabilities', 'Verify high availability configuration with automatic failover and load balancing.', 'infrastructure', 'pending', 'mandatory', 0),
('UC14', 'Performance and Scalability', 'Load testing and performance validation', 'Validate system performance under load and scalability to support enterprise requirements.', 'infrastructure', 'pending', 'mandatory', 0),
('UC15', 'Reporting and Analytics', 'Comprehensive reporting capabilities', 'Generate detailed reports on authentication events, device compliance, and security posture.', 'reporting', 'pending', 'mandatory', 0),
('UC16', 'Radius Server/proxy', 'Radius Server/proxy capabilities', 'Verify HA and caching capabilities of radius server and verify secure communications from local radius to cloud instance TLS.', 'infrastructure', 'completed', 'mandatory', 100);

-- Insert sample test cases
INSERT INTO test_cases (id, use_case_id, name, description, expected_outcome, status) VALUES
('TC01', 'UC1', 'Deploy machine certificate to managed endpoint', 'Part of End User Compute (EUC) end point enrolment process when onboarding a new device with machine certificate', 'Endpoint enrolment connecting to guest/default network', 'completed'),
('TC02', 'UC1', 'Deploy user certificate to managed endpoint', 'Initial connection is to guest/default network to allow user logon to obtain a valid user certificate, once successfully logoned and received a valid user certificate.', 'Endpoint connect to correct network based on user profile', 'completed'),
('TC03.1', 'UC2.2', 'Expired/Revoked computer certificate to managed endpoint', 'Revoked machine cert or deployment a short term machine Cert to test expired cert', 'Endpoint will be placed in the guest/default network allowing support team to get the device recomply', 'in-progress'),
('TC03.2', 'UC2.2', 'Remediate machine certificate', 'End point re-complied with valid machine certificate', 'Endpoint connect to correct network based on user profile', 'pending'),
('TC04.1', 'UC2.1', 'Expired/Revoked user certificate to managed endpoint', 'Revoked user cert or deployment a short term user Cert test for expired cert', 'Endpoint will be placed in the guest/default network allowing support team to rectify user certificate', 'pending');

-- Insert sample requirements
INSERT INTO requirements (id, type, description, justification, status) VALUES
('FR-01', 'functional', 'Support 802.1X authentication for wired and wireless access', 'Ensures authenticated network access for corporate-managed devices', 'met'),
('FR-02', 'functional', 'Provide RADIUS server functionality with RADSec support', 'Enables secure, cloud-based authentication and integration with Meraki', 'met'),
('FR-03', 'functional', 'Issue and manage client certificates for users and/or devices', 'Enables secure, certificate-based device identification and trust', 'met'),
('FR-04', 'functional', 'Certificate solution must support SCEP and Intune MDM', 'Intune will be used to configure the client certificate profiles and authentication profiles', 'met'),
('FR-05', 'functional', 'Private PKI must support CDP Methods (CRL, OCSP)', 'Certificates need to be verified and checked against revocation protocols', 'met'),
('NFR-01', 'non-functional', '100% cloud-delivered and managed', 'Reduces on-premises infrastructure and enables scalability', 'met'),
('NFR-02', 'non-functional', 'High availability and resilience across global regions', 'Ensures reliable access control and avoids disruption', 'met'),
('NFR-03', 'non-functional', 'Scalable to support all global sites and user/device volumes', 'Supports global rollout without performance degradation', 'met');

-- Insert sample business objectives
INSERT INTO business_objectives (id, title, description, success_criteria) VALUES
('BO-1', 'Enforce Secure Access to the Network', 'Ensure that only authenticated and authorised users and devices can access corporate network resources, reducing the risk of unauthorised access, data breaches, and internal threats.', 'All network access requires authentication via 802.1X or appropriate alternative methods'),
('BO-2', 'Support a Zero Trust-Aligned Security Model', 'Lay the foundation for identity- and posture-based access policies that treat all devices and users as untrusted until verified, in line with Zero Trust principles.', 'Continuous verification of device posture and user identity'),
('BO-3', 'Improve Operational Efficiency', 'Reduce manual network access management tasks and streamline device onboarding processes.', 'Reduction in time spent on network access management by 50%');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_use_cases_category ON use_cases(category);
CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);
CREATE INDEX IF NOT EXISTS idx_test_cases_use_case_id ON test_cases(use_case_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_status ON test_cases(status);
CREATE INDEX IF NOT EXISTS idx_requirements_type ON requirements(type);
CREATE INDEX IF NOT EXISTS idx_documentation_links_use_case_id ON documentation_links(use_case_id);
CREATE INDEX IF NOT EXISTS idx_success_criteria_use_case_id ON success_criteria(use_case_id);
