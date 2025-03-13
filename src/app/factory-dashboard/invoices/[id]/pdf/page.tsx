import { createClient } from "../../../../../../supabase/server";
import { notFound, redirect } from "next/navigation";
import { FileText, Download, Printer } from "lucide-react";
import PrintButton from "@/components/print-button";
import { formatCurrency } from "@/lib/formatters";

export default async function InvoicePdfPage({
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
    <div className="min-h-screen bg-background relative overflow-hidden print:bg-white print:p-0" id="invoice-pdf">
      {/* Background elements - only visible on screen */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5 print:hidden" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 print:hidden" />
      
      {/* Animated background shapes - only visible on screen */}
      <div className="absolute inset-0 overflow-hidden print:hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/15 rounded-full filter blur-3xl opacity-70 animate-blob" />
        <div className="absolute top-60 -right-20 w-80 h-80 bg-accent/25 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000" />
        <div className="absolute bottom-40 left-20 w-60 h-60 bg-secondary/20 rounded-full filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
      </div>
      
      {/* Print-optimized invoice */}
      <div className="max-w-4xl mx-auto p-8 relative">
        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border shadow-xl p-8 print:bg-white print:p-4 print:shadow-none print:border-none">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent print:text-black">FACTURE</h1>
              <p className="text-muted-foreground print:text-gray-600">#{invoice.invoice_number}</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-xl">{userData.factories.name}</div>
              <div className="text-muted-foreground print:text-gray-600">{userData.factories.location}</div>
              <div className="text-muted-foreground print:text-gray-600">
                info@{userData.factories.name.toLowerCase().replace(/\s+/g, "")}
                .com
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg border border-border/50 print:bg-white print:border-gray-200">
              <h2 className="text-sm font-semibold text-primary mb-3 print:text-gray-500">
                FACTURER À
              </h2>
              <p className="font-semibold">{order.full_name}</p>
              <p>{order.company}</p>
              <p className="whitespace-pre-line">{order.shipping_address}</p>
              <p>{order.email}</p>
            </div>
            <div className="bg-secondary/30 backdrop-blur-sm p-6 rounded-lg border border-border/50 print:bg-white print:border-gray-200">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-sm font-semibold text-primary mb-3 print:text-gray-500">
                    DATE DE FACTURATION
                  </h2>
                  <p>{new Date(invoice.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-primary mb-3 print:text-gray-500">
                    DATE D'ÉCHÉANCE
                  </h2>
                  <p>
                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h2 className="text-sm font-semibold text-primary mb-3 print:text-gray-500">
                  STATUT
                </h2>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  invoice.status === "paid" 
                    ? "bg-green-100 text-green-800 print:text-green-600" 
                    : "bg-amber-100 text-amber-800 print:text-orange-600"
                }`}>
                  {invoice.status === "paid" ? "PAYÉ" : "EN ATTENTE"}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-lg border border-border print:border-gray-200">
            <table className="w-full border-collapse bg-card/50 backdrop-blur-sm print:bg-white">
              <thead className="bg-secondary/50 print:bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-primary font-medium print:text-gray-700">Description</th>
                  <th className="text-right py-3 px-4 text-primary font-medium print:text-gray-700">Quantité</th>
                  <th className="text-right py-3 px-4 text-primary font-medium print:text-gray-700">Prix unitaire</th>
                  <th className="text-right py-3 px-4 text-primary font-medium print:text-gray-700">Montant</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border/50 print:border-gray-200">
                  <td className="py-4 px-4">
                    <div className="font-medium">{order.products.name}</div>
                    <div className="text-sm text-muted-foreground print:text-gray-500">
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
              <tfoot className="bg-secondary/30 print:bg-gray-50">
                <tr className="border-t border-border print:border-gray-300">
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
                  <td className="text-right py-3 px-4 font-bold text-primary print:text-gray-900">
                    Total à payer
                  </td>
                  <td className="text-right py-3 px-4 font-bold text-primary print:text-gray-900">
                    {formatCurrency(Number(invoice.amount))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {invoice.notes && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-primary mb-3 print:text-gray-500">NOTES</h2>
              <p className="p-4 bg-secondary/30 backdrop-blur-sm rounded-lg border border-border/50 print:bg-gray-50 print:border-gray-200">{invoice.notes}</p>
            </div>
          )}

          <div className="text-center text-muted-foreground mt-12 border-t border-border pt-6 print:text-gray-500 print:border-gray-200">
            <p>Merci pour votre confiance !</p>
            <p>
              Paiement dû avant le{" "}
              {invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString('fr-FR')
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Download button - only visible on screen, not when printing */}
        <div className="mt-8 flex justify-center gap-4 print:hidden">
          <PrintButton className="group relative inline-flex items-center px-6 py-3 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden">
            <span className="relative z-10 flex items-center">
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </PrintButton>
          
          <PrintButton className="group relative inline-flex items-center px-6 py-3 text-foreground bg-secondary/80 rounded-xl hover:bg-secondary transition-all text-base font-medium border border-border overflow-hidden">
            <span className="relative z-10 flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </PrintButton>
        </div>
      </div>
    </div>
  );
}
