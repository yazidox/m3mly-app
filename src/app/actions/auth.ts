"use server";

import { createClient } from "../../../supabase/server";
import { redirect } from "next/navigation";

export async function createFactoryOwner() {
  const supabase = await createClient();

  // Check if factory owner already exists
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", "factory@example.com")
    .maybeSingle();

  if (existingUser) {
    console.log("Factory owner already exists");
    return { success: true, message: "Factory owner already exists" };
  }

  // Create factory first
  const { data: factory, error: factoryError } = await supabase
    .from("factories")
    .insert({
      name: "Demo Factory",
      location: "Casablanca, Morocco",
      min_order_quantity: 50,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1581669600020-77e86e5f5d9a?w=800&q=80",
      cover_image:
        "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?w=1200&q=80",
      description:
        "A demo factory for testing the platform. Specializes in t-shirts, dresses, and activewear.",
      specialties: ["T-shirts", "Dresses", "Activewear"],
      lead_time: "2-3 weeks",
      capacity: "10,000 units/month",
      certifications: ["ISO 9001", "GOTS Certified"],
      status: "approved",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (factoryError) {
    console.error("Error creating factory:", factoryError);
    return { success: false, message: "Failed to create factory" };
  }

  // Create user with factory owner role
  const { data, error } = await supabase.auth.signUp({
    email: "factory@example.com",
    password: "factory123",
    options: {
      data: {
        full_name: "Factory Owner",
        store_name: "Demo Factory Store",
        role: "factory_owner",
        factory_id: factory.id,
        is_approved: true,
      },
    },
  });

  if (error) {
    console.error("Error creating factory owner:", error);
    return { success: false, message: "Failed to create factory owner" };
  }

  // Create user record in public.users table
  if (data.user) {
    const { error: userError } = await supabase.from("users").insert({
      id: data.user.id,
      email: "factory@example.com",
      full_name: "Factory Owner",
      store_name: "Demo Factory Store",
      role: "factory_owner",
      factory_id: factory.id,
      created_at: new Date().toISOString(),
      is_approved: true,
    });

    if (userError) {
      console.error("Error creating user record:", userError);
    }
  }

  return { success: true, message: "Factory owner created successfully" };
}
