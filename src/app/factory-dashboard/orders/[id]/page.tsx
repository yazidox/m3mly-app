import { createClient } from "../../../../../supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateOrderStatus } from "@/app/actions/products";
import { ArrowLeft, Calendar, Package, User } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import FactoryDashboardNavbar from "@/components/factory-dashboard-navbar";

export default async function ManageOrderPage({
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

  // Fetch order data
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, products(name, image)")
    .eq("id", params.id)
    .eq("factory_id", userData.factory_id)
    .single();

  if (orderError || !order) {
    console.error("Error fetching order:", orderError);
    return notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <FactoryDashboardNavbar factory={userData.factories} />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/factory-dashboard?tab=orders"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux Commandes
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    Commande #{order.id.substring(0, 8)}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Passée le{" "}
                      {new Date(order.created_at).toLocaleDateString()}
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
                  className="text-sm py-1 px-3"
                >
                  {order.status === "pending" ? "En attente" :
                   order.status === "processing" ? "En traitement" :
                   order.status === "shipped" ? "Expédiée" :
                   order.status === "completed" ? "Terminée" :
                   order.status === "cancelled" ? "Annulée" : order.status}
                </Badge>
              </div>

              <div className="border-t border-border pt-6">
                <h2 className="text-lg font-semibold mb-4">Détails du Produit</h2>
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium">{order.products?.name}</h3>
                    <div className="text-sm text-muted-foreground mb-2">
                      Quantité: {order.quantity}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Couleur:</span>{" "}
                        {order.color}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Taille:</span>{" "}
                        {order.size}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Matériau:</span>{" "}
                        {order.material}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-6 pt-6">
                <h2 className="text-lg font-semibold mb-4">Détails du Client</h2>
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md p-2 flex items-center justify-center">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div>
                      <div className="font-medium">{order.full_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {order.email}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.phone}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.company}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Adresse de Livraison</div>
                      <div className="text-sm text-muted-foreground whitespace-pre-line">
                        {order.shipping_address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="border-t border-border mt-6 pt-6">
                  <h2 className="text-lg font-semibold mb-2">Notes de Commande</h2>
                  <p className="text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </div>

            <div className="bg-card rounded-xl border shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Détails de Paiement</h2>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">Sous-total</span>
                <span>MAD{(Number(order.total_price) * 0.9).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">TVA (10%)</span>
                <span>MAD{(Number(order.total_price) * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center py-2 font-medium">
                <span>Total</span>
                <span className="text-lg">
                  MAD{Number(order.total_price).toFixed(2)}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Statut de Paiement
                </span>
                <Badge
                  variant={
                    order.payment_status === "paid"
                      ? "success"
                      : order.payment_status === "partial"
                        ? "default"
                        : "outline"
                  }
                >
                  {order.payment_status === "paid" ? "Payé" :
                   order.payment_status === "partial" ? "Partiel" :
                   order.payment_status === "unpaid" ? "Non payé" : 
                   order.payment_status || "Non payé"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Update Order Status Form */}
          <div className="md:col-span-1">
            <div className="bg-card rounded-xl border shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">
                Mettre à Jour le Statut
              </h2>
              <form action={updateOrderStatus} className="space-y-4">
                <input type="hidden" name="order_id" value={order.id} />

                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={order.status}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="pending">En attente</option>
                    <option value="processing">En traitement</option>
                    <option value="shipped">Expédiée</option>
                    <option value="completed">Terminée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_delivery">
                    Date de Livraison Estimée
                  </Label>
                  <Input
                    id="estimated_delivery"
                    name="estimated_delivery"
                    type="date"
                    defaultValue={
                      order.estimated_delivery
                        ? new Date(order.estimated_delivery)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes pour le Client</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    defaultValue={order.factory_notes || ""}
                    placeholder="Ajoutez des notes concernant le statut de la commande, les détails d'expédition, etc."
                  />
                </div>

                <Button type="submit" className="w-full">
                  Mettre à Jour la Commande
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
