-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT NOT NULL,
    legal_name TEXT,
    trade_name TEXT,
    federal_ein TEXT,
    ssn TEXT,
    physical_address TEXT,
    mailing_address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    business_phone TEXT,
    business_fax TEXT,
    business_email TEXT,
    contact_name TEXT,
    contact_title TEXT,
    website TEXT,
    is_franchise BOOLEAN,
    is_registered_eva BOOLEAN,
    is_registered_va_scc BOOLEAN,
    receive_marketing_emails BOOLEAN,
    certification_type TEXT[] NOT NULL,
    status TEXT DEFAULT 'pending',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update timestamps
CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_applications_timestamp
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for applications table
CREATE POLICY "Users can view own applications" 
ON applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" 
ON applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" 
ON applications FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for documents table
CREATE POLICY "Users can view own documents" 
ON documents FOR SELECT 
USING (auth.uid() = (SELECT user_id FROM applications WHERE id = documents.application_id));

CREATE POLICY "Users can insert own documents" 
ON documents FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM applications WHERE applications.id = application_id));

CREATE POLICY "Users can update own documents" 
ON documents FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM applications WHERE id = documents.application_id));

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_documents_application_id ON documents(application_id);

-- Insert some initial data for testing
INSERT INTO auth.users (id, email)
VALUES 
  ('d7bed83c-e12f-4923-cba9-bf857c0f34f1', 'test1@example.com'),
  ('c82e5c3d-8c08-4d5b-9653-35e0a7c4f1d2', 'test2@example.com');

INSERT INTO profiles (user_id, full_name, username, email)
VALUES
  ('d7bed83c-e12f-4923-cba9-bf857c0f34f1', 'Test User 1', 'testuser1', 'test1@example.com'),
  ('c82e5c3d-8c08-4d5b-9653-35e0a7c4f1d2', 'Test User 2', 'testuser2', 'test2@example.com');

INSERT INTO applications (user_id, business_name, business_type, certification_type, status)
VALUES
  ('d7bed83c-e12f-4923-cba9-bf857c0f34f1', 'Test Business 1', 'LLC', ARRAY['SWaM', 'DBE'], 'pending'),
  ('c82e5c3d-8c08-4d5b-9653-35e0a7c4f1d2', 'Test Business 2', 'Corporation', ARRAY['SWaM'], 'approved');

-- Note: In a real-world scenario, you wouldn't insert documents this way.
-- Documents would typically be uploaded through your application.
INSERT INTO documents (application_id, document_type, file_name, file_url)
VALUES
  ((SELECT id FROM applications WHERE business_name = 'Test Business 1'), 'Business License', 'license.pdf', 'https://example.com/license.pdf'),
  ((SELECT id FROM applications WHERE business_name = 'Test Business 2'), 'Tax Return', 'tax_return.pdf', 'https://example.com/tax_return.pdf');

