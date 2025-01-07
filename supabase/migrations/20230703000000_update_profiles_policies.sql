-- Revoke all existing policies on the profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Enable RLS on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

-- Allow authenticated users to read all profiles
CREATE POLICY "Authenticated users can view all profiles" ON public.profiles
FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to manage all profiles
CREATE POLICY "Service role can manage all profiles" ON public.profiles
TO service_role
USING (true)
WITH CHECK (true);

