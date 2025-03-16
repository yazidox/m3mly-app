-- Add store_name column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS store_name TEXT;

-- Add is_approved column to users table with default false
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;

-- Update auth.users to include store_name in raw_user_meta_data
CREATE OR REPLACE FUNCTION update_auth_users_store_name()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('store_name', NEW.store_name)
      ELSE 
        raw_user_meta_data || jsonb_build_object('store_name', NEW.store_name)
    END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update auth.users when users table is updated
DROP TRIGGER IF EXISTS update_auth_users_store_name_trigger ON users;
CREATE TRIGGER update_auth_users_store_name_trigger
AFTER INSERT OR UPDATE OF store_name ON users
FOR EACH ROW
EXECUTE FUNCTION update_auth_users_store_name();

-- Update auth.users to include is_approved in raw_user_meta_data
CREATE OR REPLACE FUNCTION update_auth_users_approval()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = 
    CASE 
      WHEN raw_user_meta_data IS NULL THEN 
        jsonb_build_object('is_approved', NEW.is_approved)
      ELSE 
        raw_user_meta_data || jsonb_build_object('is_approved', NEW.is_approved)
    END
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update auth.users when users table is updated
DROP TRIGGER IF EXISTS update_auth_users_approval_trigger ON users;
CREATE TRIGGER update_auth_users_approval_trigger
AFTER INSERT OR UPDATE OF is_approved ON users
FOR EACH ROW
EXECUTE FUNCTION update_auth_users_approval();
