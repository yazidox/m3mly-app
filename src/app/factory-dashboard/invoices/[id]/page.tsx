import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Printer,
  DollarSign,
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
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/factory-dashboard/invoices"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Link>

        <div className="bg-white rounded-xl border shadow-sm p-8 max-w-4xl mx-auto">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
              <p className="text-muted-foreground">#{invoice.invoice_number}</p>
            </div>
            <div className="flex gap-2">
              <PrintButtonClient />
              <InvoicePdfModal
                invoiceId={invoice.id}
                invoiceNumber={invoice.invoice_number}
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>View PDF</span>
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
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                FROM
              </h2>
              <p className="font-semibold">{userData.factories.name}</p>
              <p>{userData.factories.location}</p>
              <p>
                info@{userData.factories.name.toLowerCase().replace(/\s+/g, "")}
                .com
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                TO
              </h2>
              <p className="font-semibold">{order.full_name}</p>
              <p>{order.company}</p>
              <p className="whitespace-pre-line">{order.shipping_address}</p>
              <p>{order.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                INVOICE DATE
              </h2>
              <p>{new Date(invoice.created_at).toLocaleDateString()}</p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                DUE DATE
              </h2>
              <p>
                {invoice.due_date
                  ? new Date(invoice.due_date).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                STATUS
              </h2>
              <Badge
                variant={
                  invoice.status === "paid"
                    ? "success"
                    : invoice.status === "overdue"
                      ? "destructive"
                      : "outline"
                }
              >
                {invoice.status}
              </Badge>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4">Description</th>
                  <th className="text-right py-3 px-4">Quantity</th>
                  <th className="text-right py-3 px-4">Unit Price</th>
                  <th className="text-right py-3 px-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4">
                    {order.products.name}
                    <div className="text-sm text-muted-foreground">
                      Order #{order.id.substring(0, 8)}
                    </div>
                  </td>
                  <td className="text-right py-3 px-4">{order.quantity}</td>
                  <td className="text-right py-3 px-4">
                    {formatCurrency(Number(order.products.price))}
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatCurrency(
                      order.quantity * Number(order.products.price),
                    )}
                  </td>
                </tr>
              </tbody>
              <tfoot className="border-t">
                <tr>
                  <td colSpan={2}></td>
                  <td className="text-right py-3 px-4 font-semibold">
                    Subtotal
                  </td>
                  <td className="text-right py-3 px-4">
                    {formatCurrency(Number(invoice.amount))}
                  </td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="text-right py-3 px-4 font-semibold">
                    Tax (0%)
                  </td>
                  <td className="text-right py-3 px-4">{formatCurrency(0)}</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="text-right py-3 px-4 font-semibold">
                    Total Due
                  </td>
                  <td className="text-right py-3 px-4 font-bold">
                    {formatCurrency(Number(invoice.amount))}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {invoice.notes && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-muted-foreground mb-2">
                NOTES
              </h2>
              <p className="p-4 bg-muted/30 rounded-md">{invoice.notes}</p>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
            <p>
              Payment is due by{" "}
              {invoice.due_date
                ? new Date(invoice.due_date).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
