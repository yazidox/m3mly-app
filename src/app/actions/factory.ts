"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Generate invoice for an order
export async function generateInvoice(formData: FormData) {
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
    .select("role, factory_id")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    throw new Error("Unauthorized: Only factory owners can generate invoices");
  }

  try {
    // Extract form data
    const orderId = formData.get("order_id") as string;
    const invoiceNumber = formData.get("invoice_number") as string;
    const dueDate = formData.get("due_date") as string;
    const notes = formData.get("notes") as string;

    // Get order details
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("factory_id", userData.factory_id)
      .single();

    if (!order) {
      throw new Error("Order not found or does not belong to your factory");
    }

    // Create invoice in database
    const { error } = await supabase.from("invoices").insert({
      order_id: orderId,
      factory_id: userData.factory_id,
      user_id: order.user_id,
      invoice_number: invoiceNumber,
      amount: order.total_price,
      due_date: dueDate,
      notes: notes,
      status: "unpaid",
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating invoice:", error);
      throw new Error("Failed to generate invoice");
    }

    // Update order payment status
    await supabase
      .from("orders")
      .update({
        payment_status: "invoiced",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Redirect back to factory dashboard
    revalidatePath("/factory-dashboard");
    return { success: true, message: "Invoice generated successfully" };
  } catch (error) {
    console.error("Error in generateInvoice:", error);
    return { success: false, message: "Failed to generate invoice" };
  }
}

// Mark invoice as paid
export async function markInvoiceAsPaid(formData: FormData) {
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
    .select("role, factory_id")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    throw new Error(
      "Unauthorized: Only factory owners can update invoice status",
    );
  }

  try {
    // Extract form data
    const invoiceId = formData.get("invoice_id") as string;
    const orderId = formData.get("order_id") as string;

    // Update invoice status
    const { error } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .eq("factory_id", userData.factory_id);

    if (error) {
      console.error("Error updating invoice:", error);
      throw new Error("Failed to mark invoice as paid");
    }

    // Update order payment status
    await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    // Redirect back to factory dashboard
    revalidatePath("/factory-dashboard");
    return { success: true, message: "Invoice marked as paid" };
  } catch (error) {
    console.error("Error in markInvoiceAsPaid:", error);
    return { success: false, message: "Failed to update invoice status" };
  }
}
