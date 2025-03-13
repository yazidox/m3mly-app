-- This migration fixes the duplicate constraint issue by first checking if constraints exist

-- For payments_user_id_fkey constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_user_id_fkey'
  ) THEN
    ALTER TABLE IF EXISTS public.payments
    ADD CONSTRAINT payments_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id);
  END IF;
END $$;

-- For payments_payment_method_id_fkey constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payments_payment_method_id_fkey'
  ) THEN
    ALTER TABLE IF EXISTS public.payments
    ADD CONSTRAINT payments_payment_method_id_fkey
    FOREIGN KEY (payment_method_id) REFERENCES public.payment_methods(id);
  END IF;
END $$;

-- For payment_methods_user_id_fkey constraint
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'payment_methods_user_id_fkey'
  ) THEN
    ALTER TABLE IF EXISTS public.payment_methods
    ADD CONSTRAINT payment_methods_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES public.users(id);
  END IF;
END $$;
