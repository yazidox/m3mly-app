-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for factory owners to manage their own products
DROP POLICY IF EXISTS "Factory owners can manage their own products" ON products;
CREATE POLICY "Factory owners can manage their own products"
  ON products
  USING (factory_id = (SELECT factory_id FROM users WHERE id = auth.uid()))
  WITH CHECK (factory_id = (SELECT factory_id FROM users WHERE id = auth.uid()));

-- Policy for users to view active products
DROP POLICY IF EXISTS "Users can view active products" ON products;
CREATE POLICY "Users can view active products"
  ON products
  FOR SELECT
  USING (status = 'active' OR factory_id = (SELECT factory_id FROM users WHERE id = auth.uid()));

-- Enable realtime for products table
alter publication supabase_realtime add table products;
