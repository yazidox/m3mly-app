import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Printer,
  DollarSign,
  Download,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import InvoiceActionButton from "@/components/invoice-action-button";
import InvoicePdfModal from "@/components/invoice-pdf-modal";
import PrintButtonClient from "@/components/print-button-client";
import { formatCurrency } from "@/lib/formatters";

export default async function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard");
  }

  // Check if user is a factory owner
  const { data: userData } = await supabase
    .from("users")
    .select("*, factories(*)")
    .eq("id", user.id)
    .single();

  if (!userData || userData.role !== "factory_owner" || !userData.factory_id) {
    return redirect("/dashboard?error=not_factory_owner");
  }

  // Fetch invoice data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, orders(*, products(name, price))")
    .eq("id", params.id)
    .eq("factory_id", userData.factory_id)
    .single();

  if (invoiceError || !invoice) {
    console.error("Error fetching invoice:", invoiceError);
    return notFound();
  }

  const order = invoice.orders;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FactoryDashboardNavbar factory={userData.factories} />
      
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-60 -right-20 w-80 h-80 bg-accent/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute bottom-40 left-20 w-60 h-60 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        <Link
          href="/factory-dashboard/invoices"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux Factures
        </Link>

        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-xl p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">FACTURE</h1>
              <p className="text-muted-foreground">#{invoice.invoice_number}</p>
            </div>
            <div className="flex gap-2">
              <PrintButtonClient invoiceId={invoice.id} invoiceNumber={invoice.invoice_number}>
                <Button variant="outline" className="flex items-center gap-2 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <Printer className="h-4 w-4 mr-2" />
                    <span>Imprimer</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </PrintButtonClient>
              <InvoicePdfModal
                invoiceId={invoice.id}
                invoiceNumber={invoice.invoice_number}
              >
                <Button variant="outline" className="flex items-center gap-2 group relative overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    <span>Voir PDF</span>
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </InvoicePdfModal>
              {invoice.status !== "paid" && (
                <InvoiceActionButton
                  invoiceId={invoice.id}
                  orderId={order.id}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg border border-border/50">
              <h2 className="text-sm font-semibold text-primary mb-3">
                DE
              </h2>
              <p className="font-semibold">{userData.factories.name}</p>
              <p>{userData.factories.location}</p>
              <p>
                info@{userData.factories.name.toLowerCase().replace(/\s+/g, "")}
                .com
              </p>
            </div>
            <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg border border-border/50">
              <h2 className="text-sm font-semibold text-primary mb-3">
                FACTURER À
              </h2>
              <p className="font-semibold">{order.full_name}</p>
              <p>{order.company}</p>
              <p className="whitespace-pre-line">{order.shipping_address}</p>
              <p>{order.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-lg border border-border/50">
              <h2 className="text-sm font-semibold text-primary mb-3">
                DATE DE FACTURATION
              </h2>
              <p>{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</p>
            </div>
            <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-lg border border-border/50">
              <h2 className="text-sm font-semibold text-primary mb-3">
                DATE D'ÉCHÉANCE
              </h2>
              <p>
                {invoice.due_date
                  ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
                  : "N/A"}
              </p>
            </div>
            <div className="bg-secondary/30 backdrop-blur-sm p-4 rounded-lg border border-border/50">
              <h2 className="text-sm font-semibold text-primary mb-3">
                STATUT
              </h2>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                invoice.status === "paid" 
                  ? "bg-green-100 text-green-800" 
                  : invoice.status === "overdue"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
              }`}>
                {invoice.status === "paid" ? "PAYÉ" : invoice.status === "overdue" ? "EN RETARD" : "EN ATTENTE"}
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-lg border border-border">
            <table className="w-full border-collapse bg-card/50 backdrop-blur-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="text-left py-3 px-4 text-primary font-medium">Description</th>
                  <th className="text-right py-3 px-4 text-primary font-medium">Quantité</th>
                  <th className="text-right py-3 px-4 text-primary font-medium">Prix unitaire</th>
                  <th className="text-right py-3 px-4 text-primary font-medium">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/50">
                  <td className="py-4 px-4">
                    <div className="font-medium">{order.products.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Commande #{order.id.substring(0, 8)}
                    </div>
                  </td>
                  <td className="text-right py-4 px-4">{order.quantity}</td>
                  <td className="text-right py-4 px-4">
                    {formatCurrency(Number(order.products.price))}
                  </td>
                  <td className="text-right py-4 px-4 font-medium">
                    {formatCurrency(
                      order.quantity * Number(order.products.price),
                    )}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-secondary/30">
                <tr className="border-t border-border">
                  <td colSpan={2}></td>
                  <td className="text-right py-3 px-4 font-medium">Sous-total</td>
                  <td className="text-right py-3 px-4">
                    {formatCurrency(Number(invoice.amount))}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="text-right py-3 px-4 font-medium">TVA (0%)</td>
                  <td className="text-right py-3 px-4">{formatCurrency(0)}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="text-right py-3 px-4 font-bold text-primary">
                    Total à payer
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-primary">
                    {formatCurrency(Number(invoice.amount))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {invoice.notes && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-primary mb-3">
                NOTES
              </h2>
              <p className="p-4 bg-secondary/30 backdrop-blur-sm rounded-lg border border-border/50">{invoice.notes}</p>
            </div>
          )}

          <div className="text-center text-muted-foreground mt-12 border-t border-border pt-6">
            <p>Merci pour votre confiance !</p>
            <p>
              Paiement dû avant le{" "}
              {invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
