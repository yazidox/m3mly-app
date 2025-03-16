-- Add is_approved column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'is_approved') THEN
    ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- Update existing users to have is_approved set to true if they are admins
UPDATE users SET is_approved = TRUE WHERE role = 'admin';
