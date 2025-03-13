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
import { ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import DashboardNavbar from "@/components/dashboard-navbar";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/orders");
  }

  // Fetch user's orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("*, products(name, image), factories(name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Orders</h1>
            <p className="text-muted-foreground">
              Track and manage your product orders
            </p>
          </div>
          <Link href="/factories">
            <Button>Browse Factories</Button>
          </Link>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          {orders && orders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Factory</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.substring(0, 8)}
                    </TableCell>
                    <TableCell>{order.products?.name}</TableCell>
                    <TableCell>{order.factories?.name}</TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      ${Number(order.total_price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "success"
                            : order.status === "processing"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                You haven't placed any orders yet. Browse our factories and
                products to place your first order.
              </p>
              <Link href="/factories">
                <Button>Browse Factories</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
