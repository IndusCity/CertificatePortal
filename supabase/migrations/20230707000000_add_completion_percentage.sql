-- Add completion_percentage column to applications table
ALTER TABLE applications
ADD COLUMN completion_percentage INTEGER DEFAULT 0;

-- Update existing rows to calculate completion_percentage
-- This is a simplified version and might need adjustment based on your actual data
UPDATE applications
SET completion_percentage = (
  (CASE WHEN business_name IS NOT NULL AND business_name != '' THEN 1 ELSE 0 END) +
  (CASE WHEN business_type IS NOT NULL AND business_type != '' THEN 1 ELSE 0 END) +
  (CASE WHEN legal_name IS NOT NULL AND legal_name != '' THEN 1 ELSE 0 END) +
  (CASE WHEN physical_address IS NOT NULL AND physical_address != '' THEN 1 ELSE 0 END) +
  (CASE WHEN city IS NOT NULL AND city != '' THEN 1 ELSE 0 END) +
  (CASE WHEN state IS NOT NULL AND state != '' THEN 1 ELSE 0 END) +
  (CASE WHEN zip_code IS NOT NULL AND zip_code != '' THEN 1 ELSE 0 END) +
  (CASE WHEN business_phone IS NOT NULL AND business_phone != '' THEN 1 ELSE 0 END) +
  (CASE WHEN business_email IS NOT NULL AND business_email != '' THEN 1 ELSE 0 END) +
  (CASE WHEN contact_name IS NOT NULL AND contact_name != '' THEN 1 ELSE 0 END) +
  (CASE WHEN contact_title IS NOT NULL AND contact_title != '' THEN 1 ELSE 0 END) +
  (CASE WHEN certification_type IS NOT NULL AND array_length(certification_type, 1) > 0 THEN 1 ELSE 0 END)
) * 100 / 12;

