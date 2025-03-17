import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call the function to generate invoices for this user
    const { data, error } = await supabase.rpc("generate_invoices_for_user", {
      user_id: user.id,
    });

    if (error) {
      console.error("Error generating invoices:", error);
      return NextResponse.json(
        { error: "Failed to generate invoices" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoices generated successfully",
      invoices: data,
    });
  } catch (error) {
    console.error("Error in generate-invoices API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
