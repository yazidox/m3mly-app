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
import { Truck, Eye, Package, MapPin, Sparkles, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <div>
           
            <h1 className="text-4xl font-bold mb-2 tracking-tight">
              Mes <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-text-shimmer relative after:absolute after:content-[''] after:bottom-0 after:left-0 after:w-full after:h-[6px] after:bg-gradient-to-r after:from-primary/30 after:to-accent/30 after:-rotate-1">Expéditions</span> en Cours
            </h1>
            <p className="text-muted-foreground">
              Suivez vos commandes et expéditions en temps réel
            </p>
          </div>
          <Link href="/factories">
            <Button className="group relative inline-flex items-center px-6 py-2 text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-glow hover:shadow-primary/40 text-base font-medium overflow-hidden">
              <span className="relative z-10 flex items-center">
                Explorer les Usines
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </Link>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
          {shipments && shipments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro de Suivi</TableHead>
                  <TableHead>Date de Commande</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Usine</TableHead>
                  <TableHead>Date de Livraison</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id} className="hover:bg-primary/5 transition-colors">
                    <TableCell className="font-medium">
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
                        : "En attente"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          shipment.status === "completed"
                            ? "success"
                            : "default"
                        }
                        className="px-3 py-1"
                      >
                        {shipment.status === "completed"
                          ? "Livré"
                          : "En Transit"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/orders/${shipment.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Truck className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-lg font-medium mb-2">Pas encore d'expéditions</p>
              <p className="max-w-md mx-auto mb-6">
                Vous n'avez pas encore d'expéditions actives. Lorsque vos commandes seront
                traitées et expédiées, elles apparaîtront ici.
              </p>
              <Link href="/factories">
                <Button variant="outline" size="sm" className="mt-4 group relative inline-flex items-center px-6 py-2 rounded-xl hover:bg-primary/10 transition-all text-base font-medium overflow-hidden">
                  <span className="relative z-10 flex items-center">
                    Explorer les Usines
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </div>

        {shipments &&
          shipments.length > 0 &&
          shipments.some((s) => s.status === "processing") && (
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-sm p-6 mt-8 hover:shadow-md transition-all duration-300">
              <h2 className="text-xl font-semibold mb-4">Suivi d'Expédition</h2>
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
                            Numéro de Suivi: TRK-
                            {shipment.id.substring(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <Badge variant="default" className="px-3 py-1">En Transit</Badge>
                      </div>

                      <div className="relative">
                        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-muted-foreground/20"></div>

                        <div className="relative pl-8 pb-8">
                          <div className="absolute left-0 rounded-full bg-primary w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                          <div>
                            <p className="font-medium">Commande Traitée</p>
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
                            <p className="font-medium">Expédié depuis l'Usine</p>
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
                              En Transit
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Arrivée estimée dans 2 jours
                            </p>
                          </div>
                        </div>

                        <div className="relative pl-8">
                          <div className="absolute left-0 rounded-full bg-muted-foreground/20 w-5 h-5 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-muted"></div>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">
                              Livré
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {shipment.estimated_delivery
                                ? new Date(
                                    shipment.estimated_delivery,
                                  ).toLocaleDateString()
                                : "En attente"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Adresse de Livraison</p>
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
    </div>
  );
}
