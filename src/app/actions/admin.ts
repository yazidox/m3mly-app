"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Factory actions
export async function createFactory(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const minOrderQuantity = parseInt(
    formData.get("min_order_quantity") as string,
  );
  const rating = parseFloat(formData.get("rating") as string);
  const image = formData.get("image") as string;
  const coverImage = formData.get("cover_image") as string;
  const description = formData.get("description") as string;
  const specialties = (formData.get("specialties") as string)
    .split(",")
    .map((s) => s.trim());
  const leadTime = formData.get("lead_time") as string;
  const capacity = formData.get("capacity") as string;
  const certifications = (formData.get("certifications") as string)
    .split(",")
    .map((c) => c.trim());

  const { error } = await supabase.from("factories").insert({
    name,
    location,
    min_order_quantity: minOrderQuantity,
    rating,
    image,
    cover_image: coverImage,
    description,
    specialties,
    lead_time: leadTime,
    capacity,
    certifications,
    status: "pending",
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error creating factory:", error);
    throw new Error("Failed to create factory");
  }

  revalidatePath("/admin/factories");
  redirect("/admin/factories");
}

export async function updateFactory(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const minOrderQuantity = parseInt(
    formData.get("min_order_quantity") as string,
  );
  const rating = parseFloat(formData.get("rating") as string);
  const image = formData.get("image") as string;
  const coverImage = formData.get("cover_image") as string;
  const description = formData.get("description") as string;
  const specialties = (formData.get("specialties") as string)
    .split(",")
    .map((s) => s.trim());
  const leadTime = formData.get("lead_time") as string;
  const capacity = formData.get("capacity") as string;
  const certifications = (formData.get("certifications") as string)
    .split(",")
    .map((c) => c.trim());
  const status = formData.get("status") as string;

  // Factory owner account fields
  const createOwner = formData.get("create_owner") === "on";
  const updatePassword = formData.get("update_password") === "on";
  const ownerId = formData.get("owner_id") as string;
  const ownerEmail = formData.get("owner_email") as string;
  const ownerPassword = formData.get("owner_password") as string;
  const ownerName = formData.get("owner_name") as string;

  // Update factory information
  const { error } = await supabase
    .from("factories")
    .update({
      name,
      location,
      min_order_quantity: minOrderQuantity,
      rating,
      image,
      cover_image: coverImage,
      description,
      specialties,
      lead_time: leadTime,
      capacity,
      certifications,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating factory:", error);
    throw new Error("Failed to update factory");
  }

  // Handle factory owner account operations
  try {
    // Create new factory owner account if requested
    if (createOwner && ownerEmail && ownerPassword) {
      // Create user with factory owner role using standard signUp API
      const { data, error: authError } = await supabase.auth.signUp({
        email: ownerEmail,
        password: ownerPassword,
        options: {
          data: {
            full_name: ownerName || name + " Owner",
            role: "factory_owner",
            factory_id: id,
            is_approved: true, // Factory owners are auto-approved
          },
        },
      });

      if (authError) {
        console.error("Error creating factory owner account:", authError);
        throw new Error("Failed to create factory owner account");
      }

      // Create user record in public.users table
      if (data.user) {
        const { error: userError } = await supabase.from("users").insert({
          id: data.user.id,
          email: ownerEmail,
          full_name: ownerName || name + " Owner",
          role: "factory_owner",
          factory_id: id,
          token_identifier: data.user.id,
          user_id: data.user.id,
          created_at: new Date().toISOString(),
          is_approved: true, // Factory owners are auto-approved
        });

        if (userError) {
          console.error("Error creating user record:", userError);
        }
      }
    }

    // Update existing owner's password if requested
    else if (updatePassword && ownerId) {
      // Instead of using admin API, we'll send a password reset email
      const { error: updateError } = await supabase.auth.resetPasswordForEmail(
        ownerEmail,
        {
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback?redirect_to=/protected/reset-password`,
        },
      );

      if (updateError) {
        console.error("Error sending password reset email:", updateError);
        throw new Error("Failed to send password reset email");
      }
    }
  } catch (err) {
    console.error("Error in factory owner operations:", err);
  }

  revalidatePath("/admin/factories");
  redirect("/admin/factories");
}

// Product actions
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const factoryId = formData.get("factory_id") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const features = (formData.get("features") as string)
    .split(",")
    .map((f) => f.trim());
  const minOrderQuantity = parseInt(
    formData.get("min_order_quantity") as string,
  );
  const leadTime = parseInt(formData.get("lead_time") as string);
  const status = formData.get("status") as string;

  // Extract price tiers if they exist
  const priceTiers = [];
  const tierCount = document
    .querySelector("#price-tiers-container")
    ?.getAttribute("data-tier-count");
  const numTiers = tierCount ? parseInt(tierCount) : 0;

  // Log for debugging
  console.log("Number of tiers detected:", numTiers);
  console.log("Form data keys:", [...formData.keys()]);

  for (let i = 0; i < numTiers; i++) {
    const minQtyStr = formData.get(`tier-min-${i}`) as string;
    const maxQtyStr = formData.get(`tier-max-${i}`) as string;
    const tierPriceStr = formData.get(`tier-price-${i}`) as string;

    console.log(`Processing tier ${i}:`, {
      minQtyStr,
      maxQtyStr,
      tierPriceStr,
    });

    const minQty = parseInt(minQtyStr);
    const maxQty =
      maxQtyStr && maxQtyStr.trim() !== "" ? parseInt(maxQtyStr) : null;
    const tierPrice = parseFloat(tierPriceStr);

    // Only add valid tiers with all required fields
    if (!isNaN(minQty) && !isNaN(tierPrice)) {
      priceTiers.push({
        min_quantity: minQty,
        max_quantity: maxQty,
        price: tierPrice,
      });
    }
  }

  console.log("Final price tiers to be saved:", priceTiers);

  // Sort price tiers by min_quantity to ensure proper ordering
  priceTiers.sort((a, b) => a.min_quantity - b.min_quantity);

  const { error } = await supabase.from("products").insert({
    factory_id: factoryId,
    name,
    price,
    category,
    description,
    image,
    features,
    min_order_quantity: minOrderQuantity,
    lead_time: leadTime,
    status,
    price_tiers: priceTiers.length > 0 ? priceTiers : null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const factoryId = formData.get("factory_id") as string;
  const name = formData.get("name") as string;
  const price = parseFloat(formData.get("price") as string);
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const image = formData.get("image") as string;
  const features = (formData.get("features") as string)
    .split(",")
    .map((f) => f.trim());
  const minOrderQuantity = parseInt(
    formData.get("min_order_quantity") as string,
  );
  const leadTime = parseInt(formData.get("lead_time") as string);
  const status = formData.get("status") as string;

  // Extract price tiers if they exist
  const priceTiers = [];
  const tierCount = document
    .querySelector("#price-tiers-container")
    ?.getAttribute("data-tier-count");
  const numTiers = tierCount ? parseInt(tierCount) : 0;

  // Log for debugging
  console.log("Number of tiers detected:", numTiers);
  console.log("Form data keys:", [...formData.keys()]);

  for (let i = 0; i < numTiers; i++) {
    const minQtyStr = formData.get(`tier-min-${i}`) as string;
    const maxQtyStr = formData.get(`tier-max-${i}`) as string;
    const tierPriceStr = formData.get(`tier-price-${i}`) as string;

    console.log(`Processing tier ${i}:`, {
      minQtyStr,
      maxQtyStr,
      tierPriceStr,
    });

    const minQty = parseInt(minQtyStr);
    const maxQty =
      maxQtyStr && maxQtyStr.trim() !== "" ? parseInt(maxQtyStr) : null;
    const tierPrice = parseFloat(tierPriceStr);

    // Only add valid tiers with all required fields
    if (!isNaN(minQty) && !isNaN(tierPrice)) {
      priceTiers.push({
        min_quantity: minQty,
        max_quantity: maxQty,
        price: tierPrice,
      });
    }
  }

  console.log("Final price tiers to be saved:", priceTiers);

  // Sort price tiers by min_quantity to ensure proper ordering
  priceTiers.sort((a, b) => a.min_quantity - b.min_quantity);

  const { error } = await supabase
    .from("products")
    .update({
      factory_id: factoryId,
      name,
      price,
      category,
      description,
      image,
      features,
      min_order_quantity: minOrderQuantity,
      lead_time: leadTime,
      status,
      price_tiers: priceTiers.length > 0 ? priceTiers : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

// User actions
export async function updateUser(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const role = formData.get("role") as string;
  const address = formData.get("address") as string;
  const cin = formData.get("cin") as string;
  const isApproved = formData.get("is_approved") === "on";

  const { error } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      email,
      phone,
      role,
      address,
      cin,
      is_approved: isApproved,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }

  // Update the user's metadata in auth.users
  try {
    const { data: authUser } = await supabase.auth.admin.getUserById(id);

    if (authUser && authUser.user) {
      const currentMetadata = authUser.user.user_metadata || {};

      // Update the user metadata
      const { error: authUpdateError } =
        await supabase.auth.admin.updateUserById(id, {
          user_metadata: {
            ...currentMetadata,
            is_approved: isApproved,
            role: role,
          },
        });

      if (authUpdateError) {
        console.error("Error updating auth user metadata:", authUpdateError);
      }
    }
  } catch (err) {
    console.error("Error updating auth user:", err);
  }

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

// Payment verification actions
export async function verifyPayment(formData: FormData) {
  const supabase = await createClient();

  const paymentId = formData.get("payment_id") as string;
  const invoiceId = formData.get("invoice_id") as string;
  const orderId = formData.get("order_id") as string;

  try {
    // 1. Update payment status to verified
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (paymentError) {
      console.error("Error updating payment:", paymentError);
      throw new Error("Failed to verify payment");
    }

    // 2. Update invoice status to paid
    const { error: invoiceError } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        payment_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId);

    if (invoiceError) {
      console.error("Error updating invoice:", invoiceError);
    }

    // 3. Update order payment status if order exists
    if (orderId) {
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
    }

    revalidatePath("/admin/payments");
    return redirect(`/admin/payments/${paymentId}?message=payment_verified`);
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return redirect(`/admin/payments/${paymentId}?error=verification_failed`);
  }
}

export async function rejectPayment(formData: FormData) {
  const supabase = await createClient();

  const paymentId = formData.get("payment_id") as string;

  try {
    // Update payment status to rejected
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "rejected",
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (paymentError) {
      console.error("Error rejecting payment:", paymentError);
      throw new Error("Failed to reject payment");
    }

    revalidatePath("/admin/payments");
    return redirect(`/admin/payments/${paymentId}?message=payment_rejected`);
  } catch (error) {
    console.error("Error in rejectPayment:", error);
    return redirect(`/admin/payments/${paymentId}?error=rejection_failed`);
  }
}
