-- Alter the reports table to use a URL for storage instead of a local file path
-- and add a filename for downloads.
ALTER TABLE reports RENAME COLUMN file_path TO url;
ALTER TABLE reports ADD COLUMN filename VARCHAR(255);

-- Backfill existing reports with a placeholder filename if any exist
UPDATE reports SET filename = 'report.pdf' WHERE filename IS NULL;

-- Make the new filename column non-null
ALTER TABLE reports ALTER COLUMN filename SET NOT NULL;
