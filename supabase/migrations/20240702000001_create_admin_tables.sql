-- Add role column to users table if it doesn't exist
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';

-- Create factories table
CREATE TABLE IF NOT EXISTS public.factories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  location text NOT NULL,
  min_order_quantity integer NOT NULL,
  rating numeric(3,1) DEFAULT 0,
  image text,
  cover_image text,
  description text,
  specialties text[] DEFAULT '{}',
  lead_time text,
  capacity text,
  certifications text[] DEFAULT '{}',
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  factory_id uuid REFERENCES public.factories(id) ON DELETE CASCADE,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  category text,
  description text,
  image text,
  features text[] DEFAULT '{}',
  min_order_quantity integer DEFAULT 1,
  lead_time integer,
  status text DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.factories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for factories
DROP POLICY IF EXISTS "Public read access for factories" ON public.factories;
CREATE POLICY "Public read access for factories" 
  ON public.factories FOR SELECT 
  USING (status = 'approved');

DROP POLICY IF EXISTS "Admin full access for factories" ON public.factories;
CREATE POLICY "Admin full access for factories" 
  ON public.factories FOR ALL 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Create policies for products
DROP POLICY IF EXISTS "Public read access for products" ON public.products;
CREATE POLICY "Public read access for products" 
  ON public.products FOR SELECT 
  USING (status = 'active');

DROP POLICY IF EXISTS "Admin full access for products" ON public.products;
CREATE POLICY "Admin full access for products" 
  ON public.products FOR ALL 
  USING ((SELECT role FROM public.users WHERE id = auth.uid()) = 'admin');

-- Enable realtime
alter publication supabase_realtime add table factories;
alter publication supabase_realtime add table products;
