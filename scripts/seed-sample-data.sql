-- Clear existing data
TRUNCATE TABLE site_technical_owners, sites, users RESTART IDENTITY;

-- Insert sample users, avoiding conflicts if they already exist
INSERT INTO users (id, name, email, role, avatar) VALUES
('usr_1', 'Alex Rivera', 'alex.rivera@example.com', 'Project Manager', '/placeholder-user.jpg'),
('usr_2', 'Samantha Chen', 'samantha.chen@example.com', 'Engineer', '/placeholder-user.jpg'),
('usr_3', 'Marcus Wright', 'marcus.wright@example.com', 'Admin', '/placeholder-user.jpg'),
('usr_4', 'John Smith', 'john.smith@example.com', 'Engineer', '/placeholder-user.jpg'),
('usr_5', 'Priya Sharma', 'priya.sharma@example.com', 'Project Manager', '/placeholder-user.jpg'),
('usr_6', 'David Lee', 'david.lee@example.com', 'Engineer', '/placeholder-user.jpg')
ON CONFLICT (id) DO NOTHING;

-- Insert sample sites data
INSERT INTO sites (id, name, region, country, priority, phase, users_count, project_manager_id, radsec, planned_start, planned_end, status, completion_percent, notes, use_case_ids) VALUES
('HQ001', 'Global Headquarters', 'North America', 'USA', 'High', 'In Progress', 2500, 'usr_1', 'Yes', '2025-08-01', '2025-08-15', 'In Progress', 35, 'Executive network needs priority handling.', '["uc_1", "uc_3"]'),
('DC002', 'Primary Data Center', 'North America', 'USA', 'High', 'In Progress', 150, 'usr_1', 'Yes', '2025-08-05', '2025-08-12', 'In Progress', 65, '24/7 operation requires careful change windows.', '["uc_2"]'),
('EUR003', 'European HQ', 'EMEA', 'Germany', 'Medium', 'Scoping', 1200, 'usr_5', 'No', '2025-09-01', '2025-09-15', 'Planning', 0, 'GDPR compliance required.', '["uc_1", "uc_4"]'),
('APAC004', 'APAC Regional Office', 'APAC', 'Singapore', 'Medium', 'Planning', 800, 'usr_5', 'TBD', '2025-09-10', '2025-09-25', 'Planning', 0, 'Multi-tenant building with shared infrastructure.', '["uc_4"]'),
('SAT005', 'Satellite Office', 'North America', 'Canada', 'Low', 'Planning', 75, 'usr_1', 'Yes', '2025-10-01', '2025-10-05', 'Planning', 0, 'Limited IT support on-site.', '["uc_3"]'),
('MFG006', 'Manufacturing Plant', 'LATAM', 'Mexico', 'High', 'Complete', 450, 'usr_5', 'Yes', '2025-08-15', '2025-08-30', 'Complete', 100, 'Manufacturing floor required special considerations for IoT devices.', '["uc_1"]'),
('RD007', 'Research & Development', 'North America', 'USA', 'High', 'In Progress', 320, 'usr_6', 'Yes', '2025-08-03', '2025-08-20', 'In Progress', 55, 'Specialized lab equipment needs custom authentication.', '["uc_2"]'),
('RETAIL008', 'Flagship Retail Store', 'North America', 'USA', 'Medium', 'Planning', 85, 'usr_5', 'Yes', '2025-09-15', '2025-09-25', 'Planning', 0, 'POS systems and digital signage require special consideration.', '["uc_3"]'),
('EMEA009', 'Paris Office', 'EMEA', 'France', 'Medium', 'Planning', 375, 'usr_5', 'Yes', '2025-09-20', '2025-10-05', 'Planning', 0, 'Historic building with architectural limitations for AP placement.', '["uc_4"]'),
('EMEA010', 'London Office', 'EMEA', 'UK', 'High', 'Complete', 620, 'usr_1', 'Yes', '2025-08-10', '2025-08-28', 'Complete', 100, 'Site has high-security areas requiring special consideration.', '["uc_1"]'),
('APAC011', 'Tokyo Office', 'APAC', 'Japan', 'Medium', 'Planning', 425, 'usr_1', 'Yes', '2025-09-12', '2025-09-30', 'Planning', 0, 'Delayed due to local permitting issues.', '["uc_3"]'),
('DC012', 'Secondary Data Center', 'APAC', 'Australia', 'High', 'Complete', 120, 'usr_1', 'Yes', '2025-08-05', '2025-08-25', 'Complete', 100, 'Disaster recovery site with specialized redundancy requirements.', '["uc_2"]'),
('EU001', 'European Office', 'Europe', 'Germany', 'Medium', 'Complete', 800, 'usr_5', 'Yes', '2025-05-10', '2025-06-20', 'Complete', 100, 'Completed ahead of schedule.', '["uc_1"]'),
('AP001', 'Asia-Pacific Hub', 'APAC', 'Singapore', 'Medium', 'In Progress', 1200, 'usr_5', 'TBD', '2025-10-01', '2025-11-15', 'At Risk', 50, 'Supply chain delays for new APs.', '["uc_2", "uc_4"]')
ON CONFLICT (id) DO NOTHING;

-- Insert site technical owners relationships
INSERT INTO site_technical_owners (site_id, user_id) VALUES
('HQ001', 'usr_2'),
('HQ001', 'usr_4'),
('DC002', 'usr_6'),
('EUR003', 'usr_2'),
('AP001', 'usr_6');

-- Insert site vendors relationships (sample data)
INSERT INTO site_vendors (site_id, vendor_id) VALUES
('HQ001', 1), ('HQ001', 2), ('HQ001', 14), -- Cisco wired/wireless, Juniper wired
('DC002', 1), ('DC002', 15), -- Cisco wired, Aruba wireless
('EUR003', 4), ('EUR003', 14), -- HPE wired, Cisco wireless
('APAC004', 2), ('APAC004', 15), -- Juniper wired, Aruba wireless
('SAT005', 1), ('SAT005', 17), -- Cisco wired, Meraki wireless
('MFG006', 5), ('MFG006', 18), -- Extreme wired/wireless
('RD007', 1), ('RD007', 3), ('RD007', 14), ('RD007', 15), -- Cisco, Aruba wired/wireless
('RETAIL008', 6), ('RETAIL008', 17), -- Meraki wired/wireless
('EMEA009', 4), ('EMEA009', 1), ('EMEA009', 15), -- HPE, Cisco wired, Aruba wireless
('EMEA010', 1), ('EMEA010', 2), ('EMEA010', 14), -- Cisco, Juniper wired, Cisco wireless
('APAC011', 1), ('APAC011', 13), ('APAC011', 14), -- Cisco wired, Allied Telesis wired, Cisco wireless
('DC012', 1), ('DC012', 2), ('DC012', 14), -- Cisco, Juniper wired, Cisco wireless
('EU001', 1), ('EU001', 4), -- Cisco, HPE wired
('AP001', 2), ('AP001', 13); -- Juniper wired, Allied Telesis wired

-- Insert site device types relationships
INSERT INTO site_device_types (site_id, device_type_id) VALUES
('HQ001', 1), ('HQ001', 2), ('HQ001', 3), ('HQ001', 4), -- Windows, Apple, Mobile, IoT
('DC002', 1), ('DC002', 4), -- Windows, IoT
('EUR003', 1), ('EUR003', 2), ('EUR003', 3), -- Windows, Apple, Mobile
('APAC004', 1), ('APAC004', 2), ('APAC004', 3), -- Windows, Apple, Mobile
('SAT005', 1), ('SAT005', 3), -- Windows, Mobile
('MFG006', 1), ('MFG006', 4), -- Windows, IoT
('RD007', 1), ('RD007', 2), ('RD007', 7), ('RD007', 4), -- Windows, Apple, Linux, IoT
('RETAIL008', 1), ('RETAIL008', 2), ('RETAIL008', 3), ('RETAIL008', 4), -- Windows, Apple, Mobile, IoT
('EMEA009', 1), ('EMEA009', 2), ('EMEA009', 3), -- Windows, Apple, Mobile
('EMEA010', 1), ('EMEA010', 2), ('EMEA010', 3), ('EMEA010', 6), -- Windows, Apple, Mobile, BYOD
('APAC011', 1), ('APAC011', 2), ('APAC011', 3), -- Windows, Apple, Mobile
('DC012', 1), ('DC012', 7), ('DC012', 4), -- Windows, Linux, IoT
('EU001', 1), ('EU001', 2), ('EU001', 3), -- Windows, Apple, Mobile
('AP001', 1), ('AP001', 2), ('AP001', 3); -- Windows, Apple, Mobile

-- Insert completed checklist items for sites
INSERT INTO site_checklist (site_id, checklist_item_id, completed, completed_at) VALUES
-- HQ001 (In Progress - 35%)
('HQ001', 1, true, '2025-08-02'), -- Intune
('HQ001', 2, true, '2025-08-03'), -- JAMF
('HQ001', 4, true, '2025-08-04'), -- Native

-- DC002 (In Progress - 65%)
('DC002', 3, true, '2025-08-06'), -- LRAD
('DC002', 5, true, '2025-08-07'), -- RADIUS
('DC002', 6, true, '2025-08-08'), -- Switches
('DC002', 8, true, '2025-08-09'), -- MAB

-- MFG006 (Complete - 100%)
('MFG006', 1, true, '2025-08-16'), -- Intune
('MFG006', 4, true, '2025-08-17'), -- Native
('MFG006', 5, true, '2025-08-18'), -- RADIUS
('MFG006', 6, true, '2025-08-19'), -- Switches
('MFG006', 7, true, '2025-08-20'), -- Wireless
('MFG006', 8, true, '2025-08-21'), -- MAB
('MFG006', 9, true, '2025-08-22'), -- Guest
('MFG006', 10, true, '2025-08-23'), -- Testing

-- RD007 (In Progress - 55%)
('RD007', 1, true, '2025-08-04'), -- Intune
('RD007', 3, true, '2025-08-05'), -- LRAD
('RD007', 5, true, '2025-08-06'), -- RADIUS
('RD007', 6, true, '2025-08-07'), -- Switches

-- EMEA010 (Complete - 100%)
('EMEA010', 1, true, '2025-08-11'), -- Intune
('EMEA010', 2, true, '2025-08-12'), -- JAMF
('EMEA010', 3, true, '2025-08-13'), -- LRAD
('EMEA010', 5, true, '2025-08-14'), -- RADIUS
('EMEA010', 6, true, '2025-08-15'), -- Switches
('EMEA010', 7, true, '2025-08-16'), -- Wireless
('EMEA010', 8, true, '2025-08-17'), -- MAB
('EMEA010', 9, true, '2025-08-18'), -- Guest
('EMEA010', 10, true, '2025-08-19'), -- Testing

-- DC012 (Complete - 100%)
('DC012', 3, true, '2025-08-06'), -- LRAD
('DC012', 5, true, '2025-08-07'), -- RADIUS
('DC012', 6, true, '2025-08-08'), -- Switches
('DC012', 7, true, '2025-08-09'), -- Wireless
('DC012', 8, true, '2025-08-10'), -- MAB
('DC012', 10, true, '2025-08-11'), -- Testing

-- EU001 (Completed - 100%)
('EU001', 1, true, '2025-06-15'), -- Intune
('EU001', 2, true, '2025-06-16'), -- JAMF
('EU001', 4, true, '2025-06-17'), -- Native

-- AP001 (In Progress - 50%)
('AP001', 3, true, '2025-10-05'), -- LRAD
('AP001', 5, true, '2025-10-06'), -- RADIUS
('AP001', 6, true, '2025-10-07'); -- Switches
