-- Add order_id column to payments table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'order_id') THEN
    ALTER TABLE payments ADD COLUMN order_id UUID REFERENCES orders(id);
  END IF;
END $$;

-- Enable realtime for payments table
alter publication supabase_realtime add table payments;