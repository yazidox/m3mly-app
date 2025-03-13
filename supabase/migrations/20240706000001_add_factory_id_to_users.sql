-- Add factory_id column to users table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'factory_id') THEN
        ALTER TABLE public.users ADD COLUMN factory_id UUID REFERENCES public.factories(id);
    END IF;
END
$$;

-- Create index on factory_id
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'users_factory_id_idx') THEN
        CREATE INDEX users_factory_id_idx ON public.users(factory_id);
    END IF;
END
$$;
