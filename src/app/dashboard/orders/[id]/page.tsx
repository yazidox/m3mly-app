import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Package,
  Truck,
  FileText,
  MapPin,
  Clock,
  User,
  Building,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { t } from "@/lib/i18n/server";

export default async function OrderDetailPage({
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
    return redirect("/sign-in?redirect_to=/dashboard/orders");
  }

  // Fetch order data
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products(name, price, image), factories(name, location)")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    return notFound();
  }

  // Fetch invoice for this order if it exists
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number, status")
    .eq("order_id", order.id)
    .maybeSingle();

  // Helper function to translate status
  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return t("dashboard.status_pending");
      case "processing":
        return t("dashboard.status_processing");
      case "completed":
        return t("dashboard.status_completed");
      case "cancelled":
        return t("dashboard.status_cancelled");
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux commandes
      </Link>

      <div className="bg-card rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              Order #{order.id.substring(0, 8)}
            </h1>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
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
            className="text-sm px-3 py-1"
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Product Information
              </h2>
              <div className="flex gap-4">
                <div className="h-20 w-20 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {order.products?.image ? (
                    <img
                      src={order.products.image}
                      alt={order.products?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Package className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">
                    {order.products?.name}
                  </h3>
                  <p className="text-muted-foreground">
                    {formatCurrency(Number(order.products?.price))} per unit
                  </p>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p className="font-medium">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium">
                        {formatCurrency(Number(order.total_price))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">
                Factory Information
              </h2>
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{order.factories?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.factories?.location}
                  </p>
                </div>
              </div>
            </div>

            {order.notes && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Order Notes</h2>
                <div className="bg-muted/30 p-4 rounded-md">
                  <p>{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Customer Information</p>
                    <p>{order.full_name}</p>
                    <p>{order.email}</p>
                    {order.phone && <p>{order.phone}</p>}
                    {order.company && <p>{order.company}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Shipping Address</p>
                    <p className="whitespace-pre-line">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                {order.estimated_delivery && (
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p>
                        {new Date(
                          order.estimated_delivery,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Order Status</p>
                    <div className="flex items-center gap-2">
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
                        {translateStatus(order.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Payment Status</p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          order.payment_status === "paid"
                            ? "success"
                            : order.payment_status === "invoiced"
                              ? "default"
                              : "outline"
                        }
                      >
                        {order.payment_status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Invoice</h2>
                <div className="bg-muted/30 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        Invoice #{invoice.invoice_number}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: {invoice.status}
                      </p>
                    </div>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        {t("dashboard.view_details")} Invoice
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {order.status === "processing" && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Tracking</h2>
                <div className="relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>

                  <div className="relative pl-8 pb-8">
                    <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-8 pb-8">
                    <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          order.updated_at || order.created_at,
                        ).toLocaleDateString()}
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
                        {order.estimated_delivery
                          ? new Date(
                              order.estimated_delivery,
                            ).toLocaleDateString()
                          : "Estimated date not available"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t pt-6">
          <Link href="/dashboard/orders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
          {invoice && (
            <Link href={`/dashboard/invoices/${invoice.id}`}>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Invoice
              </Button>
            </Link>
          )}
          <Link href={`/factory/${order.factory_id}`}>
            <Button variant="outline">
              <Building className="h-4 w-4 mr-2" />
              View Factory
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
