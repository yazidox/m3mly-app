-- Drop existing RLS policies for products table if they exist
DROP POLICY IF EXISTS "Factory owners can manage their own products" ON products;

-- Create proper RLS policy for products table
CREATE POLICY "Factory owners can manage their own products"
ON products
FOR ALL
USING (auth.uid() IN (
  SELECT id FROM users WHERE factory_id = products.factory_id AND role = 'factory_owner'
));

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Note: We're not adding the table to supabase_realtime publication
-- since it's already a member of that publication
