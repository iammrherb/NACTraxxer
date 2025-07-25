-- Add a user_id column to associate projects with users
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add comprehensive fields for scoping, discovery, and implementation
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS project_goal TEXT,
ADD COLUMN IF NOT EXISTS in_scope TEXT,
ADD COLUMN IF NOT EXISTS out_of_scope TEXT,
ADD COLUMN IF NOT EXISTS estimated_users INTEGER,
ADD COLUMN IF NOT EXISTS estimated_devices INTEGER,
ADD COLUMN IF NOT EXISTS discovery_status TEXT NOT NULL DEFAULT 'Not Started' CHECK (discovery_status IN ('Not Started', 'In Progress', 'Completed')),
ADD COLUMN IF NOT EXISTS network_diagram_link TEXT,
ADD COLUMN IF NOT EXISTS key_personnel JSONB,
ADD COLUMN IF NOT EXISTS implementation_phase TEXT NOT NULL DEFAULT 'Phase 1' CHECK (implementation_phase IN ('Phase 1', 'Phase 2', 'Phase 3', 'Completed')),
ADD COLUMN IF NOT EXISTS planned_start_date DATE,
ADD COLUMN IF NOT EXISTS planned_end_date DATE;

-- Add comments for new columns for better documentation
COMMENT ON COLUMN public.projects.user_id IS 'The user who created or owns the project.';
COMMENT ON COLUMN public.projects.description IS 'A brief description of the project.';
COMMENT ON COLUMN public.projects.project_goal IS 'The primary objectives and goals of the project.';
COMMENT ON COLUMN public.projects.in_scope IS 'A detailed description of what is included in the project scope.';
COMMENT ON COLUMN public.projects.out_of_scope IS 'A detailed description of what is explicitly excluded from the project scope.';
COMMENT ON COLUMN public.projects.estimated_users IS 'The estimated number of users to be covered by the project.';
COMMENT ON COLUMN public.projects.estimated_devices IS 'The estimated number of devices to be covered by the project.';
COMMENT ON COLUMN public.projects.discovery_status IS 'The current status of the discovery phase.';
COMMENT ON COLUMN public.projects.network_diagram_link IS 'A URL link to the network architecture diagram.';
COMMENT ON COLUMN public.projects.key_personnel IS 'JSONB array of key contacts (e.g., [{name, role, email}]).';
COMMENT ON COLUMN public.projects.implementation_phase IS 'The current phase of the project implementation.';
COMMENT ON COLUMN public.projects.planned_start_date IS 'The planned start date for the project.';
COMMENT ON COLUMN public.projects.planned_end_date IS 'The planned completion date for the project.';
