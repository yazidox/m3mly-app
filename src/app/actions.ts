"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const storeName = formData.get("store_name")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const address = formData.get("address")?.toString() || "";
  const cin = formData.get("cin")?.toString() || "";
  const referralSource = formData.get("referral_source")?.toString() || "";
  const role = formData.get("role")?.toString() || "user";
  const supabase = await createClient();
  const origin = headers().get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "L'email et le mot de passe sont requis",
    );
  }

  // Determine if the user should be auto-approved based on role
  const isApproved = role === "admin" || role === "factory_owner";

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        store_name: storeName,
        email: email,
        phone: phone,
        address: address,
        cin: cin,
        referral_source: referralSource,
        is_approved: isApproved,
        role: role,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      // First check if the user already exists in the users table
      const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (existingUserError && existingUserError.code !== "PGRST116") {
        console.error("Error checking existing user:", existingUserError);
      }

      // Only insert if the user doesn't already exist
      if (!existingUser) {
        const { error: updateError } = await supabase.from("users").insert({
          id: user.id,
          name: fullName,
          full_name: fullName,
          store_name: storeName,
          email: email,
          phone: phone,
          address: address,
          cin: cin,
          referral_source: referralSource,
          user_id: user.id,
          token_identifier: user.id,
          created_at: new Date().toISOString(),
          is_approved: isApproved,
          role: role,
        });

        if (updateError) {
          console.error("Error updating user profile:", updateError);
          // If there's an error with the store_name column, try again without it
          if (
            updateError.message &&
            updateError.message.includes("store_name")
          ) {
            const { error: retryError } = await supabase.from("users").insert({
              id: user.id,
              name: fullName,
              full_name: fullName,
              email: email,
              phone: phone,
              address: address,
              cin: cin,
              referral_source: referralSource,
              user_id: user.id,
              token_identifier: user.id,
              created_at: new Date().toISOString(),
              is_approved: isApproved,
              role: role,
            });

            if (retryError) {
              console.error(
                "Error in retry user profile creation:",
                retryError,
              );
            }
          }
        }
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Merci de vous être inscrit ! Nous examinerons votre compte et vous contacterons par téléphone pour l'approbation.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  // Trim email to prevent whitespace issues
  const trimmedEmail = email.trim();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: trimmedEmail,
    password,
  });

  if (error) {
    console.error("Sign in error:", error.message);
    return encodedRedirect("error", "/sign-in", error.message);
  }

  if (!data.user) {
    console.error("No user returned after sign in");
    return encodedRedirect("error", "/sign-in", "Authentication failed");
  }

  // Check user role and approval status to determine redirect destination
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role, is_approved")
    .eq("email", email)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError.message);
  }

  // Check if user is approved
  if (userData && userData.is_approved === false) {
    await supabase.auth.signOut();
    return encodedRedirect(
      "error",
      "/sign-in",
      "Votre compte est en attente d'approbation. Notre équipe vous contactera bientôt par téléphone.",
    );
  }

  // Redirect based on user role
  if (userData && userData.role === "factory_owner") {
    return redirect("/factory-dashboard");
  }

  // Default redirect for normal users
  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = headers().get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
