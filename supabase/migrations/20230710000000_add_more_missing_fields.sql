-- Add missing fields to the applications table
ALTER TABLE applications
ADD COLUMN naics_codes JSONB[],
ADD COLUMN business_establishment_year TEXT,
ADD COLUMN annual_receipts JSONB,
ADD COLUMN owners_have_10pct_ownership_in_other_firms BOOLEAN,
ADD COLUMN has_ein BOOLEAN,
ADD COLUMN is_mailing_same_as_physical BOOLEAN,
ADD COLUMN receive_marketing_emails BOOLEAN,
ADD COLUMN tax_identification_type TEXT;

-- Update the completion_percentage calculation function
CREATE OR REPLACE FUNCTION calculate_completion_percentage(application_row applications)
RETURNS INTEGER AS $$
DECLARE
  total_fields INTEGER := 48; -- Update this number based on your new schema
  completed_fields INTEGER := 0;
BEGIN
  -- Add checks for new fields
  IF array_length(application_row.naics_codes, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.business_establishment_year IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.annual_receipts IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.owners_have_10pct_ownership_in_other_firms IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.has_ein IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.is_mailing_same_as_physical IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.receive_marketing_emails IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.tax_identification_type IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;

  -- Include existing field checks here
  -- ... (keep all the checks from the previous function)

  RETURN (completed_fields::FLOAT / total_fields::FLOAT * 100)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger to use the new function
DROP TRIGGER IF EXISTS update_completion_percentage ON applications;
CREATE TRIGGER update_completion_percentage
BEFORE INSERT OR UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION calculate_completion_percentage();

