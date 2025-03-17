import { createClient } from "../../../../../supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { payment_id?: string; invoice_id?: string; order_id?: string };
}) {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/payment-methods/success");
  }

  // Get payment details if payment_id is provided
  let payment = null;
  let invoice = null;
  let order = null;

  if (searchParams.payment_id) {
    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("id", searchParams.payment_id)
      .eq("user_id", user.id)
      .single();

    payment = paymentData;

    // If payment has invoice_id, fetch invoice
    if (payment?.invoice_id) {
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", payment.invoice_id)
        .single();

      invoice = invoiceData;
    }

    // If payment has order_id, fetch order
    if (payment?.order_id) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("*")
        .eq("id", payment.order_id)
        .single();

      order = orderData;
    }
  } else if (searchParams.invoice_id) {
    // If only invoice_id is provided
    const { data: invoiceData } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", searchParams.invoice_id)
      .single();

    invoice = invoiceData;

    // Get the latest payment for this invoice
    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("invoice_id", searchParams.invoice_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    payment = paymentData;
  } else if (searchParams.order_id) {
    // If only order_id is provided
    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("id", searchParams.order_id)
      .single();

    order = orderData;

    // Get the latest payment for this order
    const { data: paymentData } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", searchParams.order_id)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    payment = paymentData;
  }

  // If no payment found, redirect to dashboard
  if (!payment) {
    return redirect("/dashboard?tab=invoices&error=payment_not_found");
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            Paiement soumis avec succès
          </CardTitle>
          <CardDescription className="text-center text-base">
            Votre paiement a été enregistré et est en attente de vérification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-white dark:bg-black/20 rounded-lg p-4 border border-green-100 dark:border-green-900/50">
              <h3 className="font-medium mb-2">Détails du paiement</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div>Montant:</div>
                <div className="font-medium">
                  {formatCurrency(payment.amount)}
                </div>

                <div>Méthode:</div>
                <div className="font-medium">
                  {payment.payment_method_type === "bank_transfer"
                    ? "Virement bancaire"
                    : payment.payment_method_type === "wafacash"
                      ? "WafaCash"
                      : payment.payment_method_type}
                </div>

                <div>Référence:</div>
                <div className="font-medium">{payment.reference}</div>

                <div>Statut:</div>
                <div className="font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                    En attente de vérification
                  </span>
                </div>
              </div>
            </div>

            {invoice && (
              <div className="bg-white dark:bg-black/20 rounded-lg p-4 border">
                <h3 className="font-medium mb-2">Détails de la facture</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Numéro de facture:</div>
                  <div className="font-medium">#{invoice.invoice_number}</div>

                  <div>Statut:</div>
                  <div className="font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                      En attente de paiement
                    </span>
                  </div>
                </div>
              </div>
            )}

            {order && (
              <div className="bg-white dark:bg-black/20 rounded-lg p-4 border">
                <h3 className="font-medium mb-2">Détails de la commande</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div>Numéro de commande:</div>
                  <div className="font-medium">#{order.id.substring(0, 8)}</div>

                  <div>Statut de paiement:</div>
                  <div className="font-medium">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                      En attente de vérification
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-100 dark:border-blue-900/50">
              <h3 className="font-medium mb-2">Prochaines étapes</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Notre équipe vérifiera votre paiement dans les plus brefs
                  délais
                </li>
                <li>
                  Vous recevrez une notification par email une fois le paiement
                  confirmé
                </li>
                <li>
                  Vous pouvez suivre le statut de votre paiement dans votre
                  tableau de bord
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center border-t pt-6">
          <Button asChild variant="outline">
            <a href="/dashboard?tab=invoices">Voir mes factures</a>
          </Button>
          <Button asChild>
            <a href="/dashboard">Retour au tableau de bord</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
