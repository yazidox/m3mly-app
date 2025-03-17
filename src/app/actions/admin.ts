"use server";

import { createClient } from "../../../supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Payment verification actions
export async function verifyPayment(formData: FormData) {
  "use server";
  const supabase = await createClient();

  // Get payment ID from form data
  const paymentId = formData.get("payment_id") as string;
  const invoiceId = formData.get("invoice_id") as string;
  const orderId = formData.get("order_id") as string;

  try {
    // Update payment status to verified
    const { error: paymentError } = await supabase
      .from("payments")
      .update({
        status: "verified",
        updated_at: new Date().toISOString(),
      })
      .eq("id", paymentId);

    if (paymentError) {
      console.error("Error updating payment status:", paymentError);
      return {
        success: false,
        error: "Failed to update payment",
        redirectTo: `/admin/payments/${paymentId}?error=update_failed`,
      };
    }

    // Update invoice status if invoice exists
    if (invoiceId) {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({
          status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", invoiceId);

      if (invoiceError) {
        console.error("Error updating invoice status:", invoiceError);
      }
    }
    // Generate invoice if it doesn't exist but we have an order
    else if (orderId && !invoiceId) {
      // Fetch order details to create invoice
      const { data: orderData, error: orderFetchError } = await supabase
        .from("orders")
        .select("*, products(name, price)")
        .eq("id", orderId)
        .single();

      if (orderFetchError) {
        console.error("Error fetching order details:", orderFetchError);
      } else if (orderData) {
        // Generate invoice number (current date + last 4 chars of order ID)
        const date = new Date();
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
        const invoiceNumber = `INV-${dateStr}-${orderId.substring(orderId.length - 4)}`;

        // Create invoice
        const { data: newInvoice, error: createInvoiceError } = await supabase
          .from("invoices")
          .insert({
            invoice_number: invoiceNumber,
            user_id: orderData.user_id,
            order_id: orderId,
            amount: orderData.total_price,
            status: "paid", // Already paid since payment is verified
            due_date: new Date(date.setDate(date.getDate() + 30)).toISOString(), // Set due date to 30 days from now
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (createInvoiceError) {
          console.error("Error creating invoice:", createInvoiceError);
        } else if (newInvoice) {
          // Update payment with the new invoice ID
          const { error: updatePaymentError } = await supabase
            .from("payments")
            .update({
              invoice_id: newInvoice.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", paymentId);

          if (updatePaymentError) {
            console.error(
              "Error linking payment to invoice:",
              updatePaymentError,
            );
          }
        }
      }
    }

    // Update order payment status if order exists
    if (orderId) {
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (orderError) {
        console.error("Error updating order status:", orderError);
      }
    }

    revalidatePath(`/admin/payments/${paymentId}`);
    revalidatePath("/admin/payments");
    return {
      success: true,
      redirectTo: `/admin/payments/${paymentId}?success=payment_verified`,
    };
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return {
      success: false,
      error: "Verification failed",
      redirectTo: `/admin/payments/${paymentId}?error=verification_failed`,
    };
  }
}

export async function rejectPayment(formData: FormData) {
  "use server";
  const supabase = await createClient();

  // Get payment ID from form data
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
      console.error("Error updating payment status:", paymentError);
      return {
        success: false,
        error: "Failed to update payment",
        redirectTo: `/admin/payments/${paymentId}?error=update_failed`,
      };
    }

    revalidatePath(`/admin/payments/${paymentId}`);
    revalidatePath("/admin/payments");
    return {
      success: true,
      redirectTo: `/admin/payments/${paymentId}?success=payment_rejected`,
    };
  } catch (error) {
    console.error("Error in rejectPayment:", error);
    return {
      success: false,
      error: "Rejection failed",
      redirectTo: `/admin/payments/${paymentId}?error=rejection_failed`,
    };
  }
}

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
  let tierCount = 0;

  try {
    // Get tier count from form data
    tierCount = parseInt(formData.get("tier_count") as string) || 0;

    // Extract each tier's data
    for (let i = 0; i < tierCount; i++) {
      const minQuantity = parseInt(
        formData.get(`tier_${i}_min_quantity`) as string,
      );
      const price = parseFloat(formData.get(`tier_${i}_price`) as string);

      if (!isNaN(minQuantity) && !isNaN(price)) {
        priceTiers.push({
          min_quantity: minQuantity,
          price: price,
        });
      }
    }
  } catch (error) {
    console.error("Error processing price tiers:", error);
  }

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
