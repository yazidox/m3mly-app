import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  FileText,
  User,
  Printer,
  Download,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
    return redirect("/sign-in?redirect_to=/dashboard/invoices");
  }

  // Fetch invoice data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*, orders(*, products(name, price)), factories(name, location)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (invoiceError || !invoice) {
    console.error("Error fetching invoice:", invoiceError);
    return notFound();
  }

  const order = invoice.orders;
  const factory = invoice.factories;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/invoices"
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
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
            {invoice.status !== "paid" && (
              <Button className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Pay Now</span>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">
              FROM
            </h2>
            <p className="font-semibold">{factory.name}</p>
            <p>{factory.location}</p>
            <p>
              info@{factory.name.toLowerCase().replace(/\s+/g, "")}
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
                <td className="text-right py-3 px-4 font-semibold">Subtotal</td>
                <td className="text-right py-3 px-4">
                  {formatCurrency(Number(invoice.amount))}
                </td>
              </tr>
              <tr>
                <td colSpan={2}></td>
                <td className="text-right py-3 px-4 font-semibold">Tax (0%)</td>
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

        {invoice.status !== "paid" && (
          <div className="mt-8 text-center">
            <Button className="px-8">
              <CreditCard className="h-4 w-4 mr-2" />
              Pay This Invoice
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
