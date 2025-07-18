-- Execute database initialization
-- This script will be run to set up the database schema

-- First, run the main initialization script
\i scripts/init-database.sql

-- Then add authentication and additional features
\i scripts/add-auth-and-features.sql

-- Add use cases schema
\i scripts/add-use-cases-schema.sql

-- Finally, seed with sample data
\i scripts/seed-sample-data.sql

-- Verify the setup
SELECT 'Database initialization completed successfully' as status;

-- Check table counts
SELECT 
  'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 
  'sites' as table_name, COUNT(*) as record_count FROM sites
UNION ALL
SELECT 
  'vendors' as table_name, COUNT(*) as record_count FROM vendors
UNION ALL
SELECT 
  'device_types' as table_name, COUNT(*) as record_count FROM device_types
UNION ALL
SELECT 
  'checklist_items' as table_name, COUNT(*) as record_count FROM checklist_items
UNION ALL
SELECT 
  'use_cases' as table_name, COUNT(*) as record_count FROM use_cases;
