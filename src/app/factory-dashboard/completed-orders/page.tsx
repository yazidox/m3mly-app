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
import { FileText, Eye, DollarSign, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";
import { formatCurrency } from "@/lib/formatters";

export default async function CompletedOrdersPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/factory-dashboard/completed-orders");
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

  // Fetch completed orders for this factory that don't have invoices yet
  const { data: completedOrders, error: ordersError } = await supabase
    .from("orders")
    .select("*, products(name, image)")
    .eq("factory_id", userData.factory_id)
    .eq("status", "completed")
    .eq("payment_status", "unpaid")
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching completed orders:", ordersError);
  }

  // Fetch orders that already have invoices
  const { data: invoicedOrders, error: invoicedError } = await supabase
    .from("orders")
    .select("*, products(name, image), invoices(id, invoice_number, status)")
    .eq("factory_id", userData.factory_id)
    .eq("status", "completed")
    .eq("payment_status", "invoiced")
    .order("created_at", { ascending: false });

  if (invoicedError) {
    console.error("Error fetching invoiced orders:", invoicedError);
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/factory-dashboard/invoices">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Invoices
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Generate Invoices</h1>
            <p className="text-muted-foreground">
              Create invoices for completed orders
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Orders without invoices */}
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                Completed Orders Without Invoices
              </h2>
              <p className="text-muted-foreground">
                Generate invoices for these completed orders
              </p>
            </div>

            {completedOrders && completedOrders.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Completed Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        #{order.id.substring(0, 8)}
                      </TableCell>
                      <TableCell>{order.full_name}</TableCell>
                      <TableCell>{order.products?.name}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        {formatCurrency(Number(order.total_price))}
                      </TableCell>
                      <TableCell>
                        {new Date(
                          order.updated_at || order.created_at,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/factory-dashboard/orders/${order.id}/invoice`}
                        >
                          <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            Generate Invoice
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Pending Invoices
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  All completed orders have been invoiced. Check the invoices
                  section to manage existing invoices.
                </p>
              </div>
            )}
          </div>

          {/* Orders with invoices */}
          {invoicedOrders && invoicedOrders.length > 0 && (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  Recently Generated Invoices
                </h2>
                <p className="text-muted-foreground">
                  Invoices already generated for completed orders
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.invoices?.[0]?.invoice_number}
                      </TableCell>
                      <TableCell>#{order.id.substring(0, 8)}</TableCell>
                      <TableCell>{order.full_name}</TableCell>
                      <TableCell>{order.products?.name}</TableCell>
                      <TableCell>
                        {formatCurrency(Number(order.total_price))}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.invoices?.[0]?.status === "paid"
                              ? "success"
                              : "outline"
                          }
                        >
                          {order.invoices?.[0]?.status || "unpaid"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/factory-dashboard/invoices/${order.invoices?.[0]?.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
