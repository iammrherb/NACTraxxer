-- Insert sample sites data
INSERT INTO sites (id, name, region, country, priority, phase, users_count, project_manager_id, radsec, planned_start, planned_end, status, completion_percent, notes) VALUES
('HQ001', 'Global Headquarters', 'North America', 'USA', 'High', 1, 2500, 1, 'Native', '2025-08-01', '2025-08-15', 'In Progress', 35, 'Executive network needs priority handling. CEO office requires special consideration for seamless connectivity during international calls. Boardroom has custom AV equipment that needs network access.'),
('DC002', 'Primary Data Center', 'North America', 'USA', 'High', 1, 150, 2, 'LRAD', '2025-08-05', '2025-08-12', 'In Progress', 65, '24/7 operation requires careful change windows. Critical services must not be disrupted. Server authentication will require special consideration.'),
('EUR003', 'European HQ', 'EMEA', 'Germany', 'Medium', 2, 1200, 3, 'Native', '2025-09-01', '2025-09-15', 'Planned', 0, 'GDPR compliance required. Special attention to privacy notices for guest access. Works council approval may be needed for certain policies.'),
('APAC004', 'APAC Regional Office', 'APAC', 'Singapore', 'Medium', 2, 800, 4, 'LRAD', '2025-09-10', '2025-09-25', 'Planned', 0, 'Multi-tenant building with shared infrastructure. Need to coordinate with building management for certain network changes.'),
('SAT005', 'Satellite Office', 'North America', 'Canada', 'Low', 3, 75, 1, 'Native', '2025-10-01', '2025-10-05', 'Planned', 0, 'Limited IT support on-site. Will need remote implementation assistance. VPN connectivity may impact RADIUS traffic.'),
('MFG006', 'Manufacturing Plant', 'LATAM', 'Mexico', 'High', 1, 450, 5, 'Native', '2025-08-15', '2025-08-30', 'Complete', 100, 'Manufacturing floor required special considerations for IoT devices. Implemented using certificates for device authentication. Project completed ahead of schedule.'),
('RD007', 'Research & Development', 'North America', 'USA', 'High', 1, 320, 6, 'LRAD', '2025-08-03', '2025-08-20', 'In Progress', 55, 'Specialized lab equipment needs custom authentication. Research data security is a top priority. Separate network segment for classified projects.'),
('RETAIL008', 'Flagship Retail Store', 'North America', 'USA', 'Medium', 2, 85, 3, 'Native', '2025-09-15', '2025-09-25', 'Planned', 0, 'POS systems and digital signage require special consideration. Customer guest Wi-Fi will be segmented from corporate. Peak holiday season deployment constraints.'),
('EMEA009', 'Paris Office', 'EMEA', 'France', 'Medium', 2, 375, 5, 'Native', '2025-09-20', '2025-10-05', 'Planned', 0, 'Historic building with architectural limitations for AP placement. Local compliance requirements must be addressed.'),
('EMEA010', 'London Office', 'EMEA', 'UK', 'High', 1, 620, 2, 'LRAD', '2025-08-10', '2025-08-28', 'Complete', 100, 'Site has high-security areas requiring special consideration. UK compliance requirements implemented successfully.'),
('APAC011', 'Tokyo Office', 'APAC', 'Japan', 'Medium', 2, 425, 1, 'Native', '2025-09-12', '2025-09-30', 'Delayed', 0, 'Delayed due to local permitting issues. New timeline being negotiated with building management.'),
('DC012', 'Secondary Data Center', 'APAC', 'Australia', 'High', 1, 120, 4, 'LRAD', '2025-08-05', '2025-08-25', 'Complete', 100, 'Disaster recovery site with specialized redundancy requirements. All critical systems verified and tested.');

-- Insert site technical owners relationships
INSERT INTO site_technical_owners (site_id, user_id) VALUES
('HQ001', 7), ('HQ001', 8),
('DC002', 9), ('DC002', 10),
('EUR003', 11), ('EUR003', 12),
('APAC004', 13), ('APAC004', 14),
('SAT005', 15),
('MFG006', 16), ('MFG006', 17),
('RD007', 18), ('RD007', 10),
('RETAIL008', 15),
('EMEA009', 12), ('EMEA009', 7),
('EMEA010', 8), ('EMEA010', 18),
('APAC011', 14), ('APAC011', 13),
('DC012', 16), ('DC012', 9);

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
('DC012', 1), ('DC012', 2), ('DC012', 14); -- Cisco, Juniper wired, Cisco wireless

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
('DC012', 1), ('DC012', 7), ('DC012', 4); -- Windows, Linux, IoT

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
('DC012', 10, true, '2025-08-11'); -- Testing
