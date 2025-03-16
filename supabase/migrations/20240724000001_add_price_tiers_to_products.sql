-- Add price tiers to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_tiers JSONB DEFAULT '[]'::jsonb;

-- Enable realtime for the updated table
alter publication supabase_realtime add table products;