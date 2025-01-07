-- Add a unique constraint to the tracking_id column
ALTER TABLE applications
ADD CONSTRAINT unique_tracking_id UNIQUE (tracking_id);

