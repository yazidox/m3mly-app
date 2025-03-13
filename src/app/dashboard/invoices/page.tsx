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
import { FileText, Eye, Download, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";

export default async function UserInvoicesPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/invoices");
  }

  // Fetch invoices for this user
  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*, orders(id, total_price, products(name)), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (invoicesError) {
    console.error("Error fetching invoices:", invoicesError);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes Factures</h1>
        <p className="text-muted-foreground">
          Consultez et gérez vos factures et paiements
        </p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {invoices && invoices.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Amount</TableHead>
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
                  <TableCell>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{invoice.factories?.name}</TableCell>
                  <TableCell>{invoice.orders?.products?.name}</TableCell>
                  <TableCell>
                    {formatCurrency(Number(invoice.amount))}
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
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {invoice.status !== "paid" && (
                        <Button size="sm" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Pay Now
                        </Button>
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
              You don't have any invoices yet. When you place orders, your
              invoices will appear here.
            </p>
            <Link href="/factories">
              <Button>Browse Factories</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
