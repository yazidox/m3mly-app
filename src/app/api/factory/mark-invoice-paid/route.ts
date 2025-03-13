import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const invoiceId = formData.get("invoice_id") as string;
  const orderId = formData.get("order_id") as string;

  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("role, factory_id")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    return NextResponse.redirect(
      new URL("/dashboard?error=not_factory_owner", request.url),
    );
  }

  try {
    // Update invoice status
    const { error: invoiceError } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)
      .eq("factory_id", userData.factory_id);

    if (invoiceError) {
      console.error("Error updating invoice:", invoiceError);
      return NextResponse.redirect(
        new URL("/factory-dashboard/invoices?error=update_failed", request.url),
      );
    }

    // Update order payment status
    const { error: orderError } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (orderError) {
      console.error("Error updating order:", orderError);
    }

    revalidatePath("/factory-dashboard/invoices");
    return NextResponse.redirect(
      new URL(
        "/factory-dashboard/invoices?message=invoice_marked_paid",
        request.url,
      ),
    );
  } catch (error) {
    console.error("Error in mark-invoice-paid:", error);
    return NextResponse.redirect(
      new URL("/factory-dashboard/invoices?error=update_failed", request.url),
    );
  }
}
