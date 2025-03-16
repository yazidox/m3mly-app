-- Check if price_tiers column exists, if not add it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'price_tiers') THEN
    ALTER TABLE products ADD COLUMN price_tiers JSONB;
  END IF;
END $$;

-- Enable realtime for products table if not already enabled
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
