-- Add foreign key relationship between orders and users tables
ALTER TABLE "public"."orders"
  ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;

-- Add this relationship to the publication for realtime
alter publication supabase_realtime add table orders;