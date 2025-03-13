-- Enable auto-confirm for signups
-- This avoids the need to confirm emails, which can hit rate limits

-- Update auth.users directly for existing users
UPDATE auth.users SET email_confirmed_at = CURRENT_TIMESTAMP WHERE email_confirmed_at IS NULL;

-- Create a trigger to auto-confirm new users
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE auth.users SET email_confirmed_at = CURRENT_TIMESTAMP WHERE id = NEW.id AND email_confirmed_at IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_email();
