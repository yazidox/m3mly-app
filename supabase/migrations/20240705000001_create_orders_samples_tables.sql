-- Create orders table first
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  factory_id UUID REFERENCES factories(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  shipping_address TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  color TEXT,
  size TEXT,
  material TEXT,
  notes TEXT,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'unpaid',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  factory_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable realtime for orders
alter publication supabase_realtime add table orders;

-- Create sample_requests table
CREATE TABLE IF NOT EXISTS sample_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  factory_id UUID REFERENCES factories(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  shipping_address TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  factory_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable realtime for sample_requests
alter publication supabase_realtime add table sample_requests;
