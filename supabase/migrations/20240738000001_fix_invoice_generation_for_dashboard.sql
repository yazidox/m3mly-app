-- Add a function to generate invoices for paid orders that don't have invoices yet
CREATE OR REPLACE FUNCTION generate_missing_invoices_for_user(user_id UUID)
RETURNS SETOF invoices AS $$
DECLARE
  order_record RECORD;
  invoice_number TEXT;
  date_str TEXT;
  new_invoice_id UUID;
BEGIN
  -- Loop through all paid orders without invoices for this user
  FOR order_record IN 
    SELECT o.* FROM orders o
    LEFT JOIN invoices i ON o.id = i.order_id
    WHERE o.user_id = user_id
    AND o.payment_status = 'paid'
    AND i.id IS NULL
  LOOP
    -- Generate invoice number (current date + last 4 chars of order ID)
    date_str := to_char(CURRENT_DATE, 'YYYYMMDD');
    invoice_number := 'INV-' || date_str || '-' || RIGHT(order_record.id::text, 4);
    
    -- Create invoice
    INSERT INTO invoices (
      invoice_number,
      user_id,
      order_id,
      amount,
      status,
      due_date,
      created_at,
      updated_at
    ) VALUES (
      invoice_number,
      user_id,
      order_record.id,
      order_record.total_price,
      'paid',
      CURRENT_DATE + INTERVAL '30 days',
      NOW(),
      NOW()
    ) RETURNING * INTO new_invoice_id;
    
    -- Return the newly created invoice
    RETURN QUERY SELECT * FROM invoices WHERE id = new_invoice_id;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Create an API function to generate invoices for a specific user
CREATE OR REPLACE FUNCTION generate_invoices_for_user(user_id UUID)
RETURNS SETOF invoices AS $$
BEGIN
  RETURN QUERY SELECT * FROM generate_missing_invoices_for_user(user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for invoices table if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'invoices'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
  END IF;
END
$$;