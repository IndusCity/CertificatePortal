-- Revoke all existing policies on the profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;

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

-- Allow users to read all profiles (adjust if this is not desired)
CREATE POLICY "Users can view all profiles" ON public.profiles
FOR SELECT USING (true);

