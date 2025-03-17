-- Make invoice_id nullable in payments table
ALTER TABLE payments ALTER COLUMN invoice_id DROP NOT NULL;

-- Check if payments table is already in realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'payments'
  ) THEN
    -- Add payments table to realtime publication if not already added
    ALTER PUBLICATION supabase_realtime ADD TABLE payments;
  END IF;
END
$$;