-- Add updated_at column to applications table
ALTER TABLE applications
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_modtime
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

