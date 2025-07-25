-- Enable pgcrypto extension if not already enabled, for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create the projects table
-- This table will store high-level information about each NAC project.
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    customer TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Planning' CHECK (status IN ('Planning', 'Active', 'Completed')),
    settings JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a reusable function to update the 'updated_at' timestamp on row changes
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the projects table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Add comments to the table and columns for better documentation
COMMENT ON TABLE public.projects IS 'Stores high-level information for each NAC design and deployment project.';
COMMENT ON COLUMN public.projects.id IS 'Unique identifier for the project.';
COMMENT ON COLUMN public.projects.name IS 'The name of the project.';
COMMENT ON COLUMN public.projects.customer IS 'The customer for whom the project is being done.';
COMMENT ON COLUMN public.projects.status IS 'Current status of the project (e.g., Planning, Active, Completed).';
COMMENT ON COLUMN public.projects.settings IS 'JSONB column to store project-specific settings.';
COMMENT ON COLUMN public.projects.created_at IS 'Timestamp of when the project was created.';
COMMENT ON COLUMN public.projects.updated_at IS 'Timestamp of when the project was last updated.';
