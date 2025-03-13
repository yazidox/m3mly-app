import { createClient } from "../../../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();

  // Check if user is admin
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Approve factory
  const { error } = await supabase
    .from("factories")
    .update({ status: "approved", updated_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error) {
    console.error("Error approving factory:", error);
    return NextResponse.json(
      { error: "Failed to approve factory" },
      { status: 500 },
    );
  }

  revalidatePath("/admin/factories");
  return NextResponse.redirect(new URL("/admin/factories", request.url));
}
