-- Add foreign key constraints to establish proper relationships

-- Add foreign key from payments to users
ALTER TABLE payments
ADD CONSTRAINT payments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES auth.users(id);

-- Add foreign key from payments to invoices
ALTER TABLE payments
ADD CONSTRAINT payments_invoice_id_fkey
FOREIGN KEY (invoice_id)
REFERENCES invoices(id);

-- Add foreign key from payments to payment_methods
ALTER TABLE payments
ADD CONSTRAINT payments_payment_method_id_fkey
FOREIGN KEY (payment_method_id)
REFERENCES payment_methods(id);

-- Enable RLS for payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policies for payments table
CREATE POLICY "Users can view their own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments"
ON payments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add payments table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE payments;
