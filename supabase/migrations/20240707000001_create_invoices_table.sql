-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  factory_id UUID REFERENCES factories(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  payment_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT DEFAULT 'unpaid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Enable realtime for invoices
alter publication supabase_realtime add table invoices;
