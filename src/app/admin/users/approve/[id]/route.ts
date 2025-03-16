import { createClient } from "../../../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const userId = params.id;

  try {
    // Get the current user to check if they are an admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check if the current user is an admin
    const { data: adminData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!adminData || adminData.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Get the user data first to check if the column exists
    const { data: userData, error: userDataError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (userDataError) {
      console.error("Error fetching user data:", userDataError);
    }

    // Check if is_approved column exists in the schema
    const hasIsApprovedColumn = userData && "is_approved" in userData;

    // If the column exists, update it
    if (hasIsApprovedColumn) {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          is_approved: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating user approval status:", updateError);
      }
    } else {
      // If the column doesn't exist, we need to add it first
      // This is a fallback in case the migration hasn't run yet
      console.log(
        "is_approved column not found in users table, skipping update",
      );
    }

    // Update the user's metadata in auth.users regardless of column existence
    if (userData) {
      // Get the current user metadata
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);

      if (authUser && authUser.user) {
        const currentMetadata = authUser.user.user_metadata || {};

        // Update the user metadata
        const { error: authUpdateError } =
          await supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
              ...currentMetadata,
              is_approved: true,
              role: userData.role || "user",
            },
          });

        if (authUpdateError) {
          console.error("Error updating auth user metadata:", authUpdateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "User approved successfully",
    });
  } catch (error) {
    console.error("Error in approve user route:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 },
    );
  }
}
