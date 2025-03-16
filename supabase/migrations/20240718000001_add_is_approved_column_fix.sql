-- Add is_approved column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_approved') THEN
    ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Update existing users to have is_approved set to true if they are admins or factory owners
UPDATE users 
SET is_approved = true 
WHERE role IN ('admin', 'factory_owner');

-- Enable realtime for users table
alter publication supabase_realtime add table users;