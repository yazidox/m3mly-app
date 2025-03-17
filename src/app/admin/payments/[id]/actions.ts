"use server";

import {
  verifyPayment as verifyPaymentAction,
  rejectPayment as rejectPaymentAction,
} from "@/app/actions/admin";

export async function verifyPayment(formData: FormData) {
  return verifyPaymentAction(formData);
}

export async function rejectPayment(formData: FormData) {
  return rejectPaymentAction(formData);
}
