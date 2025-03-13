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
import { Truck, Eye, Package, MapPin } from "lucide-react";
import Link from "next/link";

export default async function ShipmentsPage() {
  const supabase = await createClient();

  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in?redirect_to=/dashboard/shipments");
  }

  // Fetch orders that are in processing or completed status
  const { data: shipments, error: shipmentsError } = await supabase
    .from("orders")
    .select("*, products(name), factories(name)")
    .eq("user_id", user.id)
    .in("status", ["processing", "completed"])
    .order("created_at", { ascending: false });

  if (shipmentsError) {
    console.error("Error fetching shipments:", shipmentsError);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes Expéditions</h1>
        <p className="text-muted-foreground">
          Suivez vos commandes et expéditions
        </p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
        {shipments && shipments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking #</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Factory</TableHead>
                <TableHead>Delivery Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-medium">
                    {/* Mock tracking number based on order ID */}
                    TRK-{shipment.id.substring(0, 8).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    {new Date(shipment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{shipment.products?.name}</TableCell>
                  <TableCell>{shipment.factories?.name}</TableCell>
                  <TableCell>
                    {shipment.estimated_delivery
                      ? new Date(
                          shipment.estimated_delivery,
                        ).toLocaleDateString()
                      : "Pending"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        shipment.status === "completed" ? "success" : "default"
                      }
                    >
                      {shipment.status === "completed"
                        ? "Delivered"
                        : "In Transit"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/dashboard/orders/${shipment.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Shipments Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              You don't have any active shipments. When your orders are
              processed and shipped, they will appear here.
            </p>
            <Link href="/factories">
              <Button>Browse Factories</Button>
            </Link>
          </div>
        )}
      </div>

      {shipments &&
        shipments.length > 0 &&
        shipments.some((s) => s.status === "processing") && (
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Shipment Tracking</h2>
            <div className="space-y-6">
              {shipments
                .filter((s) => s.status === "processing")
                .slice(0, 1)
                .map((shipment) => (
                  <div key={shipment.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">
                          {shipment.products?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Tracking #: TRK-
                          {shipment.id.substring(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <Badge variant="default">In Transit</Badge>
                    </div>

                    <div className="relative">
                      <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <p className="font-medium">Order Processed</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(shipment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                        <div>
                          <p className="font-medium">Shipped from Factory</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              new Date(shipment.created_at).getTime() +
                                3 * 24 * 60 * 60 * 1000,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 rounded-full bg-muted-foreground/20 w-5 h-5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">
                            In Transit
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Estimated arrival in 2 days
                          </p>
                        </div>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 rounded-full bg-muted-foreground/20 w-5 h-5 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-muted"></div>
                        </div>
                        <div>
                          <p className="font-medium text-muted-foreground">
                            Delivered
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.estimated_delivery
                              ? new Date(
                                  shipment.estimated_delivery,
                                ).toLocaleDateString()
                              : "Pending"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-sm text-muted-foreground">
                          {shipment.shipping_address}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
    </div>
  );
}
