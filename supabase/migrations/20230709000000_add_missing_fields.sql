-- Add missing fields to the applications table
ALTER TABLE applications
ADD COLUMN designations TEXT[],
ADD COLUMN country TEXT,
ADD COLUMN website TEXT,
ADD COLUMN fiscal_year_end TEXT,
ADD COLUMN ownership_structure TEXT,
ADD COLUMN owners JSONB[],
ADD COLUMN corporation_info JSONB,
ADD COLUMN llc_info JSONB,
ADD COLUMN geographic_marketing_areas TEXT[],
ADD COLUMN accepts_charge_cards BOOLEAN,
ADD COLUMN is_confidential BOOLEAN,
ADD COLUMN confidentiality_reason TEXT,
ADD COLUMN affidavit_agreement BOOLEAN,
ADD COLUMN signature_name TEXT,
ADD COLUMN signature_date DATE,
ADD COLUMN signature_title TEXT;

-- Create a new documents table for more detailed document tracking
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID REFERENCES applications(id),
  document_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update the completion_percentage calculation function
CREATE OR REPLACE FUNCTION calculate_completion_percentage(application_row applications)
RETURNS INTEGER AS $$
DECLARE
  total_fields INTEGER := 40; -- Update this number based on your new schema
  completed_fields INTEGER := 0;
BEGIN
  -- Add checks for new fields
  IF array_length(application_row.designations, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.country IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.website IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.fiscal_year_end IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.ownership_structure IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.owners, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.corporation_info IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.llc_info IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.geographic_marketing_areas, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.accepts_charge_cards IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.is_confidential IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.confidentiality_reason IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.affidavit_agreement IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.signature_name IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.signature_date IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.signature_title IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;

  -- Include existing field checks here

  RETURN (completed_fields::FLOAT / total_fields::FLOAT * 100)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS update_completion_percentage ON applications;
CREATE TRIGGER update_completion_percentage
BEFORE INSERT OR UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION calculate_completion_percentage();

