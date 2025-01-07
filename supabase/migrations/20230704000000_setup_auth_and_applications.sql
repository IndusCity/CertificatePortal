-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create applications table
CREATE TABLE public.applications (
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
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_applications_timestamp
BEFORE UPDATE ON public.applications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policies for applications table
CREATE POLICY "Users can view own applications" 
ON public.applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications" 
ON public.applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications" 
ON public.applications FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_applications_user_id ON public.applications(user_id);
CREATE INDEX idx_applications_status ON public.applications(status);

