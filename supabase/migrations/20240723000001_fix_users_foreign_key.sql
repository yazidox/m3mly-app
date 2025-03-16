-- Remove the foreign key constraint if it exists
ALTER TABLE IF EXISTS users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Make sure the store_name column exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'store_name') THEN
    ALTER TABLE users ADD COLUMN store_name TEXT;
  END IF;
END $$;

-- Check if users table is already in the realtime publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'users') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE users;
  END IF;
END $$;
