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
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/formatters";
import { t } from "@/lib/i18n/server";
import { cn } from "@/lib/utils";

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
        return "En attente";
      case "processing":
        return "En traitement";
      case "completed":
        return "Terminée";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  // Helper function to translate payment status
  const translatePaymentStatus = (status: string) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "invoiced":
        return "Facturée";
      case "pending":
        return "En attente";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-5 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-accent/15 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <Link
        href="/dashboard/orders"
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux commandes
      </Link>

      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border shadow-sm p-8 hover:shadow-md transition-all">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <div className="mb-3 inline-flex items-center px-4 py-1.5 rounded-full bg-primary/15 text-primary text-sm font-medium backdrop-blur-sm border border-primary/20 shadow-glow">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="relative">DÉTAILS DE LA COMMANDE</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Commande #{order.id.substring(0, 8)}
            </h1>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Passée le {new Date(order.created_at).toLocaleDateString('fr-FR')}
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
            className="text-sm px-4 py-1.5"
          >
            {translateStatus(order.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Package className="h-5 w-5 mr-2 text-primary" />
                Informations du Produit
              </h2>
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-md bg-muted flex items-center justify-center overflow-hidden">
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
                    {formatCurrency(Number(order.products?.price))} par unité
                  </p>
                  <div className="flex gap-6 mt-3">
                    <div className="bg-primary/10 px-3 py-1.5 rounded-lg">
                      <p className="text-sm text-primary font-medium">Quantité</p>
                      <p className="font-semibold">{order.quantity}</p>
                    </div>
                    <div className="bg-primary/10 px-3 py-1.5 rounded-lg">
                      <p className="text-sm text-primary font-medium">Total</p>
                      <p className="font-semibold">
                        {formatCurrency(Number(order.total_price))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Building className="h-5 w-5 mr-2 text-primary" />
                Informations de l'Usine
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-primary/15 text-primary rounded-full p-3 border border-primary/20 shadow-glow">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-lg">{order.factories?.name}</p>
                  <p className="text-muted-foreground">
                    {order.factories?.location}
                  </p>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-lg transition-all">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Notes de Commande
                </h2>
                <div className="bg-muted/30 p-4 rounded-md border border-border">
                  <p>{order.notes}</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Détails de la Commande
              </h2>
              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Informations Client</p>
                    <p>{order.full_name}</p>
                    <p>{order.email}</p>
                    {order.phone && <p>{order.phone}</p>}
                    {order.company && <p>{order.company}</p>}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Adresse de Livraison</p>
                    <p className="whitespace-pre-line">
                      {order.shipping_address}
                    </p>
                  </div>
                </div>

                {order.estimated_delivery && (
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow mt-0.5">
                      <Truck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">Livraison Estimée</p>
                      <p>
                        {new Date(
                          order.estimated_delivery,
                        ).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Statut de la Commande</p>
                    <div className="flex items-center gap-2 mt-1">
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
                        className="px-3 py-1"
                      >
                        {translateStatus(order.status)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/15 text-primary rounded-full p-2 border border-primary/20 shadow-glow mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Statut du Paiement</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant={
                          order.payment_status === "paid"
                            ? "success"
                            : order.payment_status === "invoiced"
                              ? "default"
                              : "outline"
                        }
                        className="px-3 py-1"
                      >
                        {translatePaymentStatus(order.payment_status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {invoice && (
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-lg transition-all">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Facture
                </h2>
                <div className="bg-muted/30 p-5 rounded-md border border-border">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-lg">
                        Facture #{invoice.invoice_number}
                      </p>
                      <p className="text-muted-foreground">
                        Statut: {translatePaymentStatus(invoice.status)}
                      </p>
                    </div>
                    <Link href={`/dashboard/invoices/${invoice.id}`}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="group relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center">
                          <FileText className="h-4 w-4 mr-2" />
                          Voir la Facture
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {order.status === "processing" && (
              <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6 hover:border-primary/20 hover:shadow-lg transition-all">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Truck className="h-5 w-5 mr-2 text-primary" />
                  Suivi de Commande
                </h2>
                <div className="relative">
                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-primary/20"></div>

                  <div className="relative pl-8 pb-8">
                    <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">Commande Passée</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-8 pb-8">
                    <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">En Traitement</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          order.updated_at || order.created_at,
                        ).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 rounded-full bg-muted-foreground/20 w-5 h-5 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted"></div>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">
                        Livraison
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.estimated_delivery
                          ? new Date(
                              order.estimated_delivery,
                            ).toLocaleDateString('fr-FR')
                          : "Date estimée non disponible"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 border-t border-border pt-6">
          <Link href="/dashboard/orders">
            <Button 
              variant="outline"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux Commandes
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
          
          {invoice && (
            <Link href={`/dashboard/invoices/${invoice.id}`}>
              <Button 
                variant="outline"
                className="group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir la Facture
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </Link>
          )}
          
          <Link href={`/factory/${order.factory_id}`}>
            <Button 
              variant="outline"
              className="group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Voir l'Usine
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-secondary/50 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-6 justify-center">
        <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span>Paiement sécurisé</span>
        </div>
        <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span>Qualité garantie</span>
        </div>
        <div className="flex items-center gap-2 backdrop-blur-sm bg-background/50 px-4 py-2 rounded-full border border-border/50 hover:border-primary/50 hover:bg-background/70 transition-all hover:scale-105">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span>Support client 24/7</span>
        </div>
      </div>
    </div>
  );
}
