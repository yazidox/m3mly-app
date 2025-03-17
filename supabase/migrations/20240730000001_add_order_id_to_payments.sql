-- Add order_id column to payments table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'order_id') THEN
    ALTER TABLE payments ADD COLUMN order_id UUID REFERENCES orders(id);
  END IF;
END $$;

-- Add foreign key constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'payments_order_id_fkey' 
    AND table_name = 'payments'
  ) THEN
    ALTER TABLE payments 
    ADD CONSTRAINT payments_order_id_fkey 
    FOREIGN KEY (order_id) 
    REFERENCES orders(id);
  END IF;
END $$;

-- Enable realtime for payments table
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
