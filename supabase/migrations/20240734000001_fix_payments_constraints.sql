-- Make invoice_id nullable in payments table
ALTER TABLE payments ALTER COLUMN invoice_id DROP NOT NULL;

-- Make sure we don't try to add payments to realtime again
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'payments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE payments;
  END IF;
END
$$;