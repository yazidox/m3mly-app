-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR NOT NULL,
  account_name VARCHAR NOT NULL,
  account_number VARCHAR NOT NULL,
  bank_name VARCHAR,
  reference VARCHAR,
  details TEXT,
  is_default BOOLEAN DEFAULT false,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  payment_method_id UUID REFERENCES payment_methods(id),
  payment_method_type VARCHAR NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR DEFAULT 'MAD',
  status VARCHAR DEFAULT 'pending',
  reference VARCHAR,
  details TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Payment methods policies
CREATE POLICY "Users can view their