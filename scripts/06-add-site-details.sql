-- Create a table for site-specific notes
CREATE TABLE IF NOT EXISTS site_notes (
    id SERIAL PRIMARY KEY,
    site_id VARCHAR(255) NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    user_name VARCHAR(255), -- Denormalized for easier display
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create a join table for site-specific checklist items status
CREATE TABLE IF NOT EXISTS site_checklist_items (
    site_id VARCHAR(255) NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
    checklist_item_id INTEGER NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (site_id, checklist_item_id)
);

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for site_checklist_items
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_timestamp_on_site_checklist_items') THEN
        CREATE TRIGGER set_timestamp_on_site_checklist_items
        BEFORE UPDATE ON site_checklist_items
        FOR EACH ROW
        EXECUTE PROCEDURE trigger_set_timestamp();
    END IF;
END
$$;

-- We can now insert all checklist items for a site upon its creation.
-- This can be handled by a trigger or application logic.
-- For existing sites, you might want to run a backfill script.
