"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayment(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  try {
    // Extract form data
    const invoiceId = formData.get("invoice_id") as string;
    const paymentMethodType = formData.get("payment_method_type") as string;
    const reference = formData.get("reference") as string;
    const accountName = formData.get("account_name") as string;
    const accountNumber = formData.get("account_number") as string;
    const details = formData.get("details") as string;

    let amount = 0;
    let orderId = null;

    // Check if this is a direct order payment (without invoice)
    if (invoiceId && invoiceId.startsWith("order-")) {
      // Extract the order ID from the format "order-{uuid}"
      orderId = invoiceId.substring(6);

      // Fetch order to get amount
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (!order) {
        return redirect("/dashboard/payment-methods?error=order_not_found");
      }

      amount = order.total_price;
    } else if (invoiceId) {
      // Regular invoice payment
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", invoiceId)
        .single();

      if (invoiceError || !invoice) {
        console.error("Error fetching invoice:", invoiceError);
        return redirect("/dashboard/payment-methods?error=invoice_not_found");
      }

      amount = invoice.amount;
      orderId = invoice.order_id;
    } else {
      return redirect("/dashboard/payment-methods?error=no_invoice_or_order");
    }

    // Create payment record
    let paymentData: any = {
      user_id: user.id,
      amount: amount,
      payment_method_type: paymentMethodType,
      reference: reference,
      account_name: accountName,
      account_number: accountNumber,
      details: details,
      status: "pending",
      currency: "MAD",
      created_at: new Date().toISOString(),
    };

    // Add invoice_id if we have a real invoice (not an order-prefixed ID)
    if (invoiceId && !invoiceId.startsWith("order-")) {
      paymentData.invoice_id = invoiceId;
    } else {
      // Explicitly set invoice_id to null if not present
      paymentData.invoice_id = null;
    }

    // Add order_id if we have it
    if (orderId) {
      paymentData.order_id = orderId;
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert(paymentData)
      .select()
      .single();

    if (paymentError) {
      console.error("Error creating payment:", paymentError);
      throw new Error("Failed to create payment record");
    }

    // Update invoice status if we have a real invoice
    if (invoiceId && !invoiceId.startsWith("order-")) {
      const { error: updateError } = await supabase
        .from("invoices")
        .update({
          status: "pending_payment",
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      if (updateError) {
        console.error("Error updating invoice status:", updateError);
      }
    }

    // Update order payment status if order exists
    if (orderId) {
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          payment_status: "pending_verification",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (orderError) {
        console.error("Error updating order status:", orderError);
      }
    }

    revalidatePath("/dashboard/payment-methods");

    // Use redirect directly since we're calling this function from a Server Component
    return redirect(
      `/dashboard/payment-methods/success?payment_id=${payment.id}`,
    );
  } catch (error) {
    console.error("Error in createPayment:", error);
    return redirect("/dashboard/payment-methods?error=payment_failed");
  }
}
