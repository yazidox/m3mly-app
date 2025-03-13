import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Eye } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import MarkInvoicePaidButton from "@/components/mark-invoice-paid-button";
import InvoicePdfModal from "@/components/invoice-pdf-modal";

export default async function InvoicesPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/invoices");
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

  // Fetch invoices for this factory
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*, orders(id, full_name, total_price)")
    .eq("factory_id", userData.factory_id)
    .order("created_at", { ascending: false });

  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError);
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Invoices</h1>
            <p className="text-muted-foreground">
              Manage and track customer invoices
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/factory-dashboard/completed-orders">
              <Button variant="outline">Generate Invoices</Button>
            </Link>
            <Link href="/factory-dashboard?tab=orders">
              <Button>View Orders</Button>
            </Link>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {invoices && invoices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>#{invoice.order_id.substring(0, 8)}</TableCell>
                    <TableCell>{invoice.orders?.full_name}</TableCell>
                    <TableCell>
                      {formatCurrency(Number(invoice.amount))}
                    </TableCell>
                    <TableCell>
                      {invoice.due_date
                        ? new Date(invoice.due_date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <div className="flex gap-2">
                          <Link
                            href={`/factory-dashboard/invoices/${invoice.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                          <InvoicePdfModal
                            invoiceId={invoice.id}
                            invoiceNumber={invoice.invoice_number}
                          />
                        </div>
                        {invoice.status !== "paid" && (
                          <MarkInvoicePaidButton
                            invoiceId={invoice.id}
                            orderId={invoice.order_id}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Invoices Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't created any invoices yet. Generate invoices for your
                orders to track payments.
              </p>
              <Link href="/factory-dashboard?tab=orders">
                <Button>View Orders</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
