-- Add assigned_user_id and due_date to the site-specific checklist items
ALTER TABLE public.site_checklist_items
ADD COLUMN assigned_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN due_date DATE;

-- Add comments for clarity
COMMENT ON COLUMN public.site_checklist_items.assigned_user_id IS 'The user assigned to this checklist item for a specific site.';
COMMENT ON COLUMN public.site_checklist_items.due_date IS 'The due date for this checklist item for a specific site.';

-- Also add a category to the base checklist_items table for better organization
ALTER TABLE public.checklist_items
ADD COLUMN category TEXT NOT NULL DEFAULT 'General';

COMMENT ON COLUMN public.checklist_items.category IS 'The category for the checklist item (e.g., Planning, Configuration, Testing).';
