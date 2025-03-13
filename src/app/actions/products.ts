"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Request a sample for a specific product
export async function requestSample(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to request a sample." };
  }

  // Extract form data
  const productId = formData.get("product_id") as string;
  const factoryId = formData.get("factory_id") as string;
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const shippingAddress = formData.get("shipping_address") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const notes = formData.get("notes") as string;

  try {
    // Create sample request in database
    const { error } = await supabase.from("sample_requests").insert({
      user_id: user.id,
      product_id: productId,
      factory_id: factoryId,
      full_name: fullName,
      email,
      phone,
      company,
      shipping_address: shippingAddress,
      quantity,
      notes,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating sample request:", error);
      return { success: false, message: "Failed to create sample request. Please try again." };
    }

    // Revalidate path
    revalidatePath("/dashboard/samples");
    
    return { success: true, message: "Sample request submitted successfully!" };
  } catch (error) {
    console.error("Error in requestSample:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

// Place an order for a specific product
export async function placeOrder(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: "You must be logged in to place an order." };
  }

  // Extract form data
  const productId = formData.get("product_id") as string;
  const factoryId = formData.get("factory_id") as string;
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const company = formData.get("company") as string;
  const shippingAddress = formData.get("shipping_address") as string;
  const quantity = parseInt(formData.get("quantity") as string);
  const color = formData.get("color") as string;
  const size = formData.get("size") as string;
  const material = formData.get("material") as string;
  const notes = formData.get("notes") as string;

  try {
    // First, get the product price
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      console.error("Error fetching product price:", productError);
      return { success: false, message: "Failed to fetch product price. Please try again." };
    }

    // Calculate total price
    const total_price = product.price * quantity;

    // Create order in database
    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      product_id: productId,
      factory_id: factoryId,
      full_name: fullName,
      email,
      phone,
      company,
      shipping_address: shippingAddress,
      quantity,
      color,
      size,
      material,
      notes,
      status: "pending",
      payment_status: "unpaid",
      total_price,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating order:", error);
      return { success: false, message: "Failed to place order. Please try again." };
    }

    // Revalidate path
    revalidatePath("/dashboard/orders");
    
    return { success: true, message: "Order placed successfully!" };
  } catch (error) {
    console.error("Error in placeOrder:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

// Update order status (for factory owners)
export async function updateOrderStatus(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner") {
    throw new Error(
      "Unauthorized: Only factory owners can update order status",
    );
  }

  // Extract form data
  const orderId = formData.get("order_id") as string;
  const status = formData.get("status") as string;
  const estimatedDelivery = formData.get("estimated_delivery") as string;
  const notes = formData.get("notes") as string;

  // Update order in database
  const { error } = await supabase
    .from("orders")
    .update({
      status,
      estimated_delivery: estimatedDelivery,
      factory_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating order:", error);
    throw new Error("Failed to update order status");
  }

  // Redirect back to factory dashboard
  revalidatePath("/factory-dashboard");
  redirect("/factory-dashboard?tab=orders&message=order_updated");
}

// Update sample request status (for factory owners)
export async function updateSampleStatus(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner") {
    throw new Error(
      "Unauthorized: Only factory owners can update sample status",
    );
  }

  // Extract form data
  const sampleId = formData.get("sample_id") as string;
  const status = formData.get("status") as string;
  const estimatedDelivery = formData.get("estimated_delivery") as string;
  const notes = formData.get("notes") as string;

  // Update sample request in database
  const { error } = await supabase
    .from("sample_requests")
    .update({
      status,
      estimated_delivery: estimatedDelivery,
      factory_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sampleId);

  if (error) {
    console.error("Error updating sample request:", error);
    throw new Error("Failed to update sample status");
  }

  // Redirect back to factory dashboard
  revalidatePath("/factory-dashboard");
  redirect("/factory-dashboard?tab=samples&message=sample_updated");
}
