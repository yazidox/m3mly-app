-- Add the relationship to the payments table in the schema cache
DO $$
BEGIN
    -- Check if the foreign key constraint exists in the database but not in the schema cache
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_user_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        -- Update the payments table to refresh the relationship in the schema cache
        COMMENT ON CONSTRAINT payments_user_id_fkey ON public.payments IS 'Foreign key relationship between payments.user_id and users.id';
    END IF;
END
$$;

-- Make sure the relationship is properly defined in the Supabase schema cache
ALTER TABLE IF EXISTS public.payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;

ALTER TABLE IF EXISTS public.payments
ADD CONSTRAINT payments_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES public.users(id);

-- Update the query in the admin payments page to use the correct join syntax
COMMENT ON TABLE public.payments IS 'Table storing payment information with proper foreign key to users';
