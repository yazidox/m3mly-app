"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCheck, AlertCircle } from "lucide-react";
import { verifyPayment, rejectPayment } from "./actions";

interface PaymentActionResult {
  success: boolean;
  redirectTo?: string;
  error?: string;
}

export function usePaymentAction() {
  const router = useRouter();

  const handleActionResult = (result: PaymentActionResult) => {
    if (result && result.redirectTo) {
      router.push(result.redirectTo);
    }
  };

  return { handleActionResult };
}

interface PaymentActionsProps {
  paymentId: string;
  invoiceId?: string;
  orderId?: string;
  status: string;
}

export function PaymentActions({
  paymentId,
  invoiceId,
  orderId,
  status,
}: PaymentActionsProps) {
  return (
    <>
      {status === "pending" && (
        <>
          <form action={verifyPayment} className="w-full">
            <input type="hidden" name="payment_id" value={paymentId} />
            {invoiceId && (
              <input type="hidden" name="invoice_id" value={invoiceId} />
            )}
            <input type="hidden" name="order_id" value={orderId || ""} />
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCheck className="h-4 w-4 mr-2" /> Valider le Paiement
            </Button>
          </form>

          <form action={rejectPayment} className="w-full">
            <input type="hidden" name="payment_id" value={paymentId} />
            <Button
              type="submit"
              variant="outline"
              className="w-full text-red-600 border-red-200 hover:bg-red-50 mt-2"
            >
              <AlertCircle className="h-4 w-4 mr-2" /> Rejeter le Paiement
            </Button>
          </form>
        </>
      )}

      {status === "verified" && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md w-full">
          <h4 className="font-medium flex items-center gap-1 mb-1">
            <CheckCheck className="h-4 w-4" /> Paiement validé
          </h4>
          <p className="text-sm">
            Ce paiement a été vérifié et validé. La facture a été marquée comme
            payée.
          </p>
        </div>
      )}

      {status === "rejected" && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md w-full">
          <h4 className="font-medium flex items-center gap-1 mb-1">
            <AlertCircle className="h-4 w-4" /> Paiement rejeté
          </h4>
          <p className="text-sm">
            Ce paiement a été rejeté. Le client devra effectuer un nouveau
            paiement.
          </p>
        </div>
      )}
    </>
  );
}
