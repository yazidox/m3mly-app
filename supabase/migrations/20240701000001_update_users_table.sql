-- Add new columns to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS cin TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT;

alter publication supabase_realtime add table users;
