-- Create a new ENUM type for user roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'viewer');

-- Add the 'role' column to the 'users' table
ALTER TABLE public.users
ADD COLUMN role user_role NOT NULL DEFAULT 'viewer';

-- Optional: Update an existing user to be an admin for testing
-- Make sure to replace 'user-id-to-make-admin' with an actual user ID from your users table.
-- You can get user IDs by running: SELECT id, email FROM auth.users;
-- UPDATE public.users
-- SET role = 'admin'
-- WHERE id = 'user-id-to-make-admin';
