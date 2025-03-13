"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Update factory profile settings
export async function updateFactorySettings(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Extract action type to determine what to update
  const actionType = formData.get("action_type") as string;

  try {
    // Handle factory profile updates
    if (actionType === "profile") {
      const factoryId = formData.get("factory_id") as string;
      const name = formData.get("name") as string;
      const location = formData.get("location") as string;
      const description = formData.get("description") as string;
      const minOrderQuantity = parseInt(
        formData.get("min_order_quantity") as string,
      );
      const leadTime = formData.get("lead_time") as string;
      const capacity = formData.get("capacity") as string;
      const specialties = (formData.get("specialties") as string)
        .split(",")
        .map((s) => s.trim());
      const certifications = (formData.get("certifications") as string)
        .split(",")
        .map((c) => c.trim());
      const image = formData.get("image") as string;
      const coverImage = formData.get("cover_image") as string;

      // Update factory information
      const { error } = await supabase
        .from("factories")
        .update({
          name,
          location,
          description,
          min_order_quantity: minOrderQuantity,
          lead_time: leadTime,
          capacity,
          specialties,
          certifications,
          image,
          cover_image: coverImage,
          updated_at: new Date().toISOString(),
        })
        .eq("id", factoryId);

      if (error) {
        console.error("Error updating factory profile:", error);
        throw new Error("Failed to update factory profile");
      }
    }

    // Handle account settings updates
    else if (actionType === "account") {
      const userId = formData.get("user_id") as string;
      const fullName = formData.get("full_name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;

      // Update user information
      const { error: userError } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          email,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (userError) {
        console.error("Error updating user account:", userError);
        throw new Error("Failed to update account information");
      }

      // Handle password change if provided
      const currentPassword = formData.get("current_password") as string;
      const newPassword = formData.get("new_password") as string;
      const confirmPassword = formData.get("confirm_password") as string;

      if (newPassword && confirmPassword && currentPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error("New passwords do not match");
        }

        // Update user password
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordError) {
          console.error("Error updating password:", passwordError);
          throw new Error("Failed to update password");
        }
      }
    }

    // Handle notification settings updates
    else if (actionType === "notifications") {
      const userId = formData.get("user_id") as string;

      // Extract notification preferences
      const notifyNewOrders = formData.get("notify_new_orders") === "on";
      const notifySampleRequests =
        formData.get("notify_sample_requests") === "on";
      const notifyPayments = formData.get("notify_payments") === "on";
      const notifyMarketing = formData.get("notify_marketing") === "on";
      const smsNewOrders = formData.get("sms_new_orders") === "on";
      const smsPayments = formData.get("sms_payments") === "on";

      // Update user notification preferences
      const { error } = await supabase.from("user_preferences").upsert(
        {
          user_id: userId,
          notify_new_orders: notifyNewOrders,
          notify_sample_requests: notifySampleRequests,
          notify_payments: notifyPayments,
          notify_marketing: notifyMarketing,
          sms_new_orders: smsNewOrders,
          sms_payments: smsPayments,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) {
        console.error("Error updating notification preferences:", error);
        throw new Error("Failed to update notification preferences");
      }
    }

    // Handle appearance settings updates
    else if (actionType === "appearance") {
      const factoryId = formData.get("factory_id") as string;

      // Extract appearance preferences
      const showRating = formData.get("show_rating") === "on";
      const showCertifications = formData.get("show_certifications") === "on";
      const showCapacity = formData.get("show_capacity") === "on";
      const showEmail = formData.get("show_email") === "on";
      const showPhone = formData.get("show_phone") === "on";

      // Update factory appearance preferences
      const { error } = await supabase.from("factory_preferences").upsert(
        {
          factory_id: factoryId,
          show_rating: showRating,
          show_certifications: showCertifications,
          show_capacity: showCapacity,
          show_email: showEmail,
          show_phone: showPhone,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "factory_id" },
      );

      if (error) {
        console.error("Error updating appearance preferences:", error);
        throw new Error("Failed to update appearance preferences");
      }
    }

    // Revalidate the settings page
    revalidatePath("/factory-dashboard/settings");
    return redirect("/factory-dashboard/settings?message=settings_updated");
  } catch (error) {
    console.error("Error in updateFactorySettings:", error);
    return redirect("/factory-dashboard/settings?error=update_failed");
  }
}

// Update security settings
export async function updateSecuritySettings(formData: FormData) {
  const supabase = await createClient();

  // Get user information
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  try {
    // Extract password change data
    const currentPassword = formData.get("current_password") as string;
    const newPassword = formData.get("new_password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (newPassword && confirmPassword && currentPassword) {
      if (newPassword !== confirmPassword) {
        throw new Error("New passwords do not match");
      }

      // Update user password
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (passwordError) {
        console.error("Error updating password:", passwordError);
        throw new Error("Failed to update password");
      }
    }

    // Extract privacy settings
    const dataCollection = formData.get("data_collection") === "on";
    const thirdPartySharing = formData.get("third_party_sharing") === "on";
    const marketingEmails = formData.get("marketing_emails") === "on";

    // Update user privacy preferences
    const { error } = await supabase.from("user_privacy_settings").upsert(
      {
        user_id: user.id,
        data_collection: dataCollection,
        third_party_sharing: thirdPartySharing,
        marketing_emails: marketingEmails,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

    if (error) {
      console.error("Error updating privacy settings:", error);
      throw new Error("Failed to update privacy settings");
    }

    // Revalidate the security settings page
    revalidatePath("/factory-dashboard/settings/security");
    return redirect(
      "/factory-dashboard/settings/security?message=settings_updated",
    );
  } catch (error) {
    console.error("Error in updateSecuritySettings:", error);
    return redirect("/factory-dashboard/settings/security?error=update_failed");
  }
}
