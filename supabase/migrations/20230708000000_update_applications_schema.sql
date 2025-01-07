-- Add new columns to the applications table
ALTER TABLE applications
ADD COLUMN business_establishment_year TEXT,
ADD COLUMN annual_receipts JSONB,
ADD COLUMN contacts JSONB[],
ADD COLUMN affiliates JSONB[],
ADD COLUMN general_submission_documents TEXT[],
ADD COLUMN business_financial_documents TEXT[],
ADD COLUMN personal_documents TEXT[],
ADD COLUMN business_operational_documents TEXT[],
ADD COLUMN corporate_organizational_documents TEXT[],
ADD COLUMN additional_documents TEXT[],
ADD COLUMN swam_business_formation_documents TEXT[],
ADD COLUMN swam_tax_documents TEXT[],
ADD COLUMN swam_employment_documents TEXT[],
ADD COLUMN swam_personal_documents TEXT[],
ADD COLUMN swam_additional_documents TEXT[];

-- Update the completion_percentage calculation function if needed
CREATE OR REPLACE FUNCTION calculate_completion_percentage(application_row applications)
RETURNS INTEGER AS $$
DECLARE
  total_fields INTEGER := 25; -- Update this number based on your new schema
  completed_fields INTEGER := 0;
BEGIN
  -- Add checks for new fields
  IF application_row.business_establishment_year IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF application_row.annual_receipts IS NOT NULL THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.contacts, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.affiliates, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  
  -- Add checks for document fields
  IF array_length(application_row.general_submission_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.business_financial_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.personal_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.business_operational_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.corporate_organizational_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.additional_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.swam_business_formation_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.swam_tax_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.swam_employment_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.swam_personal_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;
  IF array_length(application_row.swam_additional_documents, 1) > 0 THEN completed_fields := completed_fields + 1; END IF;

  -- Include existing field checks here

  RETURN (completed_fields::FLOAT / total_fields::FLOAT * 100)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger to use the new function
CREATE OR REPLACE TRIGGER update_completion_percentage
BEFORE INSERT OR UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION calculate_completion_percentage();

