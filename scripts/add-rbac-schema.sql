-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Create user_roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by VARCHAR(255),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Create user_permissions table for direct permissions
CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    assigned_by VARCHAR(255),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    UNIQUE(user_id, permission_id)
);

-- Insert permissions
INSERT INTO permissions (name, description, category) VALUES
-- User Management
('users.view', 'View users', 'User Management'),
('users.create', 'Create new users', 'User Management'),
('users.update', 'Update user information', 'User Management'),
('users.delete', 'Delete users', 'User Management'),
('users.manage_roles', 'Assign roles to users', 'User Management'),

-- Site Management
('sites.view', 'View sites', 'Site Management'),
('sites.create', 'Create new sites', 'Site Management'),
('sites.update', 'Update site information', 'Site Management'),
('sites.delete', 'Delete sites', 'Site Management'),
('sites.manage_checklist', 'Manage site checklists', 'Site Management'),

-- Use Cases
('use_cases.view', 'View use cases', 'Use Cases'),
('use_cases.create', 'Create new use cases', 'Use Cases'),
('use_cases.update', 'Update use cases', 'Use Cases'),
('use_cases.delete', 'Delete use cases', 'Use Cases'),
('use_cases.validate', 'Validate use cases', 'Use Cases'),

-- Reporting
('reports.view', 'View reports', 'Reporting'),
('reports.create', 'Create custom reports', 'Reporting'),
('reports.export', 'Export reports', 'Reporting'),
('reports.schedule', 'Schedule automated reports', 'Reporting'),

-- Configuration
('config.view', 'View system configuration', 'Configuration'),
('config.update', 'Update system configuration', 'Configuration'),
('config.backup', 'Create system backups', 'Configuration'),
('config.restore', 'Restore from backups', 'Configuration'),

-- Files
('files.view', 'View files', 'Files'),
('files.upload', 'Upload files', 'Files'),
('files.download', 'Download files', 'Files'),
('files.delete', 'Delete files', 'Files'),

-- Notifications
('notifications.view', 'View notifications', 'Notifications'),
('notifications.create', 'Create notifications', 'Notifications'),
('notifications.manage', 'Manage notification settings', 'Notifications'),

-- System
('system.admin', 'Full system administration', 'System'),
('system.audit', 'View audit logs', 'System'),
('system.maintenance', 'Perform system maintenance', 'System'),

-- Architecture
('architecture.view', 'View architecture diagrams', 'Architecture'),
('architecture.edit', 'Edit architecture diagrams', 'Architecture'),

-- Scoping
('scoping.view', 'View scoping questionnaires', 'Scoping'),
('scoping.create', 'Create scoping questionnaires', 'Scoping'),
('scoping.update', 'Update scoping questionnaires', 'Scoping')
ON CONFLICT (name) DO NOTHING;

-- Insert system roles
INSERT INTO roles (name, description, is_system_role) VALUES
('Super Admin', 'Full system access with all permissions', true),
('Admin', 'Administrative access to most features', true),
('Project Manager', 'Project and site management capabilities', true),
('Technical Lead', 'Technical oversight and configuration access', true),
('Engineer', 'Implementation and technical task access', true),
('Analyst', 'Read-only access with reporting capabilities', true),
('Viewer', 'Basic read-only access to core features', true)
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to Super Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Super Admin'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Admin' AND p.name NOT IN ('system.admin', 'config.restore', 'users.delete')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Project Manager role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Project Manager' AND p.category IN ('Site Management', 'Use Cases', 'Reporting', 'Files', 'Scoping')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Technical Lead role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Technical Lead' AND p.category IN ('Site Management', 'Use Cases', 'Configuration', 'Architecture', 'Files', 'Scoping')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Engineer role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Engineer' AND p.name IN (
    'sites.view', 'sites.update', 'sites.manage_checklist',
    'use_cases.view', 'use_cases.update', 'use_cases.validate',
    'files.view', 'files.upload', 'files.download',
    'architecture.view', 'scoping.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Analyst role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Analyst' AND p.name LIKE '%.view' OR p.category = 'Reporting'
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Assign permissions to Viewer role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Viewer' AND p.name IN (
    'sites.view', 'use_cases.view', 'reports.view', 
    'files.view', 'architecture.view', 'scoping.view'
)
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);
