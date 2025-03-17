-- Add a function to generate invoice when payment is approved
CREATE OR REPLACE FUNCTION generate_invoice_on_payment_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- If payment status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    -- Update invoice status if exists
    IF NEW.invoice_id IS NOT NULL THEN
      UPDATE invoices
      SET status = 'paid',
          updated_at = NOW()
      WHERE id = NEW.invoice_id;
    END IF;
    
    -- Update order payment status if exists
    IF NEW.order_id IS NOT NULL THEN
      UPDATE orders
      SET payment_status = 'paid',
          updated_at = NOW()
      WHERE id = NEW.order_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on payments table
DROP TRIGGER IF EXISTS payment_approval_trigger ON payments;
CREATE TRIGGER payment_approval_trigger
AFTER UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION generate_invoice_on_payment_approval();
