import { createClient } from "../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = await request.json();
    const {
      invoiceId,
      paymentMethodId,
      paymentMethodType,
      amount,
      reference,
      details,
    } = requestData;

    if (!invoiceId || !paymentMethodType || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create payment record
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        invoice_id: invoiceId,
        payment_method_id: paymentMethodId,
        payment_method_type: paymentMethodType,
        amount,
        reference,
        details,
        status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating payment:", error);
      return NextResponse.json(
        { error: "Failed to create payment" },
        { status: 500 },
      );
    }

    // Update invoice status to pending_payment
    const { error: invoiceError } = await supabase
      .from("invoices")
      .update({
        status: "pending_payment",
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (invoiceError) {
      console.error("Error updating invoice status:", invoiceError);
    }

    return NextResponse.json({
      success: true,
      payment,
      message: "Payment submitted successfully",
    });
  } catch (error) {
    console.error("Error in payment creation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
