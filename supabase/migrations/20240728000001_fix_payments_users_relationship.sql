-- Check if the foreign key constraint already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_user_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        -- Add the foreign key constraint if it doesn't exist
        ALTER TABLE IF EXISTS public.payments
        ADD CONSTRAINT payments_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.users(id);
    END IF;
END
$$;

-- Make sure the payments table has a user_id column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'payments' 
        AND column_name = 'user_id'
    ) THEN
        -- Add the user_id column if it doesn't exist
        ALTER TABLE IF EXISTS public.payments
        ADD COLUMN user_id UUID REFERENCES public.users(id);
    END IF;
END
$$;

-- Update the query in the admin payments page to use user_id instead of users
COMMENT ON TABLE public.payments IS 'Table storing payment information with proper foreign key to users';
